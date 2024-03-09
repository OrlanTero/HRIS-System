<?php

namespace Application\models;

use Application\abstracts\SystemTypeAbstract;

class SystemType extends SystemTypeAbstract
{
    protected $CONNECTION;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, SystemTypeAbstract::class);
        $this->init();
    }

    private function init(): void
    {

    }
}