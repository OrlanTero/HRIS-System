<?php

namespace Application\models;

use Application\abstracts\AttendanceGroupAbstract;

class AttendanceGroup extends AttendanceGroupAbstract
{
    protected $CONNECTION;

    /**
     * @type Client
     */
    public $client;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, AttendanceGroupAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $APPLICATION;

        $control = $APPLICATION->FUNCTIONS->CLIENT_CONTROL;

        $this->client = $control->get($this->client_id, true);
    }

    public function getAttendanceOf($employee_id) {
        global $APPLICATION;

        return $APPLICATION->FUNCTIONS->ATTENDANCE_CONTROL->filterRecords(['attendance_group_id' => $this->attendance_group_id, 'employee_id' => $employee_id], true);
    }

    public function getValueOfAttendanceIn($attendances, $day, $type) {
        foreach ($attendances as $attendance) {
            if ($attendance->day == $day && $attendance->type == $type) {
                return $attendance;
            }
        }
    }
}