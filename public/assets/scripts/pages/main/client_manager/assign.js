import {
    addAttr,
    addHtml, append, CreateElement,
    HideShowComponent,
    ListenToForm,
    MakeID,
    ManageComboBoxes, ResetActiveComponent, SetActiveComponent
} from "../../../modules/component/Tool.js";
import Popup from "../../../classes/components/Popup.js";
import {TableListener} from "../../../classes/components/TableListener.js";
import {
    AddRecord,  PostContainerRequest,
    RemoveRecords,
    UpdateRecords
} from "../../../modules/app/SystemFunctions.js";
import { SelectEmployee} from "../../../modules/app/Administrator.js";
import {NewNotification, NotificationType} from "../../../classes/components/NotificationPopup.js";

const TARGET = "employee_deployment";

let SELECTED_CLIENT = null;
function UpdateTable(TABLE_HTML) {
    const TABLE_BODY = document.querySelector(".main-table-body");

    addHtml(TABLE_BODY, TABLE_HTML);
    ManageTable();
}

function UpdateData() {
    return UpdateRecords("assign_employees").then((HTML) => UpdateTable(HTML));
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

function AddRequest(id) {
    const popup = new Popup("client_manager/assign_employee", {id: id}, {
        backgroundDismiss: false,
    });

    popup.Create().then(((pop) => {
        popup.Show();

        const form = pop.ELEMENT.querySelector("form.form-control");
        const selectEmployee = pop.ELEMENT.querySelector(".select-employee");
        const employeeInput = form.querySelector("input[name=employee]");
        let selectedEployee = null;

        selectEmployee.addEventListener("click", function() {
            SelectEmployee().then((employee) => {
                selectedEployee = employee;

                employeeInput.value = employee.name;
            })
        });
        
        ListenToForm(form, function (data) {
            data['employee_id'] = selectedEployee.employee_id;
            data['client_id'] = SELECTED_CLIENT;

            delete data['employee'];

            console.log(data);

            AddRecord(TARGET, {data: JSON.stringify(data)}).then((res) => {
                NewNotification({
                    title: res.code === 200 ? 'Success' : 'Failed',
                    message: res.code === 200 ? 'Successfully Deployed Employee' : 'Task Failed to perform!'
                }, 3000, res.code === 200 ? NotificationType.SUCCESS : NotificationType.ERROR)

                popup.Remove();

                UpdateData()
            })
        })

        
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
                action: () => {},
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


function ShowDeployedEmployeeOf(id) {
    PostContainerRequest(TARGET,"filter_deployment" ,{client_id: id}).then((res) => {
        UpdateTable(res);
    })
}

function ManageSelections() {
    const parent = document.querySelector(".selection-parent");
    const items = parent.querySelectorAll(".item-list");

    const resetItems = () => {
        ResetActiveComponent(items);
    }
    const selectItem = (item) => {
        const id = item.getAttribute("data-id");

        resetItems();

        SetActiveComponent(item, true);

        SELECTED_CLIENT = id;
    }

    for (const item of items) {
        item.addEventListener("click", function () {
            const id = item.getAttribute("data-id");

            selectItem(item);

            ShowDeployedEmployeeOf(id);
        })
    }

    if (items.length) {

        const first = items[0];

        selectItem(first);

    }

}

function Init() {
    ManageSelections();
    ManageTable();
}

document.addEventListener("DOMContentLoaded", Init);