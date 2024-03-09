<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\Employee;

class EmployeeControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Employee::class;
    protected $TABLE_NAME = "employees";
    protected $TABLE_PRIMARY_ID = "employee_id";
    protected $SEARCH_LOOKUP = ["employee_no", "firstname", "lastname","middlename", "gender", "civil_status", "email", "mobile"];

    public function add($data) {
        global $APPLICATION;

        $control = $APPLICATION->FUNCTIONS->BANK_ACCOUNT_CONTROL;
        $employee = $data["employee"];
        $bank = $data["bank"];

        $insert = $this->addRecord($employee);

        if ($insert->code == 200) {

            foreach ($bank as $item) {
                $item["employee_id"] = $insert->body['id'];

               return $control->addRecord($item);
            }
        }

        return $insert;
    }

    public function edit($data) {
        global $APPLICATION;

        $control = $APPLICATION->FUNCTIONS->BANK_ACCOUNT_CONTROL;
        $employee = $data["employee"];
        $id = $employee['id'];
        $bank = $data["bank"];

        unset($employee['id']);

        $edit = $this->editRecord($id, $employee);

        foreach ($bank as $b) {

            $b['employee_id'] = $id;

            $id = $b['id'];

            if ($b['status'] === 'created') {
                unset($b['status'], $b['id']);

                $control->addRecord($b);

            } else if ($b['status'] === 'edited') {
                unset($b['status'], $b['id']);

                $control->editRecord($id, $b);
            } else if ($b['status'] === 'deleted') {
                $control->removeRecord($id);
            }
        }

        return $edit;
    }

    public function aw($id) {
        return $this->get($id, true);
    }
}