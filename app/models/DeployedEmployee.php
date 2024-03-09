<?php

namespace Application\models;

use Application\abstracts\DeployedEmployeeAbstract;

class DeployedEmployee extends DeployedEmployeeAbstract
{
    protected $CONNECTION;

    /**
     * @type Employee
     */
    public $employee;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, DeployedEmployeeAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $control = $APPLICATION->FUNCTIONS->EMPLOYEE_CONTROL;

        $this->employee = $control->get($this->employee_id, true);
    }
}