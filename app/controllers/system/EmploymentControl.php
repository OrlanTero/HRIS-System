<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\Employment;

class EmploymentControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Employment::class;
    protected $TABLE_NAME = "employments";
    protected $TABLE_PRIMARY_ID = "employment_id";
    protected $SEARCH_LOOKUP = ["date_hired", "date_end",
        ["table" => "employees",
         "primary" => "employee_id",
          "into" => ['firstname', 'lastname', 'middlename']],
        "position", "department", "e_type"];

}