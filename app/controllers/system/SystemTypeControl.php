<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\SystemType;

class SystemTypeControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = SystemType::class;
    protected $TABLE_NAME = "system_types";
    protected $TABLE_PRIMARY_ID = "type_id";
    protected $SEARCH_LOOKUP = [];
}