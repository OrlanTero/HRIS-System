<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\DeployedEmployee;

class DeployedEmployeeControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = DeployedEmployee::class;
    protected $TABLE_NAME = "deployed_employees";
    protected $TABLE_PRIMARY_ID = "deployed_employee_id";
    protected $SEARCH_LOOKUP = [];
}