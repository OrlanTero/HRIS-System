<?php

include_once "app/libraries/vendor/autoload.php";
include_once "app/init.php";

use Application\core\Application;
use Application\core\Connection;
use Application\core\Session;
use Klein\Klein;



//Start Session
session_start();

$KLEIN = new Klein(); // managing routes in website
$CONNECTION = new Connection(); //
$SESSION = $_SESSION["session"] ?? new Session(); // handling user information // current logged in
$APPLICATION = new Application();

try {
    if ($CONNECTION->Test()) {
        $APPLICATION->run();
        // echo "Connected";
    } else {
        echo "Failed";
    }
} catch (Throwable $e) {
    throw $e;
}