<?php

namespace Application\models;

use Application\abstracts\ServiceDeductionAbstract;

class ServiceDeduction extends ServiceDeductionAbstract
{
    protected $CONNECTION;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, ServiceDeductionAbstract::class);
        $this->init();
    }

    private function init(): void
    {

    }
}