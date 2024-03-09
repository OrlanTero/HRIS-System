<?php

namespace Application\controllers\app;


use Application\controllers\system\AttendanceControl;
use Application\controllers\system\AttendanceGroupControl;
use Application\controllers\system\BankControl;
use Application\controllers\system\BeneficiaryControl;
use Application\controllers\system\ClientController;
use Application\controllers\system\DeployedEmployeeControl;
use Application\controllers\system\EmploymentControl;
use Application\controllers\system\HolidayControl;
use Application\controllers\system\MortuaryControl;
use Application\controllers\system\EmployeeControl;

use Application\controllers\system\ServiceDeductionControl;
use Application\controllers\system\SystemTypeControl;
use BankAccountControl;
use PostControl;

class GlobalFunctions
{
    protected $CONNECTION;
    protected $KLEIN;
    protected $SESSION;
    public $isAdmin;


    public $POST_CONTROL;

    public $EMPLOYEE_CONTROL;

    public $EMPLOYMENT_CONTROL;

    public $BANK_ACCOUNT_CONTROL;

    public $MORTUARY_CONTROL;

    public $BENEFICIARY_CONTROL;

    public $CLIENT_CONTROL;

    public $DEPLOYED_EMPLOYEE_CONTROL;

    public $SYSTEM_TYPES_CONTROL;

    public $SERVICE_DEDUCTION_CONTROL;

    public $HOLIDAY_CONTROL;

    public $ATTENDANCE_GROUP_CONTROL;

    public $ATTENDANCE_CONTROL;

    public $BANK_CONTROL;

    public function __construct($SESSION)
    {
        global $CONNECTION;
        global $KLEIN;

        $this->SESSION = $SESSION;
        $this->CONNECTION = $CONNECTION;
        $this->KLEIN = $KLEIN;
        $this->isAdmin = $SESSION->isAdmin;

        $this->POST_CONTROL = new PostControl();
        $this->EMPLOYEE_CONTROL = new EmployeeControl();
        $this->BANK_ACCOUNT_CONTROL = new BankAccountControl();
        $this->MORTUARY_CONTROL = new MortuaryControl();
        $this->BENEFICIARY_CONTROL = new BeneficiaryControl();
        $this->EMPLOYMENT_CONTROL = new EmploymentControl();
        $this->CLIENT_CONTROL = new ClientController();
        $this->DEPLOYED_EMPLOYEE_CONTROL = new DeployedEmployeeControl();
        $this->SYSTEM_TYPES_CONTROL = new SystemTypeControl();
        $this->SERVICE_DEDUCTION_CONTROL = new ServiceDeductionControl();
        $this->HOLIDAY_CONTROL = new HolidayControl();
        $this->ATTENDANCE_GROUP_CONTROL  = new AttendanceGroupControl();
        $this->ATTENDANCE_CONTROL = new AttendanceControl();
        $this->BANK_CONTROL = new BankControl();
    }
}