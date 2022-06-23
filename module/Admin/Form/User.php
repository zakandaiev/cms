<?php

$group = [
	'foreign' => 'user_group@user_id/group_id'
];
$login = [
	'required' => true,
	'minlength' => 2,
	'maxlength' => 200,
	'regexp' => '/^[\w\d]+$/',
	'regexp2' => '/(?i)^(?![a4]dm[i1_][n]*)+/i'
];
$password = [
	'unset_null' => true,
	'required' => false,
	'minlength' => 8,
	'maxlength' => 200,
	'modify' => function($pass) {
		return Hash::password($pass);
	}
];
$email = [
	'required' => true,
	'email' => true,
	'minlength' => 6,
	'maxlength' => 200
];
$phone = [
	'required' => false,
	'minlength' => 8,
	'maxlength' => 100,
	'regexp' => '/^[0-9\+\-\(\)]*$/'
];
$name = [
	'required' => true,
	'minlength' => 1,
	'maxlength' => 200,
	'regexp' => '/^[\w ]+$/iu'
];
$avatar = [
	'file' => true
];
$address = [
	'maxlength' => 200,
];
$about = [
	'maxlength' => 1000,
];
$socials = [
	'json' => true
];
$birthday = [
	'date' => true,
	'date_not_future' => true
];

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
	]
];
