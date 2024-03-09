<?php

namespace Application\core;

use Application\controllers\app\GlobalFunctions;

class Application
{
    protected $AUTHENTICATION;
    protected $SESSION;
    protected $ROUTES;
    public $FUNCTIONS;

    public function __construct() {
        global $SESSION;

        $this->SESSION = $SESSION;
        $this->ROUTES = new Routes($this); // routes
        $this->AUTHENTICATION = new Authentication(); // auth // login | register
        $this->FUNCTIONS = new GlobalFunctions($SESSION);
    }

    public function run()
    {
        // Load Routes
        $this->ROUTES->loadRoutes();
    }
}