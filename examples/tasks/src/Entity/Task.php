<?php

namespace App\Entity;

use Koncerto\KoncertoAnnotation as K;

/**
 * @see K::entity()
 */
class Task
{
    /** @var int */
    public $id;

    /** @var string */
    public $description;

    /** @var bool */
    public $done = false;
}
