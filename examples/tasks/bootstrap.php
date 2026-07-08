<?php

use Koncerto\Koncerto;

require_once('/preload/koncerto.php');
require_once('/preload/tbs_class.php');

$_SERVER['DOCUMENT_ROOT'] = dirname(__FILE__);
$_SERVER['DB_PATH'] = '/persist';
$_SERVER['IMPULSUS'] = 0 === strpos($_SERVER['PATH_INFO'], '/koncerto-playground/') ? '/koncerto-playground/impulsus/impulsus.js' : '/impulsus/impulsus.js';

if (!is_file($_SERVER['DB_PATH'] . '/tasks.sqlite')) {
    copy(dirname(__FILE__) . '/db.sqlite', $_SERVER['DB_PATH'] . '/tasks.sqlite');
}
chmod($_SERVER['DB_PATH'] . '/tasks.sqlite', 0777);

$koncerto = new Koncerto('phar:///preload/examples/tasks.phar/config.json');

echo $koncerto->response();
