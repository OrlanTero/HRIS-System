<?php

namespace Application\controllers\app;

use PHPMailer\PHPMailer\PHPMailer;

class EmailControl
{
    protected $CONNECTION;

    public $MAILER;

    protected $APPLICATION_PASSWORD = "jfffvzsqzfvydzyf";

    protected $HOST = "smtp.gmail.com";

    protected $USERNAME = "okasasg.restaurant@gmail.com";

    protected $PORT = 587;

    protected $SMTP = "tls";

    protected $VERIFICATIONTABLE = "m_user_verifications";

    public function __construct()
    {
        global $CONNECTION;

        $this->CONNECTION = $CONNECTION;
        $this->MAILER = new PHPMailer();
        $this->setup($this->HOST, $this->USERNAME, $this->PORT, $this->SMTP);
        $this->MAILER->inlineImageExists(true);
    }

    private function setup($HOST, $USERNAME, $PORT, $SMTP_SECURE): void
    {
        $this->MAILER->isSMTP();
        // $this->MAILER->SMTPDebug = 2;
        $this->MAILER->Priority = 1;
        $this->MAILER->Mailer = "smtp";
        $this->MAILER->SMTPAutoTLS = false;
        $this->MAILER->SMTPAuth = true;
        $this->MAILER->Host = $HOST;
        $this->MAILER->Username = $USERNAME;
        $this->MAILER->Password = $this->APPLICATION_PASSWORD;
        $this->MAILER->SMTPSecure = $SMTP_SECURE;
        $this->MAILER->Port = $PORT;

        $this->MAILER->setFrom($USERNAME);
    }

    public function sendTo($TO_EMAIL, $SUBJECT, $BODY, $isHTML = false)
    {
        if (strlen($TO_EMAIL) > 0) {
            $this->MAILER->addAddress($TO_EMAIL);
        }
        $this->MAILER->isHTML(true);
        $this->MAILER->Subject = $SUBJECT;
        $this->MAILER->Body = $BODY;
        return $this->MAILER->send();
    }

    public function sendVerificationInto($email, $type, $table = "", $altSubject = false)
    {
        global $APPLICATION;
        $table = $table != '' ? $table : $this->VERIFICATIONTABLE;
        $verification = random_int(100000, 999999);
        $subject = $altSubject != false ? $altSubject : "Okasa User Verification";
        $body = "Your verification code is: " . $verification;
        $send = $this->sendTo($email, $subject, $body);
        $user = $APPLICATION->FUNCTIONS->GetUser($email);
        return $user && $send && $this->insertVerificationToUser($user->user_id, $type, $verification, $table);
    }

    private function insertVerificationToUser($user_id, $type, $verification, $table = ""): bool
    {
        $table = $table != '' ? $table : $this->VERIFICATIONTABLE;
        $this->removeAllRecentKeysOf($user_id, $type, $table);
        return $this->CONNECTION->Insert($table, ["user_id" => $user_id, "user_type" => $type, "verification" => $verification]);
    }

    public function confirmVerificationToUser($user_id, $type, $verification, $table = ""): bool
    {
        $table = $table != '' ? $table : $this->VERIFICATIONTABLE;
        return $this->CONNECTION->Exist($table, ["user_id" => $user_id, "user_type" => $type, "verification" => $verification]);
    }

    private function removeAllRecentKeysOf($user_id, $type, $table = "")
    {
        $table = $table != '' ? $table : $this->VERIFICATIONTABLE;
        return $this->CONNECTION->Delete($table, ['user_id' => $user_id, 'user_type' => $type]);
    }
}