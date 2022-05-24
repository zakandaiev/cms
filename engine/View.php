<?php

namespace Engine;

use Engine\Theme\Theme;
use Engine\Theme\Template;

class View {
	private static $data = [];

	public function render($template, $is_required = true) {
		Template::load('functions', false);
		Template::load($template, $is_required);
	}

	public function error($code) {
		http_response_code($code);

		$data = $this->getData();
		$data['page']->title = __('Page not found');
		$this->setData($data);

		$this->render('Error/' . $code);

		exit;
	}

	public static function getData() {
		return static::$data;
	}

	public static function setData($data) {
		static::$data = $data + static::$data;
	}
}
