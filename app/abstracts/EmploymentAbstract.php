<?php

namespace Application\abstracts;

abstract class EmploymentAbstract extends ModelDefaultFunctions
{
    public $employment_id;

    public $date_hired;

    public $date_end;

    public $employee_id;

    public $position;

    public $department;

    public $e_type;

    public $status;

    public $rest_day_1;

    public $rest_day_2;

    public $active;
}