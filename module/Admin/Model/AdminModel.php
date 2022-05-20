<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;

class AdminModel {
	public function getUserAccessAll($id) {
		$sql = '
			SELECT
				t_group.access_all
			FROM
				{user_group} t_user_group
			INNER JOIN
				{group} t_group
			ON
				t_group.id = t_user_group.group_id
			WHERE
				t_user_group.user_id=:user_id AND t_group.is_enabled IS true AND t_group.access_all IS true
			LIMIT 1
		';

		$statement = new Statement($sql);

		$result = $statement->prepare()->bind(['user_id' => $id])->execute()->fetch();

		if(isset($result) && !empty($result) && $result->access_all) {
			return true;
		}

		return false;
	}

	public function getUserGroups($id) {
		$user_groups = [];

		$groups = new Statement('SELECT * FROM {user_group} WHERE user_id=:user_id');
		$groups = $groups->prepare()->bind(['user_id' => $id])->execute()->fetchAll();

		foreach($groups as $group) {
			$user_groups[] = $group->group_id;
		}

		return $user_groups;
	}

	public function getUserRoutes($id) {
		$user_routes = [];

		$routes_sql = '
			SELECT
				t_group_route.route
			FROM
				{user_group} t_user_group
			INNER JOIN
				{group_route} t_group_route
			ON
				t_group_route.group_id = t_user_group.group_id
			INNER JOIN
				{group} t_group
			ON
				t_group.id = t_user_group.group_id
			WHERE
				t_user_group.user_id=:user_id AND t_group.is_enabled IS true
		';

		$routes = new Statement($routes_sql);
		$routes = $routes->prepare()->bind(['user_id' => $id])->execute()->fetchAll();

		foreach($routes as $route) {
			$user_routes[] = $route->route;
		}

		return $user_routes;
	}

	public function getUserNotificationsCount($id) {
		$notifications = new Statement('SELECT count(*) FROM {notification} WHERE user_id=:user_id AND is_read IS false');

		return intval($notifications->prepare()->bind(['user_id' => $id])->execute()->fetchColumn());
	}

	public function getUserNotifications($id) {
		$notifications = new Statement('SELECT * FROM {notification} WHERE user_id=:user_id AND is_read IS false ORDER BY date_created DESC LIMIT 5');

		return $notifications->prepare()->bind(['user_id' => $id])->execute()->fetchAll();
	}
}
