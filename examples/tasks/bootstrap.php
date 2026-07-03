<?php

use Koncerto\Koncerto;

require_once('/preload/koncerto.php');
require_once('/preload/tbs_class.php');

$_SERVER['DOCUMENT_ROOT'] = dirname(__FILE__);
$_SERVER['DB_PATH'] = '/persist/examples/tasks';
$_SERVER['IMPULSUS'] = 0 === strpos($_SERVER['PATH_INFO'], '/koncerto-playground/') ? '/koncerto-playground/impulsus/impulsus.js' : '/impulsus/impulsus.js';

$koncerto = new Koncerto('/preload/examples/tasks/config.json');

echo $koncerto->response();
