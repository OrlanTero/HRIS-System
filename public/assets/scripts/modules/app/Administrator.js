import {AddRecord, EditRecord} from "./SystemFunctions.js";
import Popup from "../../classes/components/Popup.js";
import {Ajax, ListenToForm, ManageComboBoxes} from "../component/Tool.js";
import {TableListener} from "../../classes/components/TableListener.js";

export function CreateNewEmployee(employee, bank) {
    return new Promise((resolve) => {
        AddRecord("employees", {data: JSON.stringify({employee: employee, bank: bank})}).then((data) => {
            resolve(data);
        })
    })
}

export function UpdateEmployee(employee, bank) {
    return new Promise((resolve) => {
        EditRecord("employees", {data: JSON.stringify({employee: employee, bank: bank})}).then((data) => {
            resolve(data);
        })
    })
}



export function AddNewBankAccount() {
    const popup = new Popup("employees/add_new_bank_account", null, {
        backgroundDismiss: false,
    });

    return new Promise((resolve) => {
        popup.Create().then((pop) => {
            popup.Show();

            const form = pop.ELEMENT.querySelector("form.form-control");

            ListenToForm(form, function (data) {
                resolve(data);
                popup.Remove();
            });

            ManageComboBoxes();
        })
    })
}

export function ViewBankAccount(bank) {
    const popup = new Popup("employees/view_bank_account", {bank}, {
        backgroundDismiss: false,
    });

    return new Promise((resolve, reject) => {
        popup.Create().then((pop) => {
            popup.Show();

            const form = pop.ELEMENT.querySelector("form.form-control");
            const deleteBank = form.querySelector(".delete-form");

            ListenToForm(form, function (data) {
                resolve(data);

                popup.Remove();
            });

            deleteBank.addEventListener("click", function() {
                popup.Remove();

                reject();
            })


            ManageComboBoxes();
        })
    })
}

export function GetEmployee(id) {
    return new Promise((resolve) => {
        Ajax({
            url: "/api/post/GetEmployee",
            type: "POST",
            data: {id},
            success: (res) => {
                try {
                    resolve(JSON.parse(res));
                } catch (e) {
                    resolve(null);
                }
            }
        })
    })
}

export function GetClient(id) {
    return new Promise((resolve) => {
        Ajax({
            url: "/api/post/GetClient",
            type: "POST",
            data: {id},
            success: (res) => {
                try {
                    resolve(JSON.parse(res));
                } catch (e) {
                    resolve(null);
                }
            }
        })
    })
}


export function SelectEmployee() {
    const popup = new Popup("employees/select_employee", null, {
        backgroundDismiss: false,
    });

    return new Promise((resolve) => {
        const SelectRequest = (id) => {
            GetEmployee(id).then((employee) => resolve(employee)).finally(() => {
                popup.Remove();
            });
        }

        popup.Create().then((pop) => {
            popup.Show();

            const TABLE = pop.ELEMENT.querySelector(".main-table-container.items-component");

            if (!TABLE) return;

            const TABLE_LISTENER = new TableListener(TABLE);

            TABLE_LISTENER.singularSelection = true;

            TABLE_LISTENER.addListeners({
                none: {
                    view: [],
                    remove: ["select-request"],
                },
                select: {
                    view: ["select-request"],
                },
                selects: {
                    view: [],
                    remove:  ["select-request"],
                },
            })

            TABLE_LISTENER.init();

            TABLE_LISTENER.listen(() => {
                TABLE_LISTENER.addButtonListener([
                    {
                        name: "select-request",
                        action: SelectRequest,
                        single: true
                    },
                ]);
            });

        })
    })
}

export function SelectClient() {
    const popup = new Popup("clients/select_client", null, {
        backgroundDismiss: false,
    });

    return new Promise((resolve) => {
        const SelectRequest = (id) => {
            GetClient(id).then((client) => resolve(client)).finally(() => {
                popup.Remove();
            });
        }

        popup.Create().then((pop) => {
            popup.Show();

            const TABLE = pop.ELEMENT.querySelector(".main-table-container.items-component");

            if (!TABLE) return;

            const TABLE_LISTENER = new TableListener(TABLE);

            TABLE_LISTENER.singularSelection = true;

            TABLE_LISTENER.addListeners({
                none: {
                    view: [],
                    remove: ["select-request"],
                },
                select: {
                    view: ["select-request"],
                },
                selects: {
                    view: [],
                    remove:  ["select-request"],
                },
            })

            TABLE_LISTENER.init();

            TABLE_LISTENER.listen(() => {
                TABLE_LISTENER.addButtonListener([
                    {
                        name: "select-request",
                        action: SelectRequest,
                        single: true
                    },
                ]);
            });

        })
    })
}

