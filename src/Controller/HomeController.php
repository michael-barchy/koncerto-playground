<?php

namespace App\Controller;

use Koncerto\KoncertoResponse;
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
        return $this->render('templates/home.tbs.html');
    }
}
