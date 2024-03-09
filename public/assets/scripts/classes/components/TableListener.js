import {
    append, CreateCheckBox,
    CreateElement,
    HideShowComponent,
    RemoveAllListenerOf,
    ToggleComponentClass
} from "../../modules/component/Tool.js";

export class TableListener {
    constructor(parent) {
        this.parent = parent;
        this.elements = this.initElements(parent);
        this.listeners = {};
        this.conditions = [];
        this.buttons = [];
        this.selected = [];
        this.singularSelection = false;

    }

    initElements(parent) {
        return {
            header: parent.querySelector(".grid-table-header"),
            body: parent.querySelector(".grid-table-body"),
            checkbox: parent.querySelector(
                ".grid-table-header .custom-checkbox-parent input"
            ),
            items: parent.querySelectorAll(".grid-table-body .body-item"),
        };
    }

    addListeners(listeners = {}) {
        this.listeners = listeners;
    }

    addButtons(buttons = []) {
        this.buttons = buttons;
    }

    buttonExist(name) {
        for (const button of this.buttons) {
            if (button.name === name) {
                return button;
            }
        }

        return false;
    }

    init() {
        for (const obj of Object.values(this.listeners)) {
            for (const value of Object.values(obj)) {
                if (Array.isArray(value)) {
                    for (const val of value) {
                        if (!Array.isArray(val)) {
                            if (!this.buttonExist(val)) {
                                const button = this.parent.querySelector(
                                    `.table-button[data-name=${val}]`
                                );

                                if (button) {
                                    this.buttons.push({
                                        name: val,
                                        element: RemoveAllListenerOf(button),
                                    });
                                }
                            }
                        } else {
                            if (!this.buttonExist(val[0])) {
                                const button = this.parent.querySelector(
                                    `.table-button[data-name=${val[0]}]`
                                );

                                this.conditions.push(val);
                                this.buttons.push({
                                    name: val[0],
                                    element: RemoveAllListenerOf(button),
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    resetAllListenerItems() {
        for (const item of this.elements.items) {
            RemoveAllListenerOf(item);
        }
    }

    insertItem(id, values) {
        const tableBody = this.elements.body;
        const element = CreateElement({
            el: "TR",
            className: "body-item",
            attr: {
                "data-id": id
            },
            childs: [CreateElement({
                el: "TD",
                child: CreateCheckBox()
            }),...values.map((text) => CreateElement({
                el: "TD",
                text: text
            }))]
        });

        append(tableBody, element);

        this.addListenerToItem(element);

        this.elements = this.initElements(this.parent);


    }

    listen(callback) {
        const checkbox = this.elements.checkbox;

        // this.resetAllListenerItems();

        if (this.selected.length === 0) {
            this.executeListener("none");
        }

        for (const item of this.elements.items) {
            this.addListenerToItem(item);
        }

        checkbox.addEventListener("click", () => {
            if (checkbox.checked) {
                this.selectAll();
            } else {
                this.unselectAll();
            }
        });

        callback && callback();
    }

    addListenerToItem(item) {
        item.addEventListener("click", () => {
            const id = item.getAttribute("data-id");
            this.selectItem(id);
        });
    }

    selectAll() {
        for (const item of this.elements.items) {
            const id = item.getAttribute("data-id");

            if (!this.selected.includes(id)) {
                this.selectItem(id);
            }
        }
    }

    unselectAll() {
        for (const item of this.elements.items) {
            const id = item.getAttribute("data-id");

            if (this.selected.includes(id)) {
                this.selectItem(id);
            }
        }
    }

    executeListener(name, ...values) {
        if (this.listeners[name]) {
            const listener = this.listeners[name];

            if (listener.view && listener.view.length) {
                for (const btn of listener.view) {
                    if (Array.isArray(btn)) {
                        if (this.compareValue(this.selected, btn[1][0], btn[1][1])) {
                            this.viewButton(btn[0])
                        } else {
                            this.removeButton(btn[0]);
                        }
                    } else {
                        this.viewButton(btn);
                    }
                }
            }

            if (listener.remove && listener.remove.length) {
                for (const btn of listener.remove) {
                    this.removeButton(btn);
                }
            }
        }
    }

    resetButtons() {
        for (const btn of this.buttons) {
            this.removeButton(btn.name);
        }
    }

    viewButton(name) {
        for (const button of this.buttons) {
            if (button.name === name) {
                HideShowComponent(button.element, true);
            }
        }
    }

    removeButton(name) {
        for (const button of this.buttons) {
            if (button.name === name) {
                HideShowComponent(button.element, false);
            }
        }
    }

    selectItem(id) {
        for (const item of this.elements.items) {
            if (item.getAttribute("data-id") === id) {
                const selected = this.selected.includes(id);
                const checkbox = item.querySelector("input");

                ToggleComponentClass(item, "selected", !selected);

                checkbox.checked = !selected;

                if (selected) {
                    this.selected = this.selected.filter((i) => i !== id);
                } else {
                    this.selected.push(id);
                }

                this.update();
            } else if (this.singularSelection) {
                const checkbox = item.querySelector("input");

                ToggleComponentClass(item, "selected", false);

                if (checkbox) {
                    checkbox.checked = false;
                }

                this.selected = this.selected.filter((i) => i !== item.getAttribute("data-id"));

                this.update();
            }
        }
    }

    update() {
        if (this.selected.length === 0) {
            this.executeListener("none");
        } else if (this.selected.length === 1) {
            this.executeListener("select", this.selected[0]);
        } else {
            this.executeListener("selects", this.selected);
        }

        this.elements.checkbox.checked =
            this.selected.length === this.elements.items.length;
    }

    updateContent() {
        this.elements = this.initElements(this.parent);
        this.listen();
    }

    addButtonListener(listeners) {
        for (const listener of listeners) {
            const button = this.buttonExist(listener.name);

            if (button) {
                button.element.addEventListener("click", () => {
                    if (listener.action) {
                        listener.action(listener.single ? this.selected[0] : this.selected);
                    }
                });
            }
        }
    }

    compareValue(selected, colTarget, colCompare) {
        for (const sel of selected) {
            const rowID = this.getRowIDOfValue(sel);
            const targetValue =  this.getValue(rowID, colTarget);
            const texts = colCompare.split("|");

            if (texts.includes(targetValue)) {
                return true;
            }
        }

        return false;
    }

    getValue(row, column) {
        const rows = this.elements.items;

        if (rows.length) {
            if (rows[row]) {
                const columns = rows[row].querySelectorAll("td");
                return columns[column].textContent;
            }
        }

        return null;
    }

    getRowIDOfValue(sel) {
        let index = 0;
        for (const item of this.elements.items) {
            if (item.getAttribute("data-id") === sel) {
                return index;
            }
            index++;
        }

        return -1;
    }

    removeItem(id) {
        for (const item of this.elements.items) {
            if (item.getAttribute("data-id") === id) {
                item.remove();
            }
        }
    }

    updateItem(id, values) {
        for (const item of this.elements.items) {
            if (item.getAttribute("data-id") === id) {
                const tds = item.querySelectorAll("td");

                for (let i = 1; i < tds.length; i++) {
                    tds[i].innerText = values[i - 1];
                }
            }
        }
    }
}