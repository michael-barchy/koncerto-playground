<?php

error_reporting(E_ERROR | E_PARSE);

if (!empty($_REQUEST['_route'])) {
    $_SERVER['PATH_INFO'] = $_SERVER['PATH_TRANSLATED'] . $_REQUEST['_route'];
}

$_SERVER['APP_PREFIX'] = 'preload';

$baseHref = '/';
$hasBaseHref = preg_match('/(\/[^\/]+\/)preload/', $_SERVER['REQUEST_URI'], $matches);
if ($hasBaseHref) {
    $baseHref = $matches[1];
}

$bootstrap = __FILE__;
if (!empty($_REQUEST['_bootstrap'])) {
    $bootstrap = $_REQUEST['_bootstrap'];
}

// Load from PHAR
$hasPhar = preg_match('/\/preload(\/phar\:.*\/.*\.phar)/', $_SERVER['REQUEST_URI'], $matches);
if ($hasPhar) {
    $bootstrap = $matches[1];
    $_SERVER['APP_PREFIX'] = substr($matches[0], 1);
    $_SERVER['PATH_INFO'] = str_replace($matches[1], '', $_SERVER['REQUEST_URI']);
}

$_SERVER['APP_PREFIX'] = $baseHref . $_SERVER['APP_PREFIX'];
$_SERVER['PATH_INFO'] = str_replace($_SERVER['APP_PREFIX'], '', $_SERVER['REQUEST_URI']);
$_SERVER['PATH_INFO'] = str_replace('?' . $_SERVER['QUERY_STRING'], '', $_SERVER['PATH_INFO']);

if ($bootstrap !== __FILE__) {
    if (0 === strpos($bootstrap, '/phar://')) {
        $bootstrap = substr($bootstrap, 1) . '/bootstrap.php';
    }
    include($bootstrap);
    exit();
}

use Koncerto\Koncerto;

$lib = './koncerto.php';
if (!is_file($lib)) {
    $lib = './koncerto/koncerto.php';
}
if (!is_file($lib)) {
    $lib = '../koncerto/koncerto.php';
}
if (is_file($lib)) {
    require_once($lib);
}

$lib = './tbs_class.php';
if (!is_file($lib)) {
    $lib = './vendor/tinybutstrong/tbs_class.php';
}
if (is_file($lib)) {
    require_once('tbs_class.php');
}

$koncerto = new Koncerto(array(
    'documentRoot' => __DIR__,
    'appPrefix' => $_SERVER['APP_PREFIX'],
    'templateEngine' => 'Koncerto\\KoncertoTbsTemplate',
    'autoload' => array(
        'App\\' => './src/'
    )
));

echo $koncerto->response();
