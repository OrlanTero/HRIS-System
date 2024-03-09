<?php

namespace Application\controllers\system;

use Application\abstracts\ControlDefaultFunctions;
use Application\models\Attendance;
use Response;

class AttendanceControl extends ControlDefaultFunctions
{
    protected $MODEL_CLASS = Attendance::class;
    protected $TABLE_NAME = "attendance";
    protected $TABLE_PRIMARY_ID = "attendance_id";
    protected $SEARCH_LOOKUP = [];

    public function add($data) {
        try {
            foreach ($data as $attendance) {
                $status = $attendance['status'];
                $id = $attendance['id'];

                unset($attendance['status'], $attendance['id']);

                // add
                if ($status === 222) {
                    $this->addRecord($attendance);

                    // update
                } else if ($status === 333) {
                    $this->editRecord($id, $attendance);
                }
            }

            return new Response(200, "Successfully Saved");
        } catch (\Exception $e) {
            return new Response(204, "Failed to Save!");
        }
    }
}