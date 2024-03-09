<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\Mortuary;

class MortuaryControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Mortuary::class;
    protected $TABLE_NAME = "mortuaries";
    protected $TABLE_PRIMARY_ID = "mortuary_id";
    protected $SEARCH_LOOKUP = ["mortuary_id", "period", "year"];

    public function add($data) {
        global $APPLICATION;

        $mortuary = $data['data'];
        $beneficiaries = $data['beneficiaries'];
        $control = $APPLICATION->FUNCTIONS->BENEFICIARY_CONTROL;

        $insert = $this->addRecord($mortuary);

        if ($insert->code == 200) {
            foreach ($beneficiaries as $beneficiary) {
                $beneficiary['mortuary_id'] = $insert->body['id'];

                $control->addRecord($beneficiary);
            }
        }
    }

    public function edit($data) {
        global $APPLICATION;

        $mortuary = $data['data'];
        $id = $data['id'];
        $beneficiaries = $data['beneficiaries'];
        $control = $APPLICATION->FUNCTIONS->BENEFICIARY_CONTROL;

        $edit = $this->editRecord($id, $mortuary);

        if ($edit->code == 200) {
            foreach ($beneficiaries as $beneficiary) {
                if ($beneficiary['status'] === 'created') {
                    unset($beneficiary['status']);

                    $control->addRecord($beneficiary);
                } else if ($beneficiary['status'] === 'edited') {
                    $id = $beneficiary['id'];

                    unset($beneficiary['status'], $beneficiary['id']);

                    $control->editRecord($id, $beneficiary);
                } else if ($beneficiary['status'] === 'deleted') {
                    $id = $beneficiary['id'];

                    $control->removeRecord($id);
                }
            }
        }
        return $edit;
    }
}