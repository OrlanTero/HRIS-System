import {
    addHtml, ListenToCombo,
    ListenToForm,
    ManageComboBoxes, SetNewComboItems
} from "../../../modules/component/Tool.js";
import Popup from "../../../classes/components/Popup.js";
import {TableListener} from "../../../classes/components/TableListener.js";
import {
    AddRecord, EditRecord,
    GetPeriodOfAYear,
    RemoveRecords,
    SearchRecords,
    UpdateRecords
} from "../../../modules/app/SystemFunctions.js";
import { GetEmployee, SelectEmployee} from "../../../modules/app/Administrator.js";
import {NewNotification, NotificationType} from "../../../classes/components/NotificationPopup.js";

const TARGET = "mortuary";

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
    const popup = new Popup("mortuary/view_mortuary", {id}, {
        backgroundDismiss: false,
    });

    popup.Create().then(((pop) => {
        popup.Show();

        const form = pop.ELEMENT.querySelector("form.form-control");
        const year = form.querySelector(".year");
        const period = form.querySelector(".period");
        let beneficiaries = [];

        ListenToForm(form, function (data) {
            console.log(data, beneficiaries)

            EditRecord(TARGET, {data: JSON.stringify({id, data, beneficiaries})}).then((res) => {
                popup.Remove();

                NewNotification({
                    title: res.code === 200 ? 'Success' : 'Failed',
                    message: res.code === 200 ? 'Successfully Updated' : 'Task Failed to perform!'
                }, 3000, res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR)

            })
        })

        ListenToCombo(year, function (_, y) {
            const periods = GetPeriodOfAYear(y);

            SetNewComboItems(period, periods);
        })


        ManageBeneficiariesTable(pop, beneficiaries, (up) => {
            beneficiaries = up;
        });
        ManageComboBoxes()
    }))
}

function ManageBeneficiariesTable(pop, beneficiaries, update) {
    const TABLE = pop.ELEMENT.querySelector(".main-table-container.table-component");

    if (!TABLE) return;

    const TABLE_LISTENER = new TableListener(TABLE);

    let ALLBENEFICIARIES = beneficiaries;

    const _Add = () => {
        const popup = new Popup("mortuary/add_new_beneficiaries", null, {
            backgroundDismiss: false,
        });

        popup.Create().then((p) => {
            popup.Show();

            const form = p.ELEMENT.querySelector("form.form-control");
            let employee = p.ELEMENT.querySelector(".select-employee");
            let employeeInput = p.ELEMENT.querySelector("input[name=employee]");
            let selectedEmployee;

            ListenToForm(form, function (data) {
                popup.Remove();

                TABLE_LISTENER.insertItem(beneficiaries.length + 1, [beneficiaries.length + 1, data.employee, data.type, data.name]);

                data['employee_id'] = selectedEmployee.employee_id;

                delete data['employee'];

                ALLBENEFICIARIES.push({...data, status: 'created'});

                update(ALLBENEFICIARIES);
            })

            employee.addEventListener("click", function() {
                SelectEmployee().then((employ) => {
                    selectedEmployee = employ;
                    employeeInput.value = employ.name;
                })
            });

            ManageComboBoxes();
        })
    }

    const _Del = (id) => {
        TABLE_LISTENER.removeItem(id);

        ALLBENEFICIARIES = ALLBENEFICIARIES.map((b) => {
            if (b.id === id) {
                if (b.status === 'created') {
                    return false;
                } else {
                    return  {...b, status: 'deleted'}
                }
            }
            return b;
        }).filter(b => b);

        update(ALLBENEFICIARIES);
    }

    const _Edit = (id) => {
        const popup = new Popup("mortuary/view_beneficiaries", {id}, {
            backgroundDismiss: false,
        });

        popup.Create().then(async (p) => {
            popup.Show();

            const form = p.ELEMENT.querySelector("form.form-control");
            let employee = p.ELEMENT.querySelector(".select-employee");
            let employeeInput = p.ELEMENT.querySelector("input[name=employee]");
            let selectedEmployee = await GetEmployee(employee.getAttribute("data-current"));

            ListenToForm(form, function (data) {
                popup.Remove();

                TABLE_LISTENER.updateItem(id, [id, data.employee, data.type, data.name]);
                //
                data['employee_id'] = selectedEmployee.employee_id;
                //
                delete data['employee'];

                ALLBENEFICIARIES = ALLBENEFICIARIES.map((b) => {
                    if (b.id === id) {
                        return {...data, id,  status: b.status === 'current' ? 'edited' : 'created'};
                    }

                    return b;
                });

                update(ALLBENEFICIARIES);

                // beneficiaries.push(data);
            })

            employee.addEventListener("click", function() {
                SelectEmployee().then((employ) => {
                    selectedEmployee = employ;
                    employeeInput.value = employ.name;
                })
            });

            ManageComboBoxes();
        })
    }

    const PlaceCurrents = () => {
        for (const el of TABLE_LISTENER.elements.items) {
            const id = el.getAttribute("data-id");

            ALLBENEFICIARIES.push({id, status: 'current'});
        }

        update(ALLBENEFICIARIES);
    }

    TABLE_LISTENER.addListeners({
        none: {
            remove: ["delete-request", "view-request", "edit-request"],
            view: ["add-request"],
        },
        select: {
            view: ["delete-request", "view-request", "edit-request"],
        },
        selects: {
            view: ["delete-request"],
            remove: ["view-request", "edit-request"]
        },
    });

    TABLE_LISTENER.init();

    TABLE_LISTENER.listen(() => {
        TABLE_LISTENER.addButtonListener([
            {
                name: "add-request",
                action: _Add,
                single: true
            },
            {
                name: "delete-request",
                action: _Del,
                single: true
            },
            {
                name: "edit-request",
                action: _Edit,
                single: true
            },
        ]);
    });

    PlaceCurrents();
}
function AddRequest() {
    const popup = new Popup("mortuary/add_new_mortuary", null, {
        backgroundDismiss: false,
    });

    popup.Create().then(((pop) => {
        popup.Show();

        const form = pop.ELEMENT.querySelector("form.form-control");
        const year = form.querySelector(".year");
        const period = form.querySelector(".period");
        let beneficiaries = [];

        const check = ListenToForm(form, function (data) {
            console.log(data, beneficiaries)

            AddRecord(TARGET, {data: JSON.stringify({data, beneficiaries})}).then((res) => {
                popup.Remove();

                NewNotification({
                    title: res.code === 200 ? 'Success' : 'Failed',
                    message: res.code === 200 ? 'Successfully Added' : 'Task Failed to perform!'
                }, 3000, res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR)

            })
        })

        ListenToCombo(year, function (_, y) {
            const periods = GetPeriodOfAYear(y);

            SetNewComboItems(period, periods);

            ListenToCombo(period, function () {
                check(true);
            })
        });

        ManageBeneficiariesTable(pop, beneficiaries, (up) => {
            beneficiaries = up;
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
                name: "add-request",
                action: AddRequest,
                single: true
            },
            {
                name: "view-request",
                action: ViewRequest,
                single: true
            },
            {
                name: "delete-request",
                action: DeleteRequests,
                single: false
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