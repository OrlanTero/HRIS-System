<?php

namespace Application\models;

use Application\abstracts\BeneficiaryAbstract;

class Beneficiary extends BeneficiaryAbstract
{
    protected $CONNECTION;

    public $employee;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, BeneficiaryAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        /**
         * @type Employee
         */
        $this->employee = $APPLICATION->FUNCTIONS->EMPLOYEE_CONTROL->get($this->employee_id, true);
    }
}