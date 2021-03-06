<?php

namespace Engine;

class Module {
	private static $module = [];
	private static $module_name;

	public static $name;

	public static function initialize() {
		self::loadModules();

		return true;
	}

	public static function get($key, $name = null) {
		return self::$module[$name ?? self::$name][$key] ?? null;
	}

	public static function getSelf($name = null) {
		return self::$module[$name ?? self::$name] ?? null;
	}

	public static function getAll() {
		return self::$module;
	}

	public static function setName($name) {
		self::$name = $name;

		return true;
	}

	private static function loadModules() {
		$module_path = Path::file('module');

		$modules = [];

		foreach(scandir($module_path) as $module) {
			if(in_array($module, ['.', '..'], true)) continue;

			$config_file = $module_path . '/' . $module . '/config.php';

			if(file_exists($config_file)) {
				$config = require $config_file;
			} else {
				continue;
			}

			if(!is_array($config) || empty($config)) {
				throw new \Exception(sprintf($module . '\'s config file %s is invalid', $config_file));
			}

			$config['name'] = $module;
			$modules[] = $config;
		}

		usort($modules, function ($module1, $module2) {
			if(isset($module1['order']) && isset($module2['order'])) {
				return $module1['order'] <=> $module2['order'];
			} else if(isset($module2['order'])) {
				return 1;
			}
			return 0;
		});

		foreach($modules as $module) {
			self::$module[$module['name']] = $module;

			if(!$module['is_enabled']) {
				continue;
			}

			$routes_file = $module_path . '/' . $module['name'] . '/routes.php';
			$hooks_file = $module_path . '/' . $module['name'] . '/hooks.php';
			if($module['name'] === 'Public') {
				$hooks_file = Path::file('theme') . '/hooks.php';
			}

			self::$module_name = $module['name'];

			if(file_exists($routes_file)) {
				require $routes_file;
			}

			if(file_exists($hooks_file)) {
				require $hooks_file;
			}
		}

		return true;
	}

	public static function update($key, $value, $module = null) {
		$name = $module ?? self::$name;
		$config_file = Path::file('module') . '/' . $name . '/config.php';

		if(!file_exists($config_file)) {
			return false;
		}

		if(is_numeric($value)) {
			$value = $value;
		} else if(is_string($value)) {
			$value = "'$value'";
		} else if(is_bool($value)) {
			$value = $value ? 'true' : 'false';
		} else if(is_null($value)) {
			$value = 'null';
		} else {
			return false;
		}

		$config_content = file_get_contents($config_file);

		$replacement = "'$key' => $value";

		if(preg_match('/([\'"]' . $key . '[\'"][\s]*=>)/mi', $config_content)) {
			$pattern = '/([\'"]' . $key . '[\'"][\s]*=>[\s]*[^,\]\n\/#]+)/mi';
		} else {
			$pattern = '/(return[\s]*(\[|array\())/mi';
			$replacement = "$1\n\t" . $replacement . ",";
		}

		$config_content = preg_replace($pattern, $replacement, $config_content);

		static $is_edited = false;

		if(file_put_contents($config_file, $config_content, LOCK_EX)) {
			if(!$is_edited) {
				Log::write('Module: ' . $name. ' edited by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'module');
				Hook::run('module_update', $name);
			}

			$is_edited = true;

			return true;
		}

		return false;
	}

	public static function delete($name) {
		Log::write('Module: ' . $name. ' deleted by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'module');

		Hook::run('module_delete', $name);

		return rmdir_recursive(Path::file('module') . '/' . $name);
	}

	public static function route($method, $uri, $controller, $options = []) {
		list($route_controller, $route_action) = explode('@', $controller, 2);

		if(empty($route_controller) || empty($route_action)) {
			throw new \Exception(sprintf('Invalid controller declaration for %s route in % module', $uri, self::$module_name));
			return false;
		}

		$page = self::formatRouteData('page', @$options['page']);
		$is_public = self::formatRouteData('is_public', @$options['is_public']);
		$breadcrumbs = self::formatRouteData('breadcrumbs', @$options['breadcrumbs']);

		self::$module[self::$module_name]['routes'][] = [
			'method' => $method,
			'uri' => $uri,
			'controller' => $route_controller,
			'action' => $route_action,
			'page' => $page,
			'is_public' => $is_public,
			'breadcrumbs' => $breadcrumbs
		];

		return true;
	}

	private static function formatRouteData($type, $data = null) {
		$formatted = $data;

		switch(strtolower($type ?? '')) {
			case 'page': {
				$formatted = (!empty($data)) ? json_decode(json_encode($data)) : new \stdClass();
				break;
			}
			case 'is_public': {
				$formatted = is_bool($data) ? $data : false;
				break;
			}
			case 'breadcrumbs': {
				$formatted = (!empty($data)) ? json_decode(json_encode($data)) : [];
				break;
			}
		}

		return $formatted;
	}

	public static function install($name) {
		$path = Path::file('module') . '/' . $name . '/Install';

		if(!file_exists($path)) {
			return false;
		}

		self::uninstall($name);

		// INSTALL SCRIPT
		$path_install = $path . '/install.php';

		if(is_file($path_install)) {
			require $path_install;
		}

		// LANGUAGE
		$path_language = $path . '/Language';

		foreach(scandir($path_language) as $language) {
			if(in_array($language, ['.', '..'], true)) continue;

			if(file_extension($language) !== 'ini') continue;

			$content = file_get_contents($path_language . '/' . $language);

			if(empty($content)) continue;

			$main_language = Path::file('language') . '/' . $language;

			$flags = LOCK_EX;
			if(is_file($main_language)) $flags = LOCK_EX | FILE_APPEND;

			$content = PHP_EOL . '# BEGIN Module: ' . $name . PHP_EOL . PHP_EOL . $content . PHP_EOL . '# END Module: ' . $name . PHP_EOL . PHP_EOL;

			file_put_contents($main_language, $content, $flags);
		}

		Log::write('Module: ' . $name. ' installed by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'module');

		Hook::run('module_install', $name);

		return true;
	}

	public static function uninstall($name) {
		$path = Path::file('module') . '/' . $name . '/Install';

		if(!file_exists($path)) {
			return false;
		}

		// UNINSTALL SCRIPT
		$path_install = $path . '/uninstall.php';

		if(is_file($path_install)) {
			require $path_install;
		}

		// LANGUAGE
		$path_language = Path::file('language');

		foreach(Language::getAll() as $language) {
			$lp = $path_language . '/' . $language['file_name'];
			$pattern = '/#[\s]+BEGIN[\s]+Module:[\s]+' . $name . '[\s\S]*#[\s]+END[\s]+Module:[\s]+' . $name . '/mi';
			$content = file_get_contents($lp);
			$content = preg_replace($pattern, '', $content);
			file_put_contents($lp, $content, LOCK_EX);
		}

		Log::write('Module: ' . $name. ' uninstalled by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'module');

		Hook::run('module_uninstall', $name);

		return true;
	}
}
