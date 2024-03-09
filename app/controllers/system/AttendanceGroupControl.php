<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\AttendanceGroup;

class AttendanceGroupControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = AttendanceGroup::class;
    protected $TABLE_NAME = "attendance_groups";
    protected $TABLE_PRIMARY_ID = "attendance_group_id";
    protected $SEARCH_LOOKUP = ["attendance_group_id", "year", "period", [
        "table" => "clients",
        "primary" => "client_id",
        "into" => ['name', 'branch']]];
}