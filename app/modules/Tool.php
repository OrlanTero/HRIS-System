<?php

use Carbon\Carbon;
use Response;

function UseIcon($name, $folder = '', $extension = '')
{
    $folder = empty($folder) ? 'phosphor' : $folder;
    $extension = empty($extension) ? "svg" : $extension;
    $PATH = './public/assets/media/icons/' . $folder . '/';
    $ICON = $PATH . $name . "." . $extension;

    if (file_exists($ICON)) {
        return file_get_contents($ICON);
    }

    return null;
}

function UseMiniIcon($name, $x, $y, $width, $height, $folder = 'mini-icons', $extension = 'png'): string
{
    $PATH = '/public/assets/media/' . $folder . '/';
    $I = $PATH . $name . "." . $extension;

    $styles = array(
        "width" => $width . "px",
        "height" => $height . "px",
        "background-position" => $x . 'px' . ' ' . $y . 'px',
        "background-size" => "auto",
        "background-repeat" => "no-repeat",
        "display" => "inline-block",
        "background-image" => 'url("' . $I . '")'
    );

    $style = implode(";", array_map(static function ($key, $value) {
        return $key . ":" . $value;
    }, array_keys($styles), array_values($styles)));

    return "<i data-visualcompletion='css-img' style='" . $style . "'></i>";
}

function UseSVG($name, $folder = 'icons/phosphor', $extension = 'svg')
{
    $folder = empty($folder) ? 'phosphor' : $folder;
    $extension = empty($extension) ? "svg" : $extension;
    $PATH = './public/assets/media/' . $folder . '/';
    $SVG = $PATH . $name . "." . $extension;

    if (file_exists($SVG)) {
        return file_get_contents($SVG);
    }

    return null;
}

function UseImage($image, $asImage = false, $alt = "", $classNames = "", $styles = ""): string
{
    $path = '/public/assets/media/';
    $src = $path . $image;
    $img = '<img libraries="' . $src . '" alt="' . $alt . '" class="' . $classNames . '"  style="'. $styles. '"/>';

    return $asImage ? $img : $src;
}

function CreateCheckbox()
{
    $output = '
    <div class="custom-checkbox-parent">
        <div class="checkbox-content">
            <div class="circle"></div>
            <label class="custom-checkbox">
                <input type="checkbox" class="table-checkbox">
                <span class="checkmark"></span>
            </label>
        </div>
    </div>
    ';

    return $output;
}

/**
 * @throws ReflectionException
 */
function NewInstanceOfModelClass($model, $record) {
    return (new ReflectionClass($model))->newInstance($record);
}

/**
 * @throws ReflectionException
 */
function GetClassMemberByID($data, $id) {
    $controller = NewInstanceOfModelClass($data['controller'], false);
    $model = $controller->get($id, true);

    return $model ? $model->{$data['value']} : "";
}

function CreateEmployeeAttendanceTable($attendance_group, $employee) {
    global $ATTENDANCE_TYPES;

    $days = CountDaysInPeriod($attendance_group->period);

    $attendances = $attendance_group->getAttendanceOf($employee->employee_id);

    $output = '
        <div class="attendance-table-container" data-employee-id="'. $employee->employee_id .'" data-attendance-id="'. $attendance_group->attendance_group_id .'">
            <div class="top">
                <div class="left">
                   <h4>'. $employee->name .'</h4>
                </div>
            </div>
            <div class="bot">
                <div class="custom-attendance-table">
                    <table>
                        <thead class="header">';
    $output .= '<tr>';

    $output .= '<th>A Type</th>';

    for ($i = $days[0][0]; $i <= $days[0][1]; $i++) {
        $output .= '<th class="sched-item day-item-th" data-day="'.$i.'">'.$i.'</th>';
    }

    $output .= '<th>Total</th>';

    $output .= '</tr>';

    $output .= '</thead><tbody class="body">';

    $ii = 0;
    foreach ($ATTENDANCE_TYPES as $ATTENDANCE_TYPE) {
        $output .= '<tr class="type-item attendance" data-type="'.$ii.'">';

        $output .= '<td data-type="'.$ii.'"> <span class="text">'. $ATTENDANCE_TYPE .'</span> </td>';

        for ($i = $days[0][0]; $i <= $days[0][1]; $i++) {
            $value = $attendance_group->getValueOfAttendanceIn($attendances, $i, $ii);

            $output .= '<td class="sched-item day-item-td tooltip as-table" data-day="'.$i.'"  data-type="'.$ii.'" data-id="'. ($value ? $value->attendance_id : null) .'">
                <span class="tooltiptext">
                    <span>'. $ATTENDANCE_TYPE .' day '. $i.'</span>
                </span>
                <div class="text">'. ($value ? $value->hours : null) .'</div>
</td>';
        }

        $output .= '<td class="day-total"><div class="text">0</div></td>';

        $output .= '</tr>';

        $ii++;
    }

    $output .= '<tr class="type-item"><td><span class="text">Total</span></td>';

    for ($i = $days[0][0]; $i <= $days[0][1]; $i++) {
        $output .= '<td class="sched-item day-item-td tooltip as-table tooltip-top all-total" data-day="'.$i.'"  data-type="'.$ii.'">
                <span class="tooltiptext">
                    <span>Total day '. $i.'</span>
                </span>
                <div class="text"></div>
                </td>';
    }

    $output .= '<td class="day-main-total the-most-total"><div class="text">0</div></td>';
    $output .= '</tr>';


    $output .= '        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ';

    return $output;
}

function CreateTable($headeritems, $bodyitems, $data, $idname, $button = -1, $nocheckbox = false, $scrollable = true)
{

    $output = '<div class="custom-grid-table ' . ($scrollable ? '' : "no-scroll") . '">
                <table class="' . ($nocheckbox ? '' : 'has-check-box ') . '">';

    $output .= '<thead class="grid-table-header"><tr>';

    if (!$nocheckbox) {
        $output .= '<th>' . CreateCheckbox() . '</th>';
    }

    foreach ($headeritems as $item) {
        $output .= '<th>' . $item . '</th>';
    }

    $output .= '</tr></thead>';

    $output .= '<tbody class="grid-table-body">';

    $count = 1;

    foreach ($data as $item) {

        $output .= '<tr class="body-item" data-id="' . $item[$idname] . '">';

        if (!$nocheckbox) {
            $output .= '<td>' . CreateCheckbox() . '</td>';
        }

        if ($button >= 0) {
            $btnitems = array_fill(0, $button, $button);
            $bitem = array_fill(0, count($bodyitems), $item);
            $ranged = range(0, $button);
            $contents = array_map(function ($key, $val, $r, $b) use ($count) {
                return $r === $b - 1 ? $key : (!is_array($key) ? ($key === 'no' ? $count : $val[$key]) : GetClassMemberByID($key, $val[$key['primary']]));
            }, $bodyitems, $bitem, $ranged, $btnitems);
            $i = 0;

            foreach ($contents as $content) {
                if ($i === $button - 1) {
                    $output .= '
                    <td>
                        <div class="icon-button align-left">
                            <div class="text">
                                <span>' . $content . '</span>
                            </div>
                        </div>
                    </td>
                    ';
                } else {
                    $output .= '<td>' . $content . '</td>';
                }
                $i++;
            }
        } else {
            $bitem = array_fill(0, count($bodyitems), $item);
            $contents = array_map(function ($key, $val) {
                return $val[$key];
            }, $bodyitems, $bitem);

            foreach ($contents as $content) {
                $output .= '<td>' . $content . '</td>';
            }
        }

        $output .= '</tr>';

        $count++;
    }

    $output .= '</tbody>';

    $output .= '</table></div>';

    return $output;
}

function CreateComboBox($name, $placeholder, $items, $firstval = false, $initial = null): string
{
    $value = $initial ? (!is_array($initial) ? $initial : $initial['text']) : ($firstval ? $items[0] : "");
    $defValue = $initial ? (!is_array($initial) ? $initial : $initial['value']) : '';
    $output = '<div class="custom-combo-box ' . $name . '">';
    $output .= '
    <div class="main-content">
    <input type="text" value="' . $value . '" name="' . $name . '"  placeholder="' . $placeholder . '" autocomplete="off" data-value="' . $defValue . '">
        <div class="icon">
        <svg width="16px" height="16px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
            <path d="M128,180a3.98881,3.98881,0,0,1-2.82861-1.17139l-80-80.00024a4.00009,4.00009,0,0,1,5.65722-5.65674L128,170.34326l77.17139-77.17163a4.00009,4.00009,0,0,1,5.65722,5.65674l-80,80.00024A3.98881,3.98881,0,0,1,128,180Z"/>
        </svg>      
        </div>
    </div>
    <div class="floating-container">';

    if (!empty($items)) {

        foreach ($items as $item) {
            if (isset($item["value"])) {
                $output .= '
                            <div class="item" value="' . $item["value"] . '"><span>' . $item["text"] . '</span></div>
                        ';
            } else {
                $output .= '
                            <div class="item"><span>' . $item . '</span></div>
                        ';
            }
        }
    }

    $output .= '</div>';
    $output .= '</div>';

    return $output;
}

function UploadImageFromPath($fromPath, $filename, $topath)
{
    $extension = pathinfo($fromPath, PATHINFO_EXTENSION);
    $path = $topath . $filename . '.' . $extension;
    $msg = "Successfully Uploaded!";

    if (!file_exists($topath) && !mkdir($topath, 0777, true) && !is_dir($topath)) {
        $msg = 'Directory "%s" was not created';
    }

    $imageData = file_get_contents($fromPath);
    $upload = file_put_contents($path, $imageData);

    return new Response($upload ? 200 : 203, $msg, ["filename" => $filename, "path" => $path]);
}

function UploadImageFromBase64($base64Data, $topath, $filename, $extension = 'jpg')
{

    $path = $topath . $filename . '.' . $extension;
    $msg = "Successfully Uploaded!";

    if (!file_exists($topath) && !mkdir($topath, 0777, true) && !is_dir($topath)) {
        $msg = 'Directory "%s" was not created';
    }

    $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Data));

    $upload = file_put_contents($path, $data);

    return new Response($upload ? 200 : 203, $msg, ["filename" => $filename, "path" => $path]);
}

function UploadImageFromFile($file, $_filename, $topath)
{
    $extension = pathinfo($file["name"], PATHINFO_EXTENSION);
    $filename = $_filename . '.' . $extension;
    $target_file = $topath . $filename;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    $msg = "";
    $uploadOk = -1;

    $check = getimagesize($file["tmp_name"]);

    if ($check !== false) {
        $msg = "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        $msg = "File is not an image.";
        $uploadOk = 0;
    }

    if (file_exists($target_file)) {
        $msg = "Sorry, file already exists.";
        $uploadOk = 0;
    }

    if (!file_exists($topath) && !mkdir($topath, 0777, true) && !is_dir($topath)) {
        $msg = 'Directory "%s" was not created';
    }

    if (
        ($imageFileType !== "jpg") && $imageFileType !== "png" && $imageFileType !== "jpeg"
        && $imageFileType !== "gif"
    ) {
        $msg = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
        $uploadOk = 0;
    }

    if ($uploadOk == 0) {
        $msg = "Sorry, your file was not uploaded.";
    } else if (move_uploaded_file($file["tmp_name"], $target_file)) {
        $msg = "Successfully uploaded!";
    }

    return new Response($uploadOk ? 200 : 203, $msg, ["filename" => $filename, "path" => $target_file]);
}

function UploadFileFromFile($FILE, $TOPATH, $FILENAME = false)
{
    $extension = pathinfo($FILE["name"], PATHINFO_EXTENSION);
    $fileTmpPath = $FILE['tmp_name'];
    $fileName = $FILENAME && $FILENAME != 'false' ? $FILENAME . '.' . $extension : $FILE['name'];
    $dest_path = $TOPATH . $fileName;
    $i = 1;

    while (file_exists($dest_path)) {
        $fn = pathinfo($fileName, PATHINFO_FILENAME);
        $nfn = $fn . '(' . $i . ').' . $extension;
        $dest_path = $TOPATH . $nfn;
        $i++;
    }

    $upload = move_uploaded_file($fileTmpPath, $dest_path);
    $message = 'File is successfully uploaded.';
    $message1 = 'There was some error moving the file to upload directory. Please make sure the upload directory is writable by web server.';
    return new Response($upload ? 200 : 204, $upload ? $message : $message1, ["path" => $dest_path, "basename" => pathinfo($dest_path, PATHINFO_BASENAME)]);
}

function ObjectToItemList($objectArr = [])
{
    $output = '';

    if (empty($objectArr)) {
        $output .= '
            <div id="empty">
            <h3>There\'s nothing to show</h3>
</div>
        ';
    } else {
        foreach ($objectArr as $item) {
            $status = ['danger', 'success', 'warning'][$item->status_id];
            $output .= '
        <div class="info-item ' . $status . '" >
            <div class="item-left">
                <p>' . $item->title . '</p>
                <span>' . $item->message . '</span>
            </div>
            <div class="item-right"></div>
        </div>
        ';
        }
    }

    return $output;
}

function GetTimeAgo($time_ago)
{
    $date = Carbon::createFromFormat('Y-m-d H:i:s', $time_ago, "Asia/Singapore");
    $date->setTimezone('UTC');
    return $date->shortAbsoluteDiffForHumans();
}

function GetPeriodsOfAYear($year) {
    $periods = [];
    $months = array(
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July ',
        'August',
        'September',
        'October',
        'November',
        'December',
    );

    for ($i = 1; $i < 13; $i++) {
        $days = cal_days_in_month(CAL_GREGORIAN, $i, $year);
        $month = $months[$i - 1];

        $periods[] = $month . " 1 to " . 15;
        $periods[] = $month . " 16 to " . $days;

        if ($i === 12) {
            $periods[] =  "13th Month 1 to " . 15;
            $periods[] =  "13th Month 16 to " . $days;
        }
    }


    return $periods;
}

function CountDaysInPeriod($period) {
    preg_match_all('!\d+!', $period, $matches);

    return $matches;
}

function GetYearsFrom($year) {
    $currentYear = (int) date("Y");
    $years = [];

    for ($i = $year; $i <= $currentYear; $i++) {
        $years[] = $i;
    }

    return $years;
}


function CreateMenuBarHeader($id_name, $headers) {
    $output ='
        <div class="menu-tab-control" data-name="'.$id_name.'">
            <div class="menu-header">';
    $i = 0;

    foreach ($headers as $header) {
        $output .= '
            <div class="header-item" data-id="'.$i.'">
                <span>'.$header.'</span>
            </div>
        ';

        $i++;
    }
            
    $output .= '</div>
            <div class="menu-body">';

    $output .= '</div>
        </div>
    ';

    return $output;
}

