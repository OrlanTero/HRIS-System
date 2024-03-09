<?php

namespace Application\models;

use Application\abstracts\EmploymentAbstract;

class Employment extends EmploymentAbstract
{
    protected $CONNECTION;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, EmploymentAbstract::class);
        $this->init();
    }

    private function init(): void
    {

    }
}