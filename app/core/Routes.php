<?php

namespace Application\core;

use Application\abstracts\MessageAbstract;
use Application\controllers\system\MessageControl;
use Response;

class Routes
{
    protected $KLEIN;
    protected $CONNECT;
    protected $SESSION;
    protected $APPLICATION;

    public function __construct($APPLICATION)
    {
        global $CONNECTION;
        global $KLEIN;
        global $SESSION;

        $this->CONNECT = $CONNECTION;
        $this->KLEIN = $KLEIN;
        $this->SESSION = $SESSION;
        $this->APPLICATION = $APPLICATION;
    }

    public function loadRoutes(): void
    {
        $KLEIN = $this->KLEIN;

        $this->applicationRoutes();
        $this->apiRoutes();
        $this->toolRoutes();
        $this->componentsRoutes();
        $KLEIN->dispatch();
    }

    private function authenticationRoutes(): void
    {

    }

    private function applicationRoutes(): void
    {
        $KLEIN = $this->KLEIN;

        $this->KLEIN->with("", static function () use ($KLEIN) {
            $defaultView = "public/views/pages/dashboard.phtml";

            $KLEIN->respond(
                "GET",
                "/?",
                static function ($req, $res, $service) use ($defaultView) {
                    return $service->render($defaultView, ["view_path" => "/"]);
                }
            );

            $KLEIN->respond(
                "GET",
                "/[:view]",
                static function ($req, $res, $service) use ($defaultView) {
                    $view = "public/views/pages/" . $req->param("view") . ".phtml";
                    return $service->render(file_exists($view) ? $view : $defaultView, ["view_path" => $req->param("view")]);
                }
            );

            $KLEIN->respond(
                "GET",
                "/[:view]/[:subview]",
                static function ($req, $res, $service) use ($defaultView) {
                    $view = "public/views/pages/" . $req->param("view") . "/" .$req->param("subview"). ".phtml";

                    return $service->render(file_exists($view) ? $view : $defaultView, ["view_path" => $req->param("view") . "/" .$req->param("subview")]);
                }
            );
        });
    }

    private function apiRoutes(): void
    {
        $KLEIN = $this->KLEIN;
        $APPLICATION = $this->APPLICATION;
        $SESSION = $this->SESSION;

        $this->KLEIN->with("/api", function () use ($KLEIN, $APPLICATION, $SESSION) {

            $this->KLEIN->with("/admin", function () use ($KLEIN, $APPLICATION) {
                $KLEIN->respond("/[:view]/updateRecords", function ($req, $res, $service) {
                    return $service->render("public/views/components/popup/" . $req->param("view") . '/updateRecords.phtml');
                }
                );

                $KLEIN->respond("/[:view]/searchRecords", function ($req, $res, $service) {
                    return $service->render("public/views/components/popup/" . $req->param("view") . '/searchRecords.phtml');
                }
                );

                $KLEIN->respond("/[:view]/filterRecords", function ($req, $res, $service) {
                    return $service->render("public/views/components/popup/" . $req->param("view") . '/filterRecords.phtml');
                }
                );

                // DITO KA MAG AADDD NG MGA FUNCTIONS NG BAWAT TABLE SA DATABASE

                $KLEIN->with("/employees", function () use ($KLEIN, $APPLICATION) {
                    $KLEIN->respond(
                        "POST",
                        "/removeRecord",
                        function () use ($APPLICATION) {
                            return json_encode($APPLICATION->FUNCTIONS->PRODUCT_CATEGORY_CONTROL->removeRecord($_POST["id"]));
                        }
                    );

                    $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->EMPLOYEE_CONTROL->add(json_decode($_POST["data"], true)));
                    });

                    $KLEIN->respond("POST", "/editRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->EMPLOYEE_CONTROL->edit(json_decode($_POST["data"], true)));
                    });

                    $KLEIN->respond("POST", "/removeRecords", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->EMPLOYEE_CONTROL->removeRecords(json_decode($_POST["data"], true)));
                    });
                });

                // FOR MORTUARY
                $KLEIN->with("/mortuary", function () use ($KLEIN, $APPLICATION) {
                    $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->MORTUARY_CONTROL->add(json_decode($_POST["data"], true)));
                    });

                    $KLEIN->respond("POST", "/editRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->MORTUARY_CONTROL->edit(json_decode($_POST["data"], true)));
                    });
                });

                // FOR EMPLOYMENT
                $KLEIN->with("/employment", function () use ($KLEIN, $APPLICATION) {
                    $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->EMPLOYMENT_CONTROL->addRecord(json_decode($_POST["data"], true)));
                    });

                    $KLEIN->respond("POST", "/editRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->EMPLOYMENT_CONTROL->editRecord($_POST['id'], json_decode($_POST["data"], true)));
                    });
                });

                $KLEIN->with("/clients", function () use ($KLEIN, $APPLICATION) {
                    $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->CLIENT_CONTROL->addRecord(json_decode($_POST["data"], true)));
                    });

                    $KLEIN->respond("POST", "/editRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->CLIENT_CONTROL->editRecord($_POST["id"], json_decode($_POST["data"], true)));
                    });
                });

                $KLEIN->with("/banks", function () use ($KLEIN, $APPLICATION) {
                    $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->BANK_CONTROL->addRecord(json_decode($_POST["data"], true)));
                    });

                    $KLEIN->respond("POST", "/editRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->BANK_CONTROL->editRecord($_POST["id"], json_decode($_POST["data"], true)));
                    });

                    $KLEIN->respond("POST", "/removeRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->BANK_CONTROL->removeRecord($_POST["id"], json_decode($_POST["data"], true)));
                    });
                });

                $KLEIN->with("/holidays", function () use ($KLEIN, $APPLICATION) {
                    $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->HOLIDAY_CONTROL->addRecord(json_decode($_POST["data"], true)));
                    });

                    $KLEIN->respond("POST", "/editRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->HOLIDAY_CONTROL->editRecord($_POST["id"],json_decode($_POST["data"], true)));
                    });
                });

                $KLEIN->with("/employee_deployment", function () use ($KLEIN, $APPLICATION) {
                    $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->DEPLOYED_EMPLOYEE_CONTROL->addRecord(json_decode($_POST["data"], true)));
                    });

                    $KLEIN->respond("POST", "/filterRecords", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->DEPLOYED_EMPLOYEE_CONTROL->filterRecords(json_decode($_POST["data"], true)));
                    });
                });

                $KLEIN->with("/system_types", function () use ($KLEIN, $APPLICATION) {
                    $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->SYSTEM_TYPES_CONTROL->addRecord(json_decode($_POST["data"], true)));
                    });
                });

                $KLEIN->with("/attendance_group", function () use ($KLEIN, $APPLICATION) {
                    $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->ATTENDANCE_GROUP_CONTROL->addRecord(json_decode($_POST["data"], true)));
                    });

                    $KLEIN->respond("POST", "/editRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->ATTENDANCE_GROUP_CONTROL->editRecord($_POST['id'], json_decode($_POST["data"], true)));
                    });
                });

                $KLEIN->with("/attendance_items", function () use ($KLEIN, $APPLICATION) {
                    $KLEIN->respond("POST", "/addRecord", function () use ($APPLICATION) {
                        return json_encode($APPLICATION->FUNCTIONS->ATTENDANCE_CONTROL->add(json_decode($_POST["data"], true)));
                    });
                });
            });

            $this->KLEIN->with("/post", function () use ($KLEIN, $APPLICATION) {
                $KLEIN->respond("POST", "/[:request]", function ($req) use ($APPLICATION) {
                    return json_encode($APPLICATION->FUNCTIONS->POST_CONTROL->run($req->param("request")));
                });
            });
        });
    }

    private function componentsRoutes(): void
    {
        $KLEIN = $this->KLEIN;

        $KLEIN->respond("POST", "/components/popup/[:folder]?/[:view]?", static function ($req, $res, $service) use ($KLEIN) {
            $mainPath = "public/views/components/popup/" . $req->param("folder") . '/';
            $view = $mainPath . $req->param("view") . '.phtml';
            return file_exists($view) ? $service->render($view) : null;
        });

        $KLEIN->respond("POST", "/components/containers/[:folder]?/[:view]?", static function ($req, $res, $service) use ($KLEIN) {
            $mainPath = "public/views/components/containers/" . $req->param("folder") . '/';
            $view = $mainPath . $req->param("view") . '.phtml';
            return file_exists($view) ? $service->render($view) : null;
        });
    }

    private function toolRoutes()
    {
        $KLEIN = $this->KLEIN;

        $KLEIN->with("/tool", function () use ($KLEIN) {
            $KLEIN->respond(
                "POST",
                "/uploadImageFromFile",
                function () {
                    return json_encode(UploadImageFromFile($_FILES['file'], $_POST["filename"], $_POST['destination']), JSON_THROW_ON_ERROR);
                }
            );

            $KLEIN->respond(
                "POST",
                "/uploadImageFromPath",
                function () {
                    return json_encode(UploadImageFromPath($_POST['path'], $_POST["filename"], $_POST['destination']), JSON_THROW_ON_ERROR);
                }
            );

            $KLEIN->respond(
                "POST",
                "/uploadImageFromBase64",
                function () {
                    return json_encode(UploadImageFromBase64($_POST['base64'], $_POST['destination'], $_POST["filename"], $_POST['extension'] ?? 'jpg'), JSON_THROW_ON_ERROR);
                }
            );

            $KLEIN->respond(
                "POST",
                "/UploadFileFromFile",
                function () {
                    return json_encode(UploadFileFromFile($_FILES['file'], $_POST['destination'], $_POST['filename']), JSON_THROW_ON_ERROR);
                }
            );
        });
    }
}