<?php

namespace Application\core;

use Application\abstracts\UserAbstract;
use Application\models\User;

class Session extends User
{
    public $hasUser = false;
    public $isAdmin = false;
    public $photoURL;

    public $typeName;

    public function __construct()
    {
        $this->hasUser = isset($_SESSION['user_id']);
    }

    public function apply($user): void
    {
        global $USER_TYPES_TEXT;

        $vars = get_class_vars(UserAbstract::class);

        foreach (array_keys($vars) as $var) {
            if (property_exists($user, $var)) {
                $this->{$var} = $user->{$var};
            }
        }

        $this->photoURL = $user->photoURL;
        $this->typeName = ucwords($USER_TYPES_TEXT[$this->user_type]);
    }

    public function start(): void
    {
        $_SESSION["user_id"] = $this->user_id;
        $_SESSION["is_admin"] = $this->user_type != 1;
        $_SESSION["session"] = $this;

        $this->isAdmin = $_SESSION["is_admin"];
        $this->hasUser = isset($_SESSION["user_id"]);
    }
}