<?php

require Path::file('form') . '/_Model/User.php';

return [
	'table' => 'user',
	'fields' => [
		'group' => $group,
		'login' => $login,
		'password' => $password,
		'email' => $email,
		'phone' => $phone,
		'name' => $name,
		'socials' => $socials,
		'avatar' => $avatar,
		'address' => $address,
		'about' => $about,
		'birthday' => $birthday,
		'is_enabled' => [
			'boolean' => true
		]
	],
	'execute_post' => function($data) {
		Log::write('User ID: ' . $data->form_data['item_id'] . ' ' . $data->form_data['action'] . 'ed by user ID: ' . Auth::$user->id . ' from IP: ' . Request::$ip, 'user');
	}
];
