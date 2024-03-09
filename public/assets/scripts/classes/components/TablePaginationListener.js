import {
    Ajax,
    HideShowComponent,
    RemoveAllListenerOf,
    ToData,
    ToggleComponentClass,
    addHtml,
} from "../../modules/component/Tool.js";

export class TablePaginationListener {
    constructor(parent) {
        this.reconstruct(parent);
    }

    reconstruct(parent) {
        this.parent = parent;
        this.elements = this.initElements(parent);
        this.listeners = {};
        this.buttonListeners = [];
        this.conditions = [];
        this.buttons = [];
        this.selected = [];
        this.paginationOption = {};
        this.paginationEnable = false;
    }

    initElements(parent) {
        return {
            grid: parent.querySelector(".custom-grid-table"),
            table: parent.querySelector(".main-table-body"),
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

    listen(callback) {
        const checkbox = this.elements.checkbox;

        if (this.selected.length === 0) {
            this.executeListener("none");
        }

        for (const item of this.elements.items) {
            const isActive = item.getAttribute("data-default-select");
            const id = item.getAttribute("data-id");

            item.addEventListener("click", () => {
                this.selectItem(id);
            });

            if (isActive == "true") {
                this.selectItem(id);
            }
        }

        if (checkbox) {
            checkbox.addEventListener("click", () => {
                if (checkbox.checked) {
                    this.selectAll();
                } else {
                    this.unselectAll();
                }
            });
        }

        callback && callback();
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
                            this.viewButton(btn[0]);
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
        this.buttonListeners = listeners;
        for (const listener of listeners) {
            const button = this.buttonExist(listener.name);

            if (button && button.element) {
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
            const targetValue = this.getValue(rowID, colTarget);
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
            if (item.getAttribute("data-id") == sel) {
                return index;
            }
            index++;
        }

        return -1;
    }

    setUpPagination(updateURL, currentIndex = 0, limit) {
        this.paginationOption = {
            updateURL,
            currentIndex,
            limit,
            max: 0
        };

        const runPaginationListener = () => {
            const grid = this.elements.grid;
            const container = grid.querySelector(".pagination-container");
            const nextBtn = container.querySelector(".pagination-button.next");
            const prevBtn = container.querySelector(".pagination-button.prev");
            const pageBtns = container.querySelectorAll(
                ".pagination-button.page-btn"
            );

            const maxBtn = pageBtns[pageBtns.length - 1];
            const max = maxBtn ? parseInt(maxBtn.getAttribute("data-page")) : 0;

            this.paginationOption.max = max;

            nextBtn.addEventListener("click", this.next.bind(this));

            prevBtn.addEventListener("click", this.prev.bind(this));

            for (const pageBtn of pageBtns) {
                pageBtn.addEventListener("click", () => {
                    this.goTo(parseInt(pageBtn.getAttribute("data-page")));
                });
            }
        };

        runPaginationListener();
    }

    next() {
        if (this.paginationOption.currentIndex + 1 <= this.paginationOption.max) {
            this.paginationOption.currentIndex++;

            return this.updatePagination(this.paginationOption);
        }
    }

    prev() {
        if (this.paginationOption.currentIndex - 1 >=  0) {
            this.paginationOption.currentIndex--;

            return this.updatePagination(this.paginationOption);
        }
    }

    goTo(index) {
        this.paginationOption.currentIndex = index;

        return this.updatePagination(this.paginationOption);
    }

    updatePagination(option) {
        const update = new Promise((resolve, reject) => {
            Ajax({
                url: option.updateURL,
                type: "POST",
                data: ToData(option),
                success: resolve,
            });
        });

        update.then((html) => this.updateTable(html));
    }

    updateTable(html) {
        const table = this.elements.table;

        const paginationOption = this.paginationOption;

        addHtml(table, html);

        this.reconstruct(this.parent);

        this.addListeners(this.listeners);

        this.setUpPagination(
            paginationOption.updateURL,
            paginationOption.currentIndex,
            paginationOption.limit
        );

        this.init();

        this.listen(() => {
            this.addButtonListener(this.buttonListeners);
        });
    }
}
