<?php

namespace Application\abstracts;

abstract class AttendanceGroupAbstract extends ModelDefaultFunctions
{
    public $attendance_group_id;

    public $period;

    public $year;

    public $client_id;

    public $active;

    public $finished;
}