<?php

namespace App\Controller;

use Koncerto\KoncertoResponse;
use Koncerto\KoncertoAnnotation as K;
use Koncerto\KoncertoImpulsusController;

class ExamplesController extends KoncertoImpulsusController
{
    /**
     * @see K::route() {"name": "/examples/"}
     * @return KoncertoResponse
     */
    public function index()
    {
        return $this->render('templates/examples.tbs.html');
    }
}
