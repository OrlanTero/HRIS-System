<?php

namespace Application\core;

use PDO;
use Throwable;

class Connection
{

    protected $HOST = "localhost";

    protected $DATABASE = "hris_database";

    protected $USERNAME = "root";

    protected $PASSWORD = "";

    protected $PORT = "3306";

    protected $CONNECTION = null;

    public $ERRORMESSAGE;

    public function __construct()
    {
        $this->Create();
    }

    public function Create(): void
    {
        $this->CONNECTION = new PDO("mysql:host=" . $this->HOST . ";dbname=" . $this->DATABASE . ";port=" . $this->PORT, $this->USERNAME, $this->PASSWORD);
    }

    public function Apply($HOST, $DATABASE, $USERNAME, $PASSWORD)
    {
        $this->HOST = $HOST;
        $this->DATABASE = $DATABASE;
        $this->USERNAME = $USERNAME;
        $this->PASSWORD = $PASSWORD;
        $this->Create();
    }

    public function Test()
    {
        try {
            return true;
        } catch (Throwable $th) {
            throw $th;
            return false;
        }
    }

    public function Query($query, $fetchAll = false, $some = "")
    {
        $stmt = $this->CONNECTION->prepare($query . ' ' . $some);
        $stmt->execute();
        return $fetchAll ? $stmt->fetchAll() : $stmt->fetch();
    }

    public function Select($table, $where, $fetchAll, $condition = "=")
    {
        $w = isset($where) ? " WHERE " . $this->ConditionToQ($where, " AND ", $condition) : "";
        $query = "SELECT * FROM " . $table . $w;
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();

        return $fetchAll ? $stmt->fetchAll() : $stmt->fetch();
    }

    public function ConditionToQ($data, $delimiter, $condition = "="): string
    {

        if (empty($data)) {
            return "";
        }

        return implode($delimiter, array_map(static function ($value, $key) use ($condition) {
            return $key . ' ' . $condition . ' ' . ($value == null ? "NULL" : "'" . $value . "'");
        }, $data, array_keys($data)));
    }

    public function SelectMultiCondition($table, $condition, $fetchAll, $limit = false, $order = "", $specific = "*")
    {
        $w = $this->MultiConditionToQ($condition, " AND ");
        $w = empty($condition) ? "" : " WHERE " . $w;
        $l = $limit ? "LIMIT " . $limit : "";
        $query = implode(" ", array("SELECT " . $specific . " FROM ", $table . $w, $order, $l));
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();

        return $fetchAll ? $stmt->fetchAll() : $stmt->fetch();
    }

    public function MultiConditionToQ($data, $delimeter): string
    {
        if (empty($data))
            return "";

        return implode($delimeter, array_map(static function ($stmt) {
            return implode(" ", array($stmt[0], $stmt[1], !is_array($stmt[2]) ? "'" . $stmt[2] . "'" : implode(" AND ", array("'" . $stmt[2][0] . "'", "'" . $stmt[2][1] . "'"))));
        }, $data));
    }

    public function SelectMultiConditionOR($table, $condition, $fetchAll, $limit = false, $order = "")
    {
        $w = $this->MultiConditionToQOption($condition);
        $w = empty($condition) ? "" : " WHERE " . $w;
        $l = $limit ? "LIMIT " . $limit : "";
        $query = implode(" ", array("SELECT * FROM ", $table . $w, $order, $l));
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();

        return $fetchAll ? $stmt->fetchAll() : $stmt->fetch();
    }

    public function MultiConditionToQOption($options): string
    {
        return implode(" OR ", array_map(function ($option) {
            return $this->MultiConditionToQ($option, " AND ");
        }, $options));
    }

    public function SelectExcept($table, $where, $except, $fetchAll)
    {
        $e = $this->ConditionToQ($except, " AND ", "!=");
        $w = $this->ConditionToQ($where, " AND ");
        $con = ($e || $w) ? " WHERE " . ($w ? $w . " AND " . $e : $e) : "";
        $query = "SELECT * FROM " . $table . $con;
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();

        return $fetchAll ? $stmt->fetchAll() : $stmt->fetch();
    }

    public function Exist($table, $where, $getID = false)
    {
        $w = isset($where) ? " WHERE " . $this->ConditionToQ($where, " AND ") : "";
        $query = "SELECT * FROM " . $table . $w;
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch();

        return $stmt->rowCount() > 0 ? ($getID ? $row[$getID] : true) : false;
    }

    public function SelectOr($table, $options, $fetchAll)
    {
        $w = !empty($options) ? " WHERE " . $this->ConditionToQOption($options) : "";
        $query = "SELECT * FROM " . $table . $w;
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();

        return $fetchAll ? $stmt->fetchAll() : $stmt->fetch();
    }

    public function SelectToday($table, $where, $datecolname, $fetchAll, $condition = "=")
    {
        $today = " " . $datecolname . "  >= now() - INTERVAL 1 DAY AND ";
        $w = isset($where) ? " WHERE " . $today . " " . $this->ConditionToQ($where, " AND ", $condition) : "";
        $query = "SELECT * FROM " . $table . $w;
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();

        return $fetchAll ? $stmt->fetchAll() : $stmt->fetch();
    }

    public function SelectMultiConditionToday($table, $condition, $datecolname, $fetchAll = false, $limit = false, $order = "", $specific = "*")
    {
        $today = "DATE(" . $datecolname . ")  >= now() - INTERVAL 1 DAY AND ";
        $w = $this->MultiConditionToQ($condition, " AND ");
        $w = empty($condition) ? "" : " WHERE " . $today . $w;
        $l = $limit ? "LIMIT " . $limit : "";
        $query = implode(" ", array("SELECT " . $specific . " FROM ", $table . $w, $order, $l));
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();

        return $fetchAll ? $stmt->fetchAll() : $stmt->fetch();
    }

    public function ConditionToQOption($options): string
    {
        return implode(" OR ", array_map(function ($option) {
            return $this->ConditionToQ($option, " AND ");
        }, $options));
    }

    public function CountRow($table, $where = [])
    {
        $w = " WHERE " . $this->ConditionToQ($where, " AND ");
        $query = "SELECT * FROM " . $table . $w;
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function Delete($table, $where)
    {
        $w = isset($where) ? " WHERE " . $this->ConditionToQ($where, " AND ") : "";
        $query = "DELETE FROM " . $table . $w;
        return $this->CONNECTION->prepare($query)->execute();
    }

    public function Update($table, $data, $where)
    {
        $w = isset($where) ? " WHERE " . $this->ConditionToQ($where, " AND ") : "";
        $query = $this->MakeEditQuery($table, $data, $w);
        return $this->CONNECTION->prepare($query)->execute();
    }

    public function MakeEditQuery($table, $data, $where): string
    {
        $set = $this->ConditionToQ($data, ",");

        return implode(" ", array("UPDATE", $table, "SET", $set, $where));
    }

    public function SelectBetween($table, $column, $from, $to, $fetchAll, $limit = false, $order = "", $specific = "*")
    {
        $w = "";
        $l = $limit ? "LIMIT " . $limit : "";
        $query = implode(" ", array("SELECT " . $specific . " FROM ", $table . $w, $order, $l));
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();

        return $fetchAll ? $stmt->fetchAll() : $stmt->fetch();
    }

    public function Insert($table, $data, $getID = false)
    {
        $query = $this->MakeInsertQuery($table, $data);
        $stmt = $this->CONNECTION->prepare($query);

        try {
            if ($stmt->execute()) {
                if ($getID) {
                    return $this->CONNECTION->lastInsertId();
                }

                return true;
            }
        } catch (\Exception $e) {
            $this->ERRORMESSAGE = $e->getMessage();
        }

        return false;
    }

    public function MakeInsertQuery($table, $data): string
    {
        $where = implode(",", array_keys($data));
        $val = implode(",", array_map(static function ($val) {
            return "'" . $val . "'";
        }, array_values($data)));

        return implode("", array(" INSERT INTO ", $table, " (" . $where . ") ", " VALUES (" . $val . ")"));
    }

    public function Search($table, $search, $into, $where)
    {
        $query = $this->MakeSearchQuery($table, $search, $into, $where);
        $stmt = $this->CONNECTION->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function MakeSearchWithForeignQuery($table, $search, $into, $where): string
    {
        $w = isset($where) ? $this->ConditionToQ($where, " AND ") : "";

        $likes = implode(" OR ", array_map(static function ($i, $j, $k) {
            return $i . " LIKE " . "'{$j}%' " . (!empty($k) ? " AND " . $k : "");
        }, $into, array_fill(0, count($into), $search), array_fill(0, count($into), $w)));

        return "SELECT * FROM " . $table . "  WHERE " . $likes;
    }

    public function MakeSearchQuery($table, $search, $into, $where): string
    {
        $w = isset($where) ? $this->ConditionToQ($where, " AND ") : "";

        $likes = implode(" OR ", array_map(function ($i, $j, $k) use ($table, $search) {

            return !(isset($i['table'], $i['primary']) && is_array($i)) ? ($i . " LIKE " . "'{$j}%' " . (!empty($k) ? " AND " . $k : ""))  : ("(SELECT COUNT(*) FROM $table INNER JOIN " . $i['table'] . " ON " . $table . "." . $i['primary'] . " = " . $i['table'] . "." . $i['primary'] . " WHERE " . implode(" OR ", array_map(function($ii, $jj, $kk){
                    return  $ii . " LIKE " . "'{$jj}%' " . (!empty($kk) ? " AND " . $kk : "");
                }, $i['into'], array_fill(0, count($i['into']), $search), array_fill(0, count($i['into']), isset($i['where']) ? $this->ConditionToQ($i['where'], " AND ") : []))) . ") > 0");
        }, $into, array_fill(0, count($into), $search), array_fill(0, count($into), $w)));

        return "SELECT * FROM " . $table . "  WHERE " . $likes;
    }

    public function Unsets($result, $fields = [])
    {
        if (isset($result) && !empty($result) && !empty($fields)) {
            foreach ($fields as $field) {
                unset($fields, $field);
            }
        }
    }
}