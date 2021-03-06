<?php

############################# UPLOAD #############################
Module::route('get', '/upload', 'Upload@get');
Module::route('post', '/upload', 'Upload@post');
Module::route('delete', '/upload', 'Upload@delete');

############################# AUTH #############################
Module::route('get', '/admin/login', 'Auth@getLogin', [
	'page' => [
		'title' => __('Login')
	],
	'is_public' => true
]);

Module::route('get', '/admin/logout', 'Auth@getUnAuth', [
	'page' => [
		'title' => __('Logout')
	],
	'is_public' => true
]);

Module::route('get', '/admin/reset-password', 'Auth@getRestore', [
	'page' => [
		'title' => __('Reset password')
	],
	'is_public' => true
]);

Module::route('get', '/admin/register', 'Auth@getRegister', [
	'page' => [
		'title' => __('Register')
	],
	'is_public' => true
]);

############################# DASHBOARD #############################
Module::route('get', '/admin', 'Dashboard@getDashboard', [
	'page' => [
		'title' => __('Dashboard')
	],
	'is_public' => true
]);

Module::route('get', '/admin/dashboard', 'Dashboard@getDashboard', [
	'page' => [
		'title' => __('Dashboard')
	],
	'is_public' => true
]);

############################# PROFILE #############################
Module::route('get', '/admin/profile', 'Profile@getProfile', [
	'page' => [
		'title' => __('Profile')
	],
	'breadcrumbs' => [
		__('Profile')
	],
	'is_public' => true
]);

Module::route('get', '/admin/profile/edit', 'Profile@getEdit', [
	'page' => [
		'title' => __('Edit profile')
	],
	'breadcrumbs' => [
		__('Profile') . '@/admin/profile',
		__('Edit')
	],
	'is_public' => true
]);

Module::route('get', '/admin/profile/$id', 'Profile@getProfile', [
	'page' => [
		'title' => __('Profile')
	],
	'breadcrumbs' => [
		__('Profile')
	]
]);

Module::route('post', '/admin/profile/notification', 'Profile@postNotification');
Module::route('post', '/admin/profile/$id/notification', 'Profile@postNotification');

############################# PAGE #############################
Module::route('get', '/admin/page', 'Page@getAll', [
	'page' => [
		'title' => __('Pages')
	],
	'breadcrumbs' => [
		__('Pages')
	]
]);

Module::route('get', '/admin/page/category/$id', 'Page@getCategory', [
	'page' => [
		'title' => __('Pages')
	],
	'breadcrumbs' => [
		__('Pages')
	]
]);

Module::route('get', '/admin/page/add', 'Page@getAdd', [
	'page' => [
		'title' => (Request::has('is_category')) ? __('Add category') : __('Add page')
	],
	'breadcrumbs' => [
		__('Pages') . '@/admin/page',
		(Request::has('is_category')) ? __('Add category') : __('Add page')
	]
]);

Module::route('get', '/admin/page/edit/$id', 'Page@getEdit', [
	'page' => [
		'title' => __('Edit page')
	],
	'breadcrumbs' => [
		__('Pages') . '@/admin/page',
		__('Edit')
	]
]);

Module::route('get', '/admin/page/edit/$id/translation/add/$language', 'Page@getAddTranslation', [
	'page' => [
		'title' => __('Add page translation')
	],
	'breadcrumbs' => [
		__('Pages') . '@/admin/page',
		__('Add page translation')
	]
]);

Module::route('get', '/admin/page/edit/$id/translation/edit/$language', 'Page@getEdit', [
	'page' => [
		'title' => __('Edit translation')
	],
	'breadcrumbs' => [
		__('Pages') . '@/admin/page',
		__('Edit')
	]
]);

############################# COMMENT #############################
Module::route('get', '/admin/comment', 'Comment@getAll', [
	'page' => [
		'title' => __('Comments')
	],
	'breadcrumbs' => [
		__('Comments')
	]
]);

Module::route('get', '/admin/comment/edit/$id', 'Comment@getEdit', [
	'page' => [
		'title' => __('Edit comment')
	],
	'breadcrumbs' => [
		__('Comments') . '@/admin/comment',
		__('Edit')
	]
]);

############################# MENU #############################
Module::route('get', '/admin/menu', 'Menu@getAll', [
	'page' => [
		'title' => __('Menu')
	],
	'breadcrumbs' => [
		__('Menu')
	]
]);

Module::route('get', '/admin/menu/$id', 'Menu@getEdit', [
	'page' => [
		'title' => __('Menu')
	],
	'breadcrumbs' => [
		__('Menu') . '@/admin/menu',
		__('Edit')
	]
]);

############################# TRANSLATION #############################
Module::route('get', '/admin/translation', 'Translation@getAll', [
	'page' => [
		'title' => __('Translations')
	],
	'breadcrumbs' => [
		__('Translations')
	]
]);

Module::route('get', '/admin/translation/$language', 'Translation@getEdit', [
	'page' => [
		'title' => __('Translations')
	],
	'breadcrumbs' => [
		__('Translations') . '@/admin/translation',
		__('Edit')
	]
]);

Module::route('post', '/admin/translation/$language', 'Translation@postEdit');

############################# USER #############################
Module::route('get', '/admin/user', 'User@getAll', [
	'page' => [
		'title' => __('Users')
	],
	'breadcrumbs' => [
		__('Users')
	]
]);

Module::route('get', '/admin/user/add', 'User@getAdd', [
	'page' => [
		'title' => __('Add user')
	],
	'breadcrumbs' => [
		__('Users') . '@/admin/user',
		__('Add')
	]
]);

Module::route('get', '/admin/user/edit/$id', 'User@getEdit', [
	'page' => [
		'title' => __('Edit user')
	],
	'breadcrumbs' => [
		__('Users') . '@/admin/user',
		__('Edit')
	]
]);

############################# GROUP #############################
Module::route('get', '/admin/group', 'Group@getAll', [
	'page' => [
		'title' => __('Groups')
	],
	'breadcrumbs' => [
		__('Groups')
	]
]);

Module::route('get', '/admin/group/add', 'Group@getAdd', [
	'page' => [
		'title' => __('Add group')
	],
	'breadcrumbs' => [
		__('Groups') . '@/admin/group',
		__('Add')
	]
]);

Module::route('get', '/admin/group/edit/$id', 'Group@getEdit', [
	'page' => [
		'title' => __('Edit group')
	],
	'breadcrumbs' => [
		__('Groups') . '@/admin/group',
		__('Edit')
	]
]);

############################# SETTING #############################
Module::route('get', '/admin/setting/$section', 'Setting@getSection');
Module::route('post', '/admin/setting/$section', 'Setting@postSection');
Module::route('post', '/admin/setting/optimization/flush-cache', 'Setting@postFlushCache');

############################# LOG #############################
Module::route('get', '/admin/log', 'Log@getAll', [
	'page' => [
		'title' => __('Logs')
	],
	'breadcrumbs' => [
		__('Logs')
	]
]);

Module::route('get', '/admin/log/$id', 'Log@get', [
	'page' => [
		'title' => __('Logs')
	],
	'breadcrumbs' => [
		__('Logs') . '@/admin/log'
	]
]);

############################# MODULE #############################
Module::route('get', '/admin/module', 'Module@getAll', [
	'page' => [
		'title' => __('Modules')
	],
	'breadcrumbs' => [
		__('Modules')
	]
]);

Module::route('get', '/admin/module/edit/$name', 'Module@getEdit', [
	'page' => [
		'title' => __('Modules')
	],
	'breadcrumbs' => [
		__('Modules') . '@/admin/module'
	]
]);

Module::route('post', '/admin/module/edit/$name', 'Module@postEdit');
Module::route('post', '/admin/module/delete/$name', 'Module@postDelete');
Module::route('post', '/admin/module/toggle/$name', 'Module@postToggle');
