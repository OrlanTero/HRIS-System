<?php

namespace Application\models;

use Application\abstracts\ClientAbstract;

class Client extends ClientAbstract
{
    protected $CONNECTION;

    /**
     * @type DeployedEmployee
     */
    public $deployed_employees;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, ClientAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $control = $APPLICATION->FUNCTIONS->DEPLOYED_EMPLOYEE_CONTROL;

        $this->deployed_employees = $control->filterRecords(['client_id' => $this->client_id], true);
    }
}