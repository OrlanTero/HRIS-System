<?php

namespace Application\abstracts;

abstract class DeployedEmployeeAbstract extends ModelDefaultFunctions
{
    public $deployed_employee_id;

    public $employee_id;

    public $client_id;

    public $date_from;

    public $date_to;

    public $date_created;
}