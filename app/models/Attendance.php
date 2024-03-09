<?php

namespace Application\models;

use Application\abstracts\AttendanceAbstract;

class Attendance extends AttendanceAbstract
{
    protected $CONNECTION;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, AttendanceAbstract::class);
        $this->init();
    }

    private function init(): void
    {

    }
}