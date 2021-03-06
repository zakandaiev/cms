<?php

namespace Module\Admin\Controller;

use Engine\Module as ModuleEngine;
use Engine\Request;
use Engine\Server;
use Engine\Theme\Breadcrumb;

class Module extends AdminController {
	public function getAll() {
		$modules = ModuleEngine::getAll();

		$data['modules'] = $modules;

		$this->view->setData($data);
		$this->view->render('module/all');
	}

	public function getEdit() {
		$name = $this->route['parameters']['name'];

		$module = ModuleEngine::getSelf($name);

		if(!isset($module)) {
			$this->view->error('404');
		}

		Breadcrumb::add($module['name']);

		$data['module'] = $module;

		$this->view->setData($data);
		$this->view->render('module/edit');
	}

	public function postEdit() {
		$name = $this->route['parameters']['name'];

		$module = ModuleEngine::getSelf($name);

		if(!isset($module)) {
			$this->view->error('404');
		}

		$order = (!empty(Request::$post['order']) || Request::$post['order'] == '0') ? Request::$post['order'] : null;
		$version = !empty(Request::$post['version']) ? Request::$post['version'] : null;
		$extends = !empty(Request::$post['extends']) ? Request::$post['extends'] : null;
		$description = !empty(Request::$post['description']) ? Request::$post['description'] : null;
		$is_enabled = @Request::$post['is_enabled'] === 'on' ? true : false;

		ModuleEngine::update('order', $order, $module['name']);
		ModuleEngine::update('version', $version, $module['name']);
		ModuleEngine::update('extends', $extends, $module['name']);
		ModuleEngine::update('description', $description, $module['name']);
		ModuleEngine::update('is_enabled', $is_enabled, $module['name']);

		Server::answer(null, 'success');
	}

	public function postDelete() {
		$name = $this->route['parameters']['name'];

		$module = ModuleEngine::getSelf($name);

		if(!isset($module)) {
			$this->view->error('404');
		}

		ModuleEngine::delete($module['name']);

		Server::answer(null, 'success');
	}

	public function postToggle() {
		$name = $this->route['parameters']['name'];

		$module = ModuleEngine::getSelf($name);

		if(!isset($module)) {
			$this->view->error('404');
		}

		ModuleEngine::update('is_enabled', !$module['is_enabled'], $module['name']);

		Server::answer(null, 'success');
	}
}
