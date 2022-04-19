<?php

namespace Engine;

use Engine\Database\Statement;

class Router {
	private static $routes = [];

	public static $route = [];

	public static function initialize() {
		self::checkRoutes();
		self::check404();
		self::setController();
	}

	private static function checkRoutes() {
		$method = Request::$method;
		$uri = (Request::$uri === '/') ? Request::$uri : strtok(trim(Request::$uri, '/'), '?');

		foreach(Module::getAll() as $module => $value) {
			if(!$value['enabled']) {
				continue;
			}

			// Get routes and check them
			if(isset($value['routes']) && !empty($value['routes'])) {
				foreach($value['routes'] as $route) {
					if(self::checkRoute($method, $uri, $module, $route)) {
						return true;
					}
				}
			}

			// Check Form tokens
			if(self::checkForm($method, $uri)) {
				return true;
			}
			
		}

		return true;
	}

	private static function checkRoute($method, $uri, $module, $route) {
		$route_uri = ($route['uri'] === '/') ? $route['uri'] : $route_uri = trim($route['uri'], '/');
		$route_method = strtolower(trim($route['method']));
		
		if($route_method === $method && self::isRouteMatched($route_uri, $uri)) {
			foreach($route as $key => $value) {
				self::$route[$key] = $value;
			}

			Module::setName($module);

			return true;
		}

		self::$route = [];

		return false;
	}

	private static function isRouteMatched($route, $uri) {
		$parameters = [];

		self::$route['parameters'] = $parameters;

		if($route === '/' && $uri === '/') {
			return true;
		}

		$route_parts = explode('/', $route);
		$uri_parts = explode('/', $uri);

		if(count($route_parts) !== count($uri_parts)) {
			return false;
		}
		
		for($__i__ = 0; $__i__ < count($route_parts); $__i__++) {
			$route_part = $route_parts[$__i__];

			if(preg_match('/^[$]/', $route_part)) {
				$found_variable = ltrim($route_part, '$');
				$parameters[$found_variable] = $uri_parts[$__i__];
			} else if($route_parts[$__i__] !== $uri_parts[$__i__]) {
				return false;
			}
		}

		self::$route['parameters'] = $parameters;

		return true;
	}

	private static function checkForm($method, $uri) {
		$statement = new Statement('SELECT * FROM {form}');

		$forms = $statement->prepare()->execute()->fetchAll();

		if(empty($forms)) {
			return false;
		}

		$now_timestamp = time();
		foreach($forms as $form) {
			$cdate_timestamp = strtotime($form->date_created);
			$diff_hours = ($now_timestamp - $cdate_timestamp) / 3600;

			if($method === 'post' && $uri === $form->token) {
				if(intval($diff_hours) < 12) {
					Form::execute($form->action, $form->form_name, $form->item_id);
				} else {
					$language = Language::load('form');
					
					$error_message = 'Current form is already inactive. Reload the page and try again';
					if(isset($language->inactive)) {
						$error_message = $language->inactive;
					}
					
					Server::answer(null, 'error', $error_message, '409');
				}
				exit;
			}
		}

		return false;
	}

	private static function check404() {
		if(empty(self::$route)) {
			Module::setName('Public');

			if(str_starts_with(Request::$uri, '/admin')) {
				Module::setName('Admin');
			}

			self::$route['controller'] = 'Error';
			self::$route['action'] = 'get404';
			self::$route['is_public'] = true;
		}
	}

	private static function setController() {
		$controller_class = Path::class('controller') . '\\' . ucfirst(self::$route['controller']);

		if(class_exists($controller_class)) {
			$controller_action = self::$route['action'];

			if(method_exists($controller_class, $controller_action)) {
				$controller = new $controller_class;
				$controller->$controller_action();
			} else {
				throw new \Exception(sprintf('Action %s does not exist in %s', $controller_action, $controller_class));
			}
		} else {
			throw new \Exception(sprintf('Controller %s does not exist', $controller_class));
		}

		return true;
	}
}
