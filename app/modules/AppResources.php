<?php

use Application\controllers\system\ClientController;
use Application\controllers\system\EmployeeControl;
use Application\models\Employee;

$EMPLOYEES_TABLE_HEADER_TEXT = ["No", "Emp No", "Name", "Gender", "Address", "Tel", "Mobile","Email"];
$EMPLOYEES_TABLE_BODY_KEY = ["no", "employee_no","firstname", "gender", "address", "telephone", "mobile", "email"];

$EMPLOYMENT_TABLE_HEADER_TEXT = ["No", "Date From", "Date To", "Employee", "Position", "Department", "Type","Status", "Active"];
$EMPLOYMENT_TABLE_BODY_KEY = ["no", "date_hired","date_end", array(
    "primary" => "employee_id",
    "controller" => EmployeeControl::class,
    "value" => "name"
), "position", "department", "e_type", "status", "active"];

$MORTUARY_TABLE_HEADER_TEXT = ["No", "Date Created", "Period", "Year"];
$MORTUARY_TABLE_BODY_KEY = ["no", "date_created","period", "year"];

$CLIENT_TABLE_HEADER_TEXT = ["No", "Name", "Branch", "Date Created"];
$CLIENT_TABLE_BODY_KEY = ["no", "name","branch", "date_created"];

$BANKS_TABLE_HEADER_TEXT = ["No", "Name", "Branch", "Date Created"];
$BANKS_TABLE_BODY_KEY = ["no", "name","branch", "date_created"];

$DEPLOYMENT_TABLE_HEADER_TEXT = ["No", "Date From", "Date To", "Employee"];
$DEPLOYMENT_TABLE_BODY_KEY = ["no", "date_from","date_to", array(
    "primary" => "employee_id",
    "controller" => EmployeeControl::class,
    "value" => "name"
)];

$ADJUSTMENTS_TABLE_HEADER_TEXT = ["No", "Date", "Employee", "Posted", "Paid", "Amount"];
$ADJUSTMENTS_TABLE_BODY_KEY = [];

$BENEFICIARIES_TABLE_HEADER_TEXT = ["No", "Employee", "Type", "Name"];
$BENEFICIARIES_TABLE_BODY_KEY = ["no", "employee_id", "type", "name"];

$EMPLOYMENT_ACCOUNT_TABLE_HEADER_TEXT = ["No", "Client", "Branch", "Basic Pay"];
$EMPLOYMENT_ACCOUNT_TABLE_BODY_KEY = [];

$NO_TYPE_TABLE_HEADER_TEXT = ["No", "Type"];
$NO_TYPE_TABLE_BODY_KEY = ["no", "type"];

$SERVICES_DEDUCTION_TABLE_HEADER_TEXT = ["No", "From", "To", "MSC", "ER", "EE"];
$SERVICES_DEDUCTION_TABLE_BODY_KEY = ["no", "price_from", "price_to", "msc", "er", "ee"];

$HOLIDAYS_TABLE_HEADER_TEXT = ["No", "Date", "Holiday"];
$HOLIDAYS_TABLE_BODY_KEY = ["no", "holiday_date", "holiday"];

$NETPAYS_TABLE_HEADER_TEXT = ["No", "Client", "Branch"];
$NETPAYS_TABLE_BODY_KEY = ["no", "holiday_date", "holiday"];

$ATTENDANCE_GROUP_TABLE_HEADER_TEXT = ["No", "Period", "Year", "Client", "Branch", "Active", "Finished"];
$ATTENDANCE_GROUP_BODY_KEY = ["no", "period", "year", [
    "primary" => "client_id",
    "controller" => ClientController::class,
    "value" => "name"
],
    [
    "primary" => "client_id",
    "controller" => ClientController::class,
    "value" => "branch"
], "active", "finished"];


// ALL FINANCIAL

$PAYROLL_TABLE_HEADER_TEXT = ["No", "Period", "Year", "Client", "Branch", "Remarks", "Posted", "Total"];
$PAYROLL_TABLE_BODY_KEY = ["no", "period", "year",[
    "primary" => "client_id",
        "controller" => ClientController::class,
        "value" => "name"
    ],
    [
        "primary" => "client_id",
        "controller" => ClientController::class,
        "value" => "branch"
    ], "remarks","posted", "total"];

$REQUISITION_TABLE_HEADER_TEXT = ["No", "Req#", "Date", "Remarks", "Status", "Amount"];
$REQUISITION_TABLE_BODY_KEY = ["no", "req_id", "req_date", "remarks", "status", "amount"];

$REQUISITION_EXPENSES_LESS_TABLE_HEADER_TEXT = ["No", "Particulars", "Type", "Basic Unit", "Qty", "Unit Price", "Amount"];
$REQUISITION_EXPENSES_LESS_TABLE_BODY_KEY = ["no", "particulars", "type", "basic_unit", "quantity", "unit_price", "amount"];

$DISBURSEMENT_TABLE_HEADER_TEXT = ["No", "Date", "Voucher #", "Payments", "Paid To", "Type", "Posted", "Cancelled", "Amount"];
$DISBURSEMENT_TABLE_BODY_KEY = ["no", "date", "voucher", "payments", "paid_to", "type", "posted", "cancelled", "amount"];

$COLLECTION_TABLE_HEADER_TEXT = ["No", "Date", "Receipt #", "Payment", "User", "Posted","Amount"];
$COLLECTION_TABLE_BODY_KEY = ["no", "date", "receipt", "payment", "user","posted",  "amount"];

$PETTYCASH_TABLE_HEADER_TEXT = ["No", "Date", "Requested By", "Remarks", "Posted","Amount"];
$PETTYCASH_TABLE_BODY_KEY = ["no", "date", "requested_by", "remarks","posted",  "amount"];

// OTHERS

$GENDERS = ["Male", "Female"];

$CIVIL_STATUS = ["Single", "Married", "Widowed"];

$DEPARTMENTS = ["Field", "Office"];

$EMPLOYMENT_STATUS = ["Contractual", "Probationary", "Regular", "Resigned"];

$EMPLOYMENT_TYPES = ["Field", "Staff"];

$EMPLOYMENT_POSITIONS = ["Administrator", "Cashier", "General Services", "Head Guard", "IT Consultant", "Payroll Officer", "Security Guard"];

$RESTDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Friday"];

$ATTENDANCE_TYPES = ["Regular", "OT", "Night Diff", "Legal Holiday", "Special Holiday", "Rest Day", "Legal Holiday OT", "Special Holiday OT"];
