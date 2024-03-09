import {
    Ajax,
    append, CreateCheckBox,
    CreateElement,
    HideShowComponent,
    RemoveAllListenerOf, ResetActiveComponent, SetActiveComponent, SetEndOfContenteditable,
    ToggleComponentClass
} from "../../modules/component/Tool.js";
import {AddRecord} from "../../modules/app/SystemFunctions.js";

export const ItemValueStatus = {
    FIXED: 111,
    ADDED: 222,
    CHANGED: 333
}

export const SelectType = {
    SINGLE: 111,
    MULTIPLE_NOT_GRID: 222,
    MULTIPLE_GRID: 333
}

export default class AttendanceTableListener {
    constructor(parent) {
        this.parent = parent;
        this.ids = {
            employee_id: parent.getAttribute("data-employee-id"),
            attendance_group_id: parent.getAttribute("data-attendance-id"),
        };

        this.elements = this.initElements(parent);
        this.listeners = {};
        this.conditions = [];
        this.buttons = [];
        this.selected = [];
        this.values = {
            after: this.getCurrentValues(),
            before: []
        }

        this.listenerEvent = {
            event: null,
            item: null
        };

        this.compute()
    }

    initElements(parent) {
        return {
            header: parent.querySelector("thead.header"),
            body: parent.querySelector("tbody.body"),
            theMostTotal: parent.querySelector(".the-most-total"),
            allItems: parent.querySelectorAll(".day-item-td"),
            items: [...parent.querySelectorAll("tbody.body .type-item.attendance")].map((item) => {
                return {
                    type: item.getAttribute("data-type"),
                    row: item,
                    items: item.querySelectorAll(".day-item-td"),
                    total: item.querySelector(".day-total"),
                    totalText: item.querySelector(".day-total .text"),
                    allTotal: item.querySelectorAll(".all-total"),
                }
            }),
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
        // for (const obj of Object.values(this.listeners)) {
        //     for (const value of Object.values(obj)) {
        //         if (Array.isArray(value)) {
        //             for (const val of value) {
        //                 if (!Array.isArray(val)) {
        //                     if (!this.buttonExist(val)) {
        //                         const button = this.parent.querySelector(
        //                             `.table-button[data-name=${val}]`
        //                         );
        //
        //                         if (button) {
        //                             this.buttons.push({
        //                                 name: val,
        //                                 element: RemoveAllListenerOf(button),
        //                             });
        //                         }
        //                     }
        //                 } else {
        //                     if (!this.buttonExist(val[0])) {
        //                         const button = this.parent.querySelector(
        //                             `.table-button[data-name=${val[0]}]`
        //                         );
        //
        //                         this.conditions.push(val);
        //                         this.buttons.push({
        //                             name: val[0],
        //                             element: RemoveAllListenerOf(button),
        //                         });
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    resetAllListenerItems() {
        for (const item of this.elements.items) {
            RemoveAllListenerOf(item);
        }
    }

    insertItem(id, values) {

    }

    listen(callback) {
        const checkbox = this.elements.checkbox;

        if (this.selected.length === 0) {
            this.executeListener("none");
        }

        for (const row of this.elements.items) {
            for (const item of row.items) {
                this.addListenerToItem(item);
            }
        }

        callback && callback();
    }

    addListenerToItem(item) {
        const main = this;

        if (this.listenerEvent.event !== null) {
            this.listenerEvent.item.removeEventListener("input", this.listenerEvent.event);
        }

        item.addEventListener("click", (e) => {
            const text = item.querySelector(".text");
            const type = item.getAttribute("data-type");
            const day = item.getAttribute("data-day");

            const fn = function() {

                if(parseInt(text.innerText) < 0 || parseInt(text.innerText) > 24) {
                    text.innerText = 0;
                }

                text.setAttribute("contenteditable", ""  + false);

                text.removeEventListener("blur", fn);

                main.computeTotal(type);

                main.saveChanges();
            };

            function mainEvent() {
                main.computeTotal(type);

                main.setTextFromSelection(text.innerText);

                text.focus();

                SetEndOfContenteditable(text);
            }

            text.addEventListener("keypress", function(e) {
                if (isNaN(String.fromCharCode(e.which))) e.preventDefault();
            })

            text.addEventListener("blur", fn);

            text.addEventListener("input", mainEvent);

            main.listenerEvent = { item, event: mainEvent }

            main.selectItem(day, type, e.shiftKey && !e.ctrlKey ? SelectType.MULTIPLE_GRID : e.ctrlKey && !e.shiftKey ? SelectType.MULTIPLE_NOT_GRID : SelectType.SINGLE)
        });
    }

    computeTotal(type) {
        const row = this.getRowByType(type);
        const all = [...row.items].map((item) => parseInt(item.querySelector(".text").innerText)).filter((a) => a > 0);
        const total = all.length > 0 ? all.reduce((a,b) => a + b) : 0;

        row.totalText.innerText = total;

        this.computeAllTotal();
    }

    computeAllTotal() {
        const sums = this.elements.items.map((item) => {
            const cal = [...item.items].map((iii) => parseInt(iii.querySelector(".text").innerText)).filter((a) => a && a > 0);

            return cal.length > 0 ? cal.reduce((a,b) => a + b) : 0;
        }).reduce((a, b) => a + b);

        this.elements.theMostTotal.querySelector(".text").innerText = sums;
    }

    getRowByType(type) {
        return this.elements.items.filter((row) => row.type === type)[0] ?? null;
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

    selectItem(day, type, selectType) {
        for (const ii of this.elements.items) {
            for (const iii of ii.items) {
                const text = iii.querySelector(".text");

                const _type = iii.getAttribute("data-type");
                const _day = iii.getAttribute("data-day");

                if (_type === type && _day === day) {
                    text.setAttribute("contenteditable", ""  + true);

                    text.focus();

                    SetEndOfContenteditable(text);

                    // ToggleComponentClass(iii, 'active', !isActive);

                    if (selectType === SelectType.SINGLE) {
                        this.selected = [{day, type}];
                    } else if (selectType === SelectType.MULTIPLE_GRID && this.selected.length) {
                        const first = this.selected[0];

                        this.selectFromTo(first, {day, type});

                    } else if (selectType === SelectType.MULTIPLE_NOT_GRID) {
                        if (this.alreadySelected({day, type})) {
                            this.unselect({day, type})
                        } else {
                            this.selected.push({day, type})
                        }
                    }
                }
            }
        }

        this.updateUI()
    }

    selectFromTo(from, to) {
        const grid = this.elements.items.map((item) => item.items);
        const fromIndex = this.itemToIndex(from);
        const toIndex = this.itemToIndex(to);

        const all_selected = [];

        for (let y = fromIndex.y; y <= toIndex.y; y++) {
           for (let x = fromIndex.x; x <= toIndex.x; x++) {
               const item = grid[y][x];

               const type = item.getAttribute("data-type");
               const day = item.getAttribute("data-day");

               all_selected.push({type, day});
           }
        }

        this.selected = all_selected;
    }

    itemToIndex({type, day}) {
        const grid = this.elements.items.map((item) => item.items);

        let y = 0, x = 0;

        for (const items of grid) {
            x = 0;
            for (const item of items) {
                const _type = item.getAttribute("data-type");
                const _day = item.getAttribute("data-day");

                if (type === _type && day === _day) {
                    return {y, x};
                }

                x++;
            }
            y++;
        }

    }

    updateUI() {
        ResetActiveComponent(this.elements.allItems);

        for (const item of this.selected) {
            const el = this.getItemOf(item.type, item.day);

            SetActiveComponent(el,  true);
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

    updateItem(id, values) {

    }

    getItemOf(type, day) {
        for (const item of this.elements.allItems) {
            const _day = item.getAttribute("data-day");
            const _type = item.getAttribute("data-type");

            if (_type === type && day === _day) {
                return item;
            }
        }

        return null;
    }

    getValueOf(type, day) {
        for (const item of this.elements.items) {
            for (const iii of item.items) {
                const val = parseInt(iii.querySelector(".text").innerText);
                const _day = iii.getAttribute("data-day");

                if (iii.type === type && day === _day) {
                    return val;
                }
            }
        }

        return null;
    }

    getBeforeValueOf(type, day) {
        if (!this.values ) {
            return null;
        }
        if ( !this.values.before.length) {
            return null;
        }
    }

    getCurrentValues() {
        const main = this;
        return this.elements.items.map((item) => {
            return {
                type: item.type,
                items: [...item.items].map((iii) => {
                    const day = iii.getAttribute("data-day");
                    const val = parseInt(iii.querySelector(".text").innerText);
                    const beforeVal = main.getBeforeValueOf(item.type, day);
                    const id = iii.getAttribute("data-id");
                    const status = (!beforeVal && isNaN(val)) ? ItemValueStatus.FIXED : (!beforeVal && !isNaN(val)) ? ItemValueStatus.ADDED : (beforeVal === val ? ItemValueStatus.FIXED : ItemValueStatus.CHANGED);

                    return {
                        value: isNaN(val) ? null : val,
                        status: status,
                        db_value: {
                            attendance_group_id: main.ids.attendance_group_id,
                            employee_id: main.ids.employee_id,
                            type: item.type,
                            hours: isNaN(val) ? null : val,
                            day,
                            status,
                            id
                        }
                    }
                })
            }
        });
    }

    getChanges() {
        return this.values.after.map((item) => {
            return item.items.filter((iii) => iii.value !== null || iii.status !== ItemValueStatus.FIXED).map((ii) => ii.db_value)
        }).flat(1);
    }

    saveChanges() {
        this.values.after = this.getCurrentValues();
    }

    saveToDatabase() {
        return new Promise((resolve, reject) => {
            const changes = this.getChanges();

            if (changes.length) {
                AddRecord("attendance_items", {data: JSON.stringify(changes)}).then((res) => {
                    if (res.code === 200) {
                        resolve(res.message);
                    } else {
                        reject(res.message);
                    }
                })
            } else {
                reject("Nothing changed!")
            }
        })
    }

    compute() {
        for (const item of this.elements.items) {
            this.computeTotal(item.type);
        }
    }

    setTextFromSelection(text) {
        for (const item of this.selected) {
           try {
               const el = this.getItemOf(item.type, item.day);

               el.querySelector(".text").innerText = text;
           } catch (e) {
               
           }
        }

        this.compute();
    }

    alreadySelected({type, day}) {
        for (const item of this.selected) {
            if (item.type === type && item.day === day) {
                return true;
            }
        }

        return false;
    }

    unselect({type, day}) {
        this.selected = this.selected.filter((item) => !(item.type === type && item.day === day));
    }
}