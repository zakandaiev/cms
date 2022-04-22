<?php

namespace Engine;

abstract class Controller {
	protected $module;
	protected $route;

	protected $view;
	protected $model;

	protected $setting;

	protected $user;

	public function __construct() {
		$this->module = Module::getAll()[Module::$name];
		$this->route = Router::$route;

		$this->view = new View();
		$this->model = $this->loadModel($this->route['controller']);

		$this->setting = Setting::getAll();

		$this->user = Auth::$user;
		if(isset($this->user->socials)) {
			$this->user->socials = json_decode($this->user->socials) ?? [];
		}
	}

	protected function loadModel($model_name) {
		$model_class = Path::class('model') . '\\' . ucfirst($model_name);

		if(class_exists($model_class)) {
			return new $model_class;
		}

		return null;
	}
}
