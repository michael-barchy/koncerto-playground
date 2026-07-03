<?php

namespace App\Controller;

use Exception;
use App\Entity\Task;
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
        return $this->render('templates/index.tbs.html');
    }
}
