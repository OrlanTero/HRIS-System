<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\Client;

class ClientController extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Client::class;
    protected $TABLE_NAME = "clients";
    protected $TABLE_PRIMARY_ID = "client_id";
    protected $SEARCH_LOOKUP = ["name", "branch"];
}