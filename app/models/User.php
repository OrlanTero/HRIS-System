<?php


namespace Application\models;

use Application\abstracts\UserAbstract;

class User extends UserAbstract
{
    protected $CONNECTION;

    public $photoURL;
    public $typeName;

    public function __construct($userData = [])
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->applyData($userData, UserAbstract::class);
        $this->init();
    }

    private function init(): void
    {
        global $USER_TYPES_TEXT;

        $EXTENSION = 'jpg';
        $CHARACTER_AVATAR_PATH = '/public/assets/media/images/avatar/character/' . $EXTENSION . '/';

        if (!$this->displayName) {
            $this->displayName = $this->firstname . ' ' . $this->lastname;
            $this->CONNECTION->Update("users", ["displayName" => $this->displayName], ["user_id" => $this->user_id]);
        }

        $this->photoURL = strlen($this->image) > 0 ? $this->image : $CHARACTER_AVATAR_PATH . strtoupper($this->displayName[0]) . '.' . $EXTENSION;
        $this->typeName = $USER_TYPES_TEXT[$this->user_type];
    }

    public function isType($type)
    {
        return $type == $this->user_type;
    }
}