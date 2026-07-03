var env = {};

var prefix = 0 === location.pathname.indexOf('/koncerto-playground/') ? '/koncerto-playground' : '';
var suffix = '/bootstrap.php';
var bootstrap = location.pathname;
var url = new URL(location.href);
if (-1 !== bootstrap.lastIndexOf(suffix)) {
    bootstrap = bootstrap.substring(prefix.length, bootstrap.lastIndexOf(suffix) + suffix.length);
} else {
    prefix = location.pathname;
    if ('/' === prefix.substring(prefix.length - 1)) {
        prefix = prefix.substring(0, prefix.length - 1);
    }
    bootstrap = url.searchParams.get('_bootstrap') ?? '/preload/bootstrap.php';
    url.pathname = prefix + bootstrap + '/';
}

if (url.searchParams.get('_bootstrap') && url.searchParams.get('_route')) {
    bootstrap = url.searchParams.get('_bootstrap');
    var route = url.searchParams.get('_route') ?? '/';
    if (0 === route.length) {
        route = '/';
    }
    url.pathname = prefix + bootstrap + route;
    url.searchParams.delete('_bootstrap');
    url.searchParams.delete('_route');
    console.debug(url.toString());
    history.replaceState({}, null, url.toString());
}

env.BOOTSTRAP = bootstrap;

if (0 === bootstrap.indexOf('/phar://')) {
    bootstrap = bootstrap.substring(1);
}

console.debug(new Date());
console.debug(location.href);
console.debug(bootstrap);

var query = new URLSearchParams(location.search);
var method = query.get('_method');

env.SERVER_PROTOCOL = url.protocol;
env.SERVER_NAME = url.hostname;
env.SERVER_PORT = url.port;
env.HTTP_HOST = url.host;
env.REQUEST_METHOD = method ? method : 'GET';
env.QUERY_STRING = url.search;
env.PATH_INFO = url.pathname;
env.APP_PREFIX = prefix + (0 !== bootstrap.indexOf('/') ? '/' : '') + bootstrap;
var $server = [];
for (var k in env) {
    $server.push('$_SERVER[' + JSON.stringify(k) + '] = ' + JSON.stringify(env[k]) + ';');
}

var $get = [];
var $request = [];
query.forEach(function (v, k) {
    $get.push('$_GET[' + JSON.stringify(k) + '] = ' + JSON.stringify(v) + ';');
});
$get.push('$_REQUEST = $_GET;');

var pre = [];
pre.push($server.join('\n'));
pre.push($get.join('\n'));
pre.push('if (!is_dir("/persist/examples")) mkdir("/persist/examples");');
pre.push('$examples = ' + JSON.stringify(examples) + ';');
pre.push('foreach ($examples as $e) {');
pre.push('  $exampleDir = sprintf("/persist/examples/%s", $e);');
pre.push('  $exampleSourceDb = sprintf("/preload/examples/%s/db.sqlite", $e);');
pre.push('  $exampleDestDb = sprintf("%s/db.sqlite", $exampleDir);');
pre.push('  if (!is_dir($exampleDir)) mkdir($exampleDir);');
pre.push('  if (!is_file($exampleDestDb)) copy($exampleSourceDb, $exampleDestDb);');
pre.push('}');
pre.push('include("' + bootstrap + '");');

console.debug(pre.join('\n'));

var stdout = '';

const { PhpWeb } = await import('https://cdn.jsdelivr.net/npm/php-wasm/PhpWeb.mjs');
const php = new PhpWeb({
    files: files,
    persist: { mountPath: '/persist' },
    sharedLibs: libs
});
php.addEventListener('ready', () => {
php.run('<?php ' + pre.join('\n'))
    .then(exitCode => exitCode && console.warn('WARNING! PHP exited with code: ' + exitCode))
    .catch(error => console.error(error))
    .finally(() => {
        php.flush();
        document.querySelector('html').innerHTML = stdout;
        window.dispatchEvent(new CustomEvent('php:output'));
    });
});
php.addEventListener('output', (event) => stdout += event.detail);
php.addEventListener('error',  (event) => stdout += event.detail);
