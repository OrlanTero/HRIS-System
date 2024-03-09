import {
    addHtml, ListenToCombo,
    ListenToForm,
    ManageComboBoxes, SetNewComboItems
} from "../../../modules/component/Tool.js";
import Popup from "../../../classes/components/Popup.js";
import {TableListener} from "../../../classes/components/TableListener.js";
import {
    AddRecord, EditRecord, GetPeriodOfAYear,
    RemoveRecords,
    SearchRecords,
    UpdateRecords
} from "../../../modules/app/SystemFunctions.js";
import {SelectClient, SelectEmployee} from "../../../modules/app/Administrator.js";
import AttendanceTableListener from "../../../classes/components/AttendanceTableListener.js";
import {NewNotification, NotificationType} from "../../../classes/components/NotificationPopup.js";

const TARGET = "attendance";

function UpdateTable(TABLE_HTML) {
    const TABLE_BODY = document.querySelector(".main-table-body");

    addHtml(TABLE_BODY, TABLE_HTML);
    ManageTable();
}

function UpdateData() {
    return UpdateRecords(TARGET).then((HTML) => UpdateTable(HTML));
}

function DeleteRequests(ids) {
    const popup = new Popup("category/deleteRecord", null, {
        backgroundDismiss: false,
    });

    popup.Create().then((pop) => {
        popup.Show();

        const no = pop.ELEMENT.querySelector(".no-btn");
        const yes = pop.ELEMENT.querySelector(".yes-btn");

        no.addEventListener("click", () => {
            popup.Remove();
        });

        yes.addEventListener("click", () => {
            RemoveRecords(TARGET, ids.map((id) => {
                return {id: id}
            })).then(() => UpdateData().then(() => popup.Remove()))
        });
    })
}

function ViewRequest(id) {
    const popup = new Popup("attendance/view_attendance_group", {id: id}, {
        backgroundDismiss: false,
    });

    popup.Create().then(((pop) => {
        popup.Show();

        const form = pop.ELEMENT.querySelector("form.form-control");
        const TABLES = [...popup.ELEMENT.querySelectorAll(".main-attendance-table-container .attendance-table-container")].map((TABLE) => new AttendanceTableListener(TABLE));
        const select_client = pop.ELEMENT.querySelector(".select-client");
        const client_input = pop.ELEMENT.querySelector("input[name=client_id]");
        const branch_input = pop.ELEMENT.querySelector("input[name=branch]");
        const year = form.querySelector(".year");
        const period = form.querySelector(".period");
        let selectedClient;

        const check = ListenToForm(form, function (data) {

            if (selectedClient) {
                data['client_id'] = selectedClient.client_id;
            } else {
                delete  data['client_id'];
            }
            delete data['branch'];


            EditRecord("attendance_group", {id, data: JSON.stringify(data)}).then((res) => {
                if (res.code === 200) {
                    Promise.all(TABLES.map((t) => t.saveToDatabase())).finally(() => {
                        NewNotification({
                            title: res.code === 200 ? 'Success' : 'Failed',
                            message: res.code === 200 ? 'Successfully updated' : 'Task Failed to perform!'
                        }, 3000, res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR)

                        popup.Remove();

                        UpdateData();
                    })
                }
            })
        })

        select_client.addEventListener("click", function() {
            SelectClient().then((client) => {
                selectedClient = client;
                client_input.value = client.name;
                branch_input.value = client.branch;
            });
        })

        ListenToCombo(year, function (_, y) {
            const periods = GetPeriodOfAYear(y);

            SetNewComboItems(period, periods);

            ListenToCombo(period, function () {
                check(true);
            })
        });

        for (const TABLE of TABLES) {
            TABLE.listen();
        }

        ManageComboBoxes()
    }))
}

function AddRequest(id) {
    const popup = new Popup("attendance/add_new_attendance_group", {id: id}, {
        backgroundDismiss: false,
    });

    popup.Create().then(((pop) => {
        popup.Show();

        const form = pop.ELEMENT.querySelector("form.form-control");
        const select_client = pop.ELEMENT.querySelector(".select-client");
        const client_input = pop.ELEMENT.querySelector("input[name=client_id]");
        const branch_input = pop.ELEMENT.querySelector("input[name=branch]");
        const year = form.querySelector(".year");
        const period = form.querySelector(".period");
        let selectedClient;

        const check = ListenToForm(form, function (data) {

            data['client_id'] = selectedClient.client_id;

            delete data['branch'];

            //
            AddRecord("attendance_group", {data: JSON.stringify(data)}).then((res) => {
                NewNotification({
                    title: res.code === 200 ? 'Success' : 'Failed',
                    message: res.code === 200 ? 'Successfully added' : 'Task Failed to perform!'
                }, 3000, res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR)

                popup.Remove();

                UpdateData()

            })
        })

        select_client.addEventListener("click", function() {
            SelectClient().then((client) => {
                selectedClient = client;
                client_input.value = client.name;
                branch_input.value = client.branch;
            });
        })

        ListenToCombo(year, function (_, y) {
            const periods = GetPeriodOfAYear(y);

            SetNewComboItems(period, periods);

            ListenToCombo(period, function () {
                check(true);
            })
        });

        ManageComboBoxes()
    }))
}


function ManageTable() {
    const TABLE = document.querySelector(".main-table-container.table-component");

    if (!TABLE) return;

    const TABLE_LISTENER = new TableListener(TABLE);

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
                name: "view-request",
                action: ViewRequest,
                single: true
            },
            {
                name: "add-request",
                action: AddRequest,
                single: true
            },
        ]);
    });
}

function Search(toSearch, filter) {
    SearchRecords(TARGET, toSearch, filter).then((HTML) => UpdateTable(HTML));
}

function ManageSearchEngine() {
    const searchEngine = document.querySelector(".search-engine input[name=search-records]");

    searchEngine.addEventListener("input", () => {
        Search(searchEngine.value)
    })
}

function Init() {
    ManageSearchEngine();
    ManageTable();
}

document.addEventListener("DOMContentLoaded", Init);