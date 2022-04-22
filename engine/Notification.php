<?php

namespace Engine;

use Engine\Database\Statement;

class Notification {
	public static function create($kind, $user_id, $info = null) {
		$create = '
			INSERT INTO {notification}
				(user_id, kind, info)
			VALUES 
				(:user_id, :kind, :info);
		';

		$create = new Statement($create);

		if(is_array($info) || is_object($info)) {
			$info = json_encode($info);
		}

		$binding = [
			'user_id' => $user_id,
			'kind' => $kind,
			'info' => $info
		];
		
		return $create->prepare()->bind($binding)->execute()->insertId();
	}

	public static function read($id, $user_id) {
		$read_one = 'UPDATE {notification} SET is_read=true WHERE id=:id AND user_id=:user_id AND is_read IS false';

		$read_one = new Statement($read_one);

		$read_one->prepare()->bind(['id' => $id, 'user_id' => $user_id])->execute();

		return true;
	}

	public static function readAll($user_id) {
		$read_all = 'UPDATE {notification} SET is_read=true WHERE user_id=:user_id AND is_read IS false';

		$read_all = new Statement($read_all);

		$read_all->prepare()->bind(['user_id' => $user_id])->execute();

		return true;
	}
}