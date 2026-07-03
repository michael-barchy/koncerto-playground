<?php

error_reporting(E_ERROR | E_PARSE);

use Koncerto\Koncerto;

$lib = './koncerto.php';
if (!is_file($lib)) {
    $lib = './koncerto/koncerto.php';
}
if (!is_file($lib)) {
    $lib = '../koncerto/koncerto.php';
}
if (!is_file($lib)) {
    $lib = '/preload/koncerto.php';
}
require_once($lib);

$lib = './tbs_class.php';
if (!is_file($lib)) {
    $lib = '/preload/tbs_class.php';
}
require_once($lib);

$koncerto = new Koncerto(array(
    'documentRoot' => is_dir('/preload') ? '/preload' : __DIR__,
    'templateEngine' => 'Koncerto\\KoncertoTbsTemplate',
    'autoload' => array(
        'App\\' => './src/'
    )
));

echo $koncerto->response();
