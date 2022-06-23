<?php

namespace Engine\Theme;

use Engine\Define;
use Engine\Module;
use Engine\Request;

class Meta {
	private static $meta = [];

	public static function get($key, $page_obj = null) {
		if(isset(self::$meta[$key])) {
			return self::$meta[$key];
		}

		$value = self::$key($page_obj);

		self::$meta[$key] = $value;

		return $value;
	}

	public static function getAll() {
		return self::$meta;
	}

	public static function no_index_no_follow($page) {
		$no_index_no_follow = '';

		if(site('no_index_no_follow') || $page->no_index_no_follow) {
			$no_index_no_follow = '<meta name="robots" content="noindex, nofollow">';
		}

		return $no_index_no_follow;
	}

	public static function title($page) {
		$page_title = $page->title . ' &#8212; ' . site('name');

		if(Module::$name === 'Admin' || Module::get('extends') === 'Admin') {
			$page_title = $page->title . ' &lsaquo; ' . __('Admin') . ' &#8212; ' . site('name');
		}

		return $page_title;
	}

	public static function seo_image($page) {
		return $page->seo_image ?? site('logo_public');
	}

	public static function seo_description($page) {
		return $page->seo_description ?? site('name') . '. ' . site('description');
	}

	public static function seo_keywords($page) {
		return $page->seo_keywords ?? trim(preg_replace('/[\s\.;]+/', ',', self::get('seo_description', $page)), ',');
	}

	public static function author() {
		return Define::AUTHOR;
	}

	public static function locale() {
		return lang(site('language_current'), 'region');
	}

	public static function setting() {
		return '
			<script>
				let SETTING = {
					language: "' . site('language') . '",
					csrf: {
						key: "' . Define::COOKIE_KEY['csrf'] . '",
						token: "' . Request::$csrf . '"
					}
				};
			</script>
		';
	}

	public static function all($page_obj) {
		$page = clone $page_obj;

		$page->permalink = site('permalink');
		$page->charset = site('charset');

		$page->author = self::author();
		$page->locale = self::locale();

		$page->title = self::title($page);
		$page->seo_image = site('url') . '/' . self::seo_image($page);
		$page->seo_description = self::seo_description($page);
		$page->seo_keywords = self::seo_keywords($page);

		$page->favicon = Asset::url() . '/favicon.ico';
		$page->favicon_svg = Asset::url() . '/favicon.svg';
		$page->favicon_png = Asset::url() . '/favicon.png';

		$page->setting = self::setting();

		$meta = self::no_index_no_follow($page);
		$meta .= '
			<title>' . $page->title . '</title>

			<meta charset="' . $page->charset . '">
			<meta name="author" content="' . $page->author . '">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no">

			<link rel="canonical" href="' . $page->permalink . '">

			<link rel="image_src" href="' . $page->seo_image . '">

			<meta name="description" content="' . $page->seo_description . '">
			<meta name="keywords" content="' . $page->seo_keywords . '">

			<meta property="og:type" content="website">
			<meta property="og:locale" content="' . $page->locale . '">
			<meta property="og:url" content="' . $page->permalink . '">
			<meta property="og:title" content="' . $page->title . '">
			<meta property="og:description" content="' . $page->seo_description . '">
			<meta property="og:keywords" content="' . $page->seo_keywords . '">
			<meta property="og:image" content="' . $page->seo_image . '">

			<meta property="twitter:card" content="summary">
			<meta property="twitter:url" content="' . $page->permalink . '">
			<meta property="twitter:title" content="' . $page->title . '">
			<meta property="twitter:description" content="' . $page->seo_description . '">
			<meta property="twitter:image" content="' . $page->seo_image . '">

			<link rel="icon" href="' . $page->favicon . '" sizes="any">
			<link rel="icon" href="' . $page->favicon_svg . '" type="image/svg+xml">
			<link rel="apple-touch-icon" href="' . $page->favicon_png . '">

			' . $page->setting . '
		';

		return $meta;
	}
}
