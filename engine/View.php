<?php

namespace Engine;

use Engine\Theme\Theme;
use Engine\Theme\Template;

class View {
	private static $data = [];

	public function render($template) {
		Template::load('function', false);
		Template::load($template);
	}

	public function error($code) {
		http_response_code($code);
		$this->render('Error/' . $code);
		exit;
	}

	public static function getData() {
		return static::$data;
	}

	public static function setData($data) {
		static::$data += $data;
	}
}
