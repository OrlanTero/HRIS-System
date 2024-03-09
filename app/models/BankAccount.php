<?php

namespace Application\models;

use Application\abstracts\BankAccountAbstract;

class BankAccount extends BankAccountAbstract
{
    protected $CONNECTION;

    public $name;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, BankAccountAbstract::class);
        $this->init();
    }

    private function init(): void
    {

    }
}