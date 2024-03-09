<?php

namespace Application\abstracts;

abstract class UserAbstract extends ModelDefaultFunctions
{
    public $user_id;
    public $firstname;
    public $lastname;
    public $email;
    public $phone;
    public $image;
    public $signin_with;

    public $user_type;
    public $date_created;

    public $displayName;
    public $facebook;

}