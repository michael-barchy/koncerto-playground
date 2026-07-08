<?php

if (!isset($_GET['file'])) {
    new \Exception('Missing required file argument');
}

$file = '.' . $_GET['file'];

if (!is_file($file)) {
    header('HTTP/1.0 404 Not found');
    exit();
}

header('Content-type: ' . \mime_content_type($file));
header('Content-disposition: attachment; filename="' . basename($file) . "'");
readfile($file);
