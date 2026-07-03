<?php

/**
 * This file is for testing purpose.
 * On Playground, only config.json is used.
 */

use Koncerto\Koncerto;

require_once('../../vendor/autoload.php');

$_SERVER['DB_PATH'] = __DIR__;

$koncerto = new Koncerto('config.json');

$response = $koncerto->response();

$f = '.' . $koncerto->request()->getPathInfo();
if ('/' === substr($f, -1)) {
    $f = substr($f, 0, strlen($f) - 1);
}

if (empty($response) && is_file($f)) {
    readfile($f);
} else {
    echo $response;
}
