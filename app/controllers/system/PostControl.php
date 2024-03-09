<?php

class PostControl
{
    public function GetEmployee() {
        global $APPLICATION;

        $control = $APPLICATION->FUNCTIONS->EMPLOYEE_CONTROL;

        $id = $_POST["id"];

        return $control->get($id, true);
    }

    public function GetClient() {
        global $APPLICATION;

        $control = $APPLICATION->FUNCTIONS->CLIENT_CONTROL;

        $id = $_POST["id"];

        return $control->get($id, true);
    }

    public function run($request) {
        return $this->$request();
    }
}