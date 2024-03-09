<?php

namespace Application\models;

use Application\abstracts\HolidayAbstract;

class Holiday extends HolidayAbstract
{
    protected $CONNECTION;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, HolidayAbstract::class);
        $this->init();
    }

    private function init(): void
    {

    }
}