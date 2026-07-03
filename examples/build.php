<?php

$index = array();

$root = './';
$examples = scandir($root);
foreach ($examples as $example) {
    if (!is_dir($root . $example) || '.' === substr($example, 0, 1)) {
        continue;
    }

    if (is_file($root . $example . '.phar')) {
        unlink($root . $example . '.phar');
    }

    $phar = new Phar($root . $example . '.phar');
    $phar->buildFromDirectory($root . $example);

    array_push($index, $example);
}

file_put_contents('index.js', 'var examples = ' . json_encode($index) . ';');
