<?php

namespace Application\abstracts;

abstract class BankAbstract extends ModelDefaultFunctions
{
    public $bank_id;

    public $name;

    public $branch;

    public $date_created;
}