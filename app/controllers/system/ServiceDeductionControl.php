<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\ServiceDeduction;

class ServiceDeductionControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = ServiceDeduction::class;
    protected $TABLE_NAME = "service_deductions";
    protected $TABLE_PRIMARY_ID = "service_deduction_id";
    protected $SEARCH_LOOKUP = [];
}