<?php


$file = '.' . $_GET['file'];

if (!is_file($file)) {
    header('HTTP/1.0 404 Not found');
    exit();
}

header('Content-type: ' . mime_content_type($file));
readfile($file);
