<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\Bank;

class BankControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Bank::class;
    protected $TABLE_NAME = "banks";
    protected $TABLE_PRIMARY_ID = "bank_id";
    protected $SEARCH_LOOKUP = ["name", "branch"];
}