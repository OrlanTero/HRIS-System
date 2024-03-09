<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\Beneficiary;

class BeneficiaryControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Beneficiary::class;
    protected $TABLE_NAME = "beneficiaries";
    protected $TABLE_PRIMARY_ID = "beneficiary_id";
    protected $SEARCH_LOOKUP = [];
}