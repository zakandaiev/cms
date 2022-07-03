<?php

$message = '
  <p><span style="font-size:16px"><strong>' . __('Good day') . '</strong></span></p>
  <br>
  <p>' . __('You have successfully registered on the site') . ' <a href="' . site('url') . '" target="_blank">' . site('name') . '</a></p>
  <p>' . __('Authentication data') . ':</p>
  <p><strong>' . __('Login') . ':</strong> ' . $data->login . '</p>
  <p><strong>' . __('Password') . ':</strong> ' . $data->password . '</p>
  <p>' . __('This is an automatic email, no need to reply') . '.</p>
  <br>
  <p>' . __('Sincerely') . ',<br>' . __('Administration') . ' <a href="' . site('url') . '" target="_blank">' . site('name') . '</a></p>
';

return [
	'subject' => __('Registration'),
	'message' => $message
];
