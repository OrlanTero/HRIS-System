<?php

namespace Application\models;

use Application\abstracts\MortuaryAbstract;

class Mortuary extends MortuaryAbstract
{
    protected $CONNECTION;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, MortuaryAbstract::class);
        $this->init();
    }

    private function init(): void
    {

    }
}