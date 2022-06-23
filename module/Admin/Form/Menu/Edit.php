<?php

require Path::file('form') . '/_Model/Menu.php';

return [
	'table' => 'menu',
	'fields' => [
		'name' => $name
	],
	'execute_post' => function($data) {
		Log::write('Menu ID: ' . $data->form_data['item_id'] . ' ' . $data->form_data['action'] . 'ed by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'menu');
	}
];
