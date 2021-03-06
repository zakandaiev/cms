<?php

############################# PHP 8 #############################
if(!function_exists('str_contains')) {
	function str_contains(string $haystack, string $needle):bool {
		return '' === $needle || false !== strpos($haystack, $needle);
	}
}

if(!function_exists('str_starts_with')) {
	function str_starts_with($haystack, $needle) {
		$length = strlen($needle);
		return substr($haystack, 0, $length) === $needle;
	}
}

############################# DEBUG #############################
function debug($obj) {
	echo '<pre>';
	var_dump($obj);
	echo '</pre>';
}

function debug_trace($level = null) {
	return $level ? debug_backtrace()[$level] : debug_backtrace();
}

############################# FILE #############################
function file_name($path) {
	return pathinfo($path, PATHINFO_FILENAME);
}

function file_extension($path) {
	return pathinfo($path, PATHINFO_EXTENSION);
}

function file_size($path, $precision = 2) {
	$size = 0;

	if(is_file($path)) {
		$size = filesize($path);
	} else {
		foreach(glob_recursive($path . '/*.*') as $file) {
			$size += filesize($file);
		}
	}

	$units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  for($i = 0; $size > 1024; $i++) $size /= 1024;

	return round($size, 2) . ' ' . $units[$i];
}

function glob_recursive($pattern, $flags = 0) {
	$files = glob($pattern, $flags);

	foreach(glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
		$files = array_merge($files, glob_recursive($dir . '/' . basename($pattern), $flags));
	}

	return $files;
}

function rmdir_recursive($path) {
  if(is_dir($path)) {
  	$files = array_diff(scandir($path), array('.', '..'));

  	foreach($files as $file) {
			rmdir_recursive(realpath($path) . '/' . $file);
  	}

  	return rmdir($path);
  }
	else if(is_file($path)) {
    return unlink($path);
  }

  return false;
}

############################# IMAGE #############################
function svg($file) {
	$path = Path::file('asset') . '/img/' . trim($file ?? '', '/') . '.svg';

	if(!file_exists($path)) {
		return null;
	} else {
		return file_get_contents($file);
	}
}

function images(array $json, $attributes = '') {
	$output = '';
	$images = json_decode($json);

	foreach($images as $image) {
		$output .= '<img src="' . Request::$base . '/' . $image . '" ' . $attributes . '>';
	}

	return $output;
}

function placeholder_image($path) {
	if(is_file(ROOT_DIR . '/' . $path)) {
		return $path;
	}

	return site(__FUNCTION__);
}

function placeholder_avatar($path) {
	if(is_file(ROOT_DIR . '/' . $path)) {
		return $path;
	}

	return site(__FUNCTION__);
}

############################# FORMAT #############################
function format_date($date = null, $format = null) {
	$timestamp = $date ?? time();
	$timestamp = is_numeric($timestamp) ? $timestamp : strtotime($timestamp);
	return isset($format) ? date($format, $timestamp) : date('d.m.Y', $timestamp) . ' ' . __('at') . ' ' . date('H:i', $timestamp);
}

function format_date_input($date = null) {
	return format_date($date, 'Y-m-d') . 'T' . format_date($date, 'H:i:s');
}

function date_when($date, $format = null) {
	$fmt = $format ?? 'd.m.Y';
	$timestamp = is_numeric($date) ? $date : strtotime($date);

	$getdata = date('d.m.Y', $timestamp);
	$yesterday = date('d.m.Y', mktime(0, 0, 0, date('m'), date('d') - 1, date('Y')));

	if($getdata === date('d.m.Y')) {
		$date = __('Today at') . ' ' . date('H:i', $timestamp);
	} else {
		if($yesterday === $getdata) {
			$date = __('Yesterday at') . ' ' . date('H:i', $timestamp);
		} else {
			$date = date($fmt, $timestamp);
		}
	}

	return $date;
}

############################# TIMEZONE #############################
function get_time_zones() {
	$regions = array(
		'Africa' => DateTimeZone::AFRICA,
		'America' => DateTimeZone::AMERICA,
		'Antarctica' => DateTimeZone::ANTARCTICA,
		'Asia' => DateTimeZone::ASIA,
		'Atlantic' => DateTimeZone::ATLANTIC,
		'Europe' => DateTimeZone::EUROPE,
		'Indian' => DateTimeZone::INDIAN,
		'Pacific' => DateTimeZone::PACIFIC
	);

	$timezones = array();

	foreach($regions as $name => $mask) {
		$zones = DateTimeZone::listIdentifiers($mask);

		foreach($zones as $timezone) {
			$time = new DateTime(NULL, new DateTimeZone($timezone));

			$timezones[$name][$timezone] = substr($timezone, strlen($name) + 1) . ' - ' . $time->format('H:i');
		}
	}

	return $timezones;
}

function print_time_zones($selected = '') {
	foreach(get_time_zones() as $region => $list) {

		echo '<optgroup label="' . $region . '">';

		foreach($list as $timezone => $name) {
			$selected_status = '';

			if($timezone === $selected) {
				$selected_status = 'selected';
			}

			echo '<option value="' . $timezone . '" ' . $selected_status . '>' . $name . '</option>';
		}

		echo '</optgroup>';
	}
}

############################# HTML #############################
function hc($text = ''){
	return htmlspecialchars($text ?? '');
}

function us($url) {
	return str_replace(' ', '%20', $url);
}

############################# TEXT #############################
function cyr_to_lat($text) {
	$gost = [
		'??' => 'a', '??' => 'b', '??' => 'v', '??' => 'g', '??' => 'd',
		'??' => 'e', '??' => 'e', '??' => 'zh', '??' => 'z', '??' => 'i',
		'??' => 'y', '??' => 'k', '??' => 'l', '??' => 'm', '??' => 'n',
		'??' => 'o', '??' => 'p', '??' => 'r', '??' => 's', '??' => 't',
		'??' => 'u', '??' => 'f', '??' => 'kh', '??' => 'tz', '??' => 'ch',
		'??' => 'sh', '??' => 'sch', '??' => 'y', '??' => 'e', '??' => 'iu',
		'??' => 'ia',
		'??' => 'A', '??' => 'B', '??' => 'V', '??' => 'G', '??' => 'D',
		'??' => 'E', '??' => 'E', '??' => 'Zh', '??' => 'Z', '??' => 'I',
		'??' => 'Y', '??' => 'K', '??' => 'L', '??' => 'M', '??' => 'N',
		'??' => 'O', '??' => 'P', '??' => 'R', '??' => 'S', '??' => 'T',
		'??' => 'U', '??' => 'F', '??' => 'Kh', '??' => 'Tz', '??' => 'Ch',
		'??' => 'Sh', '??' => 'Sch', '??' => 'Y', '??' => 'E', '??' => 'Iu',
		'??' => 'Ia',
		'??' => '', '??' => '', '??' => '', '??' => '',
		'??' => 'yi',
		'??' => 'i',
		'??' => 'g',
		'??' => 'e',
		'??' => 'Yi',
		'??' => 'I',
		'??' => 'G',
		'??' => 'E'
	];

	return strtr($text, $gost);
}

function slug($text, $delimiter = '-') {
	$slug = cyr_to_lat($text);
	$slug = preg_replace('/[^A-Za-z0-9' . $delimiter . ']+/', $delimiter, $slug);
	$slug = preg_replace('/[' . $delimiter . ']+/', $delimiter, $slug);
	$slug = trim($slug ?? '', $delimiter);
	$slug = strtolower($slug ?? '');

	return $slug;
}

function word($text) {
	$word = preg_replace('/[^\p{L}\d ]+/iu', '', $text);
	$word = preg_replace('/[\s]+/', ' ', $word);
	$word = trim($word ?? '');

	return $word;
}

############################# LANGUAGE #############################
function __($key) {
	return Language::translate($key);
}

function lang($lang, $key, $mixed = null) {
	$value = null;

	switch(strval($key)) {
		case 'region': {
			$value = Language::get($lang)['region'] ?? null;
			break;
		}
		case 'name': {
			$value = Language::get($lang)['name'] ?? null;
			break;
		}
		case 'icon': {
			$value = 'img/flags/' . $lang . '.' . ($mixed ?? 'png');
			break;
		}
	}

	return $value;
}

############################# SITE #############################
function site($key) {
	$value = null;

	foreach(Setting::getAll() as $setting) {
		if(isset($setting->{$key})) {
			$value = $setting->{$key};

			if($value === 'true') {
				$value = true;
			}
			if($value === 'false') {
				$value = false;
			}
			if(is_string($value) && $value[0] === "[") {
				$value = json_decode($value) ?? [];
			}

			return $value;
		}
	}

	switch(strval($key)) {
		case 'name': {
			$value = $value ?? Engine::NAME;
			break;
		}
		case 'charset': {
			$value = DATABASE['charset'];
			break;
		}
		case 'language_current': {
			$value = Language::current();
			break;
		}
		case 'url': {
			$value = Request::$base;
			break;
		}
		case 'url_language': {
			$value = Request::$base;

			if(site('language') !== site('language_current')) {
				$value .= '/' . site('language_current');
			}

			break;
		}
		case 'uri_cut_language': {
			$uri = trim(Request::$uri ?? '', '/');
			$uri_parts = explode('/', $uri);

			if(Language::has($uri_parts[0])) {
				array_shift($uri_parts);
				$uri = implode('/', $uri_parts);
			}

			$value = '/' . $uri;

			break;
		}
		case 'permalink': {
			$value = trim(strtok(Request::$url ?? '', '?'), '/');
			break;
		}
		case 'version': {
			$value = Engine::VERSION;
			break;
		}
	}

	return $value;
}
