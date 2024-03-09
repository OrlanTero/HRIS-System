<?php

namespace Application\models;

use Application\abstracts\BankAbstract;

class Bank extends BankAbstract
{
    protected $CONNECTION;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, BankAbstract::class);
        $this->init();
    }

    private function init(): void
    {

    }
}