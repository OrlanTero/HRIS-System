<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\abstracts\HolidayAbstract;

class HolidayControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = HolidayAbstract::class;
    protected $TABLE_NAME = "holidays";
    protected $TABLE_PRIMARY_ID = "holiday_id";
    protected $SEARCH_LOOKUP = ["holiday_id", "holiday"];
}