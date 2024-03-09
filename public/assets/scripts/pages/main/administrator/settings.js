
import MenuBarListener from "../../../classes/components/MenuBarListener.js";
import {TableListener} from "../../../classes/components/TableListener.js";
import Popup from "../../../classes/components/Popup.js";
import {ListenToForm, ManageComboBoxes} from "../../../modules/component/Tool.js";
import {AddRecord} from "../../../modules/app/SystemFunctions.js";

function ManageSystemTypes() {
    const systemTypesTables = document.querySelectorAll(".system_type_table .main-table-container.table-component");

    for (const table of systemTypesTables) {
        const category = table.parentNode.parentNode.getAttribute("data-category");
        const addR = () => {
            const popup = new Popup("others/add_new_system_type", null, {
                backgroundDismiss: false,
            });

            popup.Create().then(((pop) => {
                popup.Show();

                const form = pop.ELEMENT.querySelector("form.form-control");

                ListenToForm(form, function (data) {
                    data.category = category;

                    AddRecord("system_types", {data: JSON.stringify(data)}).then((res) => {
                        popup.Remove();
                    })
                })

                ManageComboBoxes()
            }))
        }

        const deleteR = (id) => {}

        const TABLE_LISTENER = new TableListener(table);

        TABLE_LISTENER.addListeners({
            none: {
                remove: ["delete-request", "view-request"],
                view: ["add-request"],
            },
            select: {
                view: ["delete-request", "view-request"],
            },
            selects: {
                view: ["delete-request"],
                remove: ["view-request"]
            },
        });

        TABLE_LISTENER.init();

        TABLE_LISTENER.listen(() => {
            TABLE_LISTENER.addButtonListener([
                {
                    name: "add-request",
                    action: addR,
                    single: true
                },
                {
                    name: "delete-request",
                    action: deleteR,
                    single: false
                },
            ]);
        });
    }
}

function ManageServiceDeductionTable() {
    const systemTypesTables = document.querySelectorAll(".service_deduction_table .main-table-container.table-component");


    for (const table of systemTypesTables) {
        const category = table.parentNode.parentNode.getAttribute("data-category");

        const addR = () => {
            const popup = new Popup("others/add_new_service_deduction", null, {
                backgroundDismiss: false,
            });

            popup.Create().then(((pop) => {
                popup.Show();

                const form = pop.ELEMENT.querySelector("form.form-control");

                ListenToForm(form, function (data) {
                    data.category = category;

                    AddRecord("system_types", {data: JSON.stringify(data)}).then((res) => {
                        popup.Remove();
                    })
                })

                ManageComboBoxes()
            }))
        }

        const deleteR = (id) => {}

        const TABLE_LISTENER = new TableListener(table);

        TABLE_LISTENER.addListeners({
            none: {
                remove: ["delete-request", "view-request"],
                view: ["add-request"],
            },
            select: {
                view: ["delete-request", "view-request"],
            },
            selects: {
                view: ["delete-request"],
                remove: ["view-request"]
            },
        });

        TABLE_LISTENER.init();

        TABLE_LISTENER.listen(() => {
            TABLE_LISTENER.addButtonListener([
                {
                    name: "add-request",
                    action: addR,
                    single: true
                },
                {
                    name: "delete-request",
                    action: deleteR,
                    single: false
                },
            ]);
        });
    }
}

function ManageTables() {
    ManageSystemTypes();
    ManageServiceDeductionTable();
}

function Init() {
    const menubar = document.querySelector(".menu-bar-settings");
    const MENUBARLISTENER = new MenuBarListener(menubar);

    MENUBARLISTENER.makeActive(0);

    ManageTables();
}


document.addEventListener("DOMContentLoaded", Init);