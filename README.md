# Koncerto Playground

Playground is a PHP-wasm based testing environment for Koncerto Framework. It allows you to run your PHP code directly in the browser, without a backend server.

## Using playground

You can use playground online @ https://michael-barchy.github.io/koncerto-playground or use it in your own projects.

## Using CDN - Quick start guide

### 1. Setup your Worker

Create a `worker.mjs` file to initialize the playground environment:

```javascript
import 'https://cdn.jsdelivr.net/gh/michael-barchy/koncerto-playground@main/worker.mjs';

```

### 2. Integrate into your HTML

Link the bootstrap script in your `index.html`. The `data-storage` attribute tells the playground which local files to mount into the PHP virtual filesystem. (You don't need to include koncerto.php, tbs_class.php and bootstrap.php as they are automatically loaded by the worker).

```html
<script id="bootstrap" type="module"
        data-storage="src/Controller/HomeController.php,templates/home.tbs.html"
        src="https://cdn.jsdelivr.net/gh/michael-barchy/koncerto-playground@main/bootstrap.mjs">
</script>

```

### 3. Create a bootstrap.php file (instead of index.php)

bootstrap.php

```php
<?php

use Koncerto\Koncerto;

require_once('/preload/koncerto.php');
require_once('/preload/tbs_class.php');

$koncerto = new Koncerto(array(
    'documentRoot' => dirname(__FILE__),
    'templateEngine' => 'Koncerto\\KoncertoTbsTemplate',
    'autoload' => array(
        'App\\' => './src'
    )
));

echo $koncerto->response();

```

### 4. Write a simple controller

src/Controller/HomeController.php

```php
<?php

namespace App\Controller;

use Koncerto\KoncertoController;
use Koncerto\KoncertoAnnotation as K;

class HomeController extends KoncertoController
{
    /**
     * @see K::route() {"name": "/"}
     * @return KoncertoResponse
     */
    public function index()
    {
        return $this->render('templates/home.tbs.html', array('ip' => $_SERVER['REMOTE_ADDR']));
    }
}

```

templates/home.tbs.html

```html
<html>
    <head><title>Hello</title></head>
    <body><h1>Hello [ip]</h1>
</html>
```

## How it works

Playground uses WebAssembly to emulate a full PHP environment in your browser's Service Worker. When the page loads, it mounts the files specified in `data-storage`, allowing the PHP runtime to intercept requests and return rendered templates natively.

