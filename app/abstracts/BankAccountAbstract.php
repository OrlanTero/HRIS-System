<?php

namespace Application\abstracts;

 abstract class BankAccountAbstract extends ModelDefaultFunctions
{
    public $bank_account_id;

    public $employee_id;

    public $bank;

    public $account_number;

    public $active;
}