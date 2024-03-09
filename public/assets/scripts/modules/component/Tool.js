export function Ajax({
                         type,
                         url,
                         success,
                         error,
                         progress,
                         data,
                         formData,
                         serialized,
                     }) {
    let request = new XMLHttpRequest();
    let form = new FormData();

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                success && success(request.responseText);
            } else if (request.status === 400) {
                error && error("There was an error 400");
            } else {
                error && error("something else other than 200 was returned");
            }
        }
    };

    if (progress) {
        request.onprogress = progress;
    }

    if (data) {
        Object.entries(data).forEach((pair) => form.append(pair[0], pair[1]));
    }

    request.open(type, url, true);
    request.send(serialized || (data ? form : false) || formData);
}

export function ManageShowHideContainer(ClickClassName) {
    const SHControllers = document.querySelectorAll(
        ".show-hide-container-controller"
    );

    for (const SH of SHControllers) {
        const el = SH.querySelector("." + ClickClassName) ?? SH;

        FNOnClickOutside(SH, () => {
            SH.classList.remove("active");
            SH.classList.remove("show");
        });

        el.addEventListener("click", () => {
            if (SH.classList.contains("show")) {
                SH.classList.remove("active");
                SH.classList.remove("show");
            } else {
                SH.classList.add("active");
                SH.classList.add("show");
            }
        });
    }
}

export function ListenToSelectionTab(TAB, listeners = {}) {
    if (!TAB) return false;

    const LINKS = TAB.querySelectorAll(".selection-tab-link-container");
    const CONTENTS = TAB.querySelectorAll(".selection-tab-content-container");

    const findLinkContent = (link) => {
        for (const content of CONTENTS) {
            const tab = content.getAttribute("data-tab");
            const linkref = link.getAttribute("data-tab-link-for");

            if (tab === linkref) {
                return content;
            }
        }

        return null;
    };

    const viewLink = (link, bool) => {
        const content = findLinkContent(link);

        ToggleComponentClass(link, "active", bool);

        if (!content) return;

        HideShowComponent(content, bool);

        ExecuteFn(listeners, "onTab", link, content);
    };

    const reset = () => {
        for (const link of LINKS) {
            viewLink(link, false);
        }
    };

    const addListener = () => {
        for (const link of LINKS) {
            link.addEventListener("click", () => {
                reset();
                viewLink(link, true);
            });
        }
    };


    addListener();
    reset();
    viewLink(LINKS[0], true);
    ExecuteFn(listeners, "onReady");
}

export function ResetActiveComponent(components) {
    for (const component of components) {
        SetActiveComponent(component, false);
    }
}

export function SetActiveComponent(component, bool) {
    if (component) {
        if (bool) {
            component.classList.add("active");
        } else {
            component.classList.remove("active");
        }
    }
}

export function ComponentsClickSetActive(components, callback) {
    for (const component of components) {
        component.addEventListener("click", () => {
            ResetActiveComponent(components);
            ResetIconSwitchComponent(components);
            SetActiveComponent(component, true);
            IconSwitchComponent(component, true);

            if (callback) {
                const parent = component.parentNode;
                callback(component, Array.from(parent.children).indexOf(component));
            }
        });
    }
}

export function ResetIconSwitchComponent(items) {
    for (const item of items) {
        IconSwitchComponent(item, false);
    }
}

export function IconSwitchComponent(item, bool) {
    const def = item.querySelector(".icon-default");
    const rep = item.querySelector(".icon-replace");

    if (def && rep) {
        HideShowComponent(def, !bool);
        HideShowComponent(rep, bool);
    }
}

export function ManageIconSwitchOnActive() {
    const iconSwitchActives = document.querySelectorAll(
        ".items-icon-switch-active"
    );

    for (const ISA of iconSwitchActives) {
        const items = ISA.querySelectorAll(".icon-switch-item");

        const reset = () => {
            for (const item of items) {
                IconSwitchComponent(item, false);
                SetActiveComponent(item, false);
            }
        };

        for (const item of items) {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                reset();
                IconSwitchComponent(item, true);
                SetActiveComponent(item, true);
            });
        }
    }
}



export function FNOnClickOutside(element, callback, except, excallback) {
    const outSideExcepts = (target) => {
        if (Array.isArray(except)) {
            for (const ex of except) {
                if (!ex.contains(target)) {
                    return true;
                }
            }
        } else return except ? !except.contains(target) : true;
    }

    const listener = (e) => {
        const outsideExcept = outSideExcepts(e.target);

        if (!element.contains(e.target)) {
            if (outsideExcept) {
                callback && callback();
            } else {
                excallback && excallback();
            }
        }
    };

    window.addEventListener("click", listener);

    return listener;
}

export function FileToJson(fileObject) {
    fileObject.toJSON = function () {
        return {
            lastModified: fileObject.lastModified,
            lastModifiedDate: fileObject.lastModifiedDate,
            name: fileObject.name,
            size: fileObject.size,
            type: fileObject.type,
        };
    };

    return JSON.stringify(fileObject);
}

export function Serialize(mixed_value) {
    var val,
        key,
        okey,
        ktype = "",
        vals = "",
        count = 0,
        _utf8Size = function (str) {
            var size = 0,
                i = 0,
                l = str.length,
                code = "";
            for (i = 0; i < l; i++) {
                code = str.charCodeAt(i);
                if (code < 0x0080) {
                    size += 1;
                } else if (code < 0x0800) {
                    size += 2;
                } else {
                    size += 3;
                }
            }
            return size;
        },
        _getType = function (inp) {
            var match,
                key,
                cons,
                types,
                type = typeof inp;

            if (type === "object" && !inp) {
                return "null";
            }

            if (type === "object") {
                if (!inp.constructor) {
                    return "object";
                }
                cons = inp.constructor.toString();
                match = cons.match(/(\w+)\(/);
                if (match) {
                    cons = match[1].toLowerCase();
                }
                types = ["boolean", "number", "string", "array"];
                for (key in types) {
                    if (cons == types[key]) {
                        type = types[key];
                        break;
                    }
                }
            }
            return type;
        },
        type = _getType(mixed_value);

    switch (type) {
        case "function":
            val = "";
            break;
        case "boolean":
            val = "b:" + (mixed_value ? "1" : "0");
            break;
        case "number":
            val =
                (Math.round(mixed_value) == mixed_value ? "i" : "d") +
                ":" +
                mixed_value;
            break;
        case "string":
            val = "s:" + _utf8Size(mixed_value) + ':"' + mixed_value + '"';
            break;
        case "array":
        case "object":
            val = "a";
            for (key in mixed_value) {
                if (mixed_value.hasOwnProperty(key)) {
                    ktype = _getType(mixed_value[key]);
                    if (ktype === "function") {
                        continue;
                    }

                    okey = key.match(/^[0-9]+$/) ? parseInt(key, 10) : key;
                    vals += Serialize(okey) + Serialize(mixed_value[key]);
                    count++;
                }
            }
            val += ":" + count + ":{" + vals + "}";
            break;
        case "undefined":
        // Fall-through
        default:
            // if the JS object has a property which contains a null value, the string cannot be unserialized by PHP
            val = "N";
            break;
    }
    if (type !== "object" && type !== "array") {
        val += ";";
    }
    return val;
}

export function CombineFormData(formdata1, formdata2) {
    for (const pair of formdata2.entries()) {
        formdata1.append(pair[0], pair[1]);
    }

    return formdata1;
}

export function ToData(obj) {
    const data = new FormData();

    for (const pair of Object.entries(obj)) {
        data.append(pair[0], pair[1]);
    }

    return Object.fromEntries(data);
}

export function addClass(element, className) {
    if (!element || !className) return;

    if (Array.isArray(className)) {
        for (const cn of className) {
            element.classList.add(cn);
        }
    } else {
        element.classList.add(className);
    }
}

export function removeClass(element, className) {
    if (!element || !className) return;

    element.classList.remove(className);
}


export function addAttr(element, attr, value) {
    if (!element || !attr || !value) return;

    element.setAttribute(attr, value);
}

export function append(element, toAppend) {
    if (!element || !toAppend) return;

    if (Array.isArray(toAppend)) {
        for (const a of toAppend) {
            element.appendChild(a);
        }
    } else {
        element.appendChild(toAppend);
    }
}

export function prepend(element, toAppend) {
    if (!element || !toAppend) return;

    if (Array.isArray(toAppend)) {
        for (const a of toAppend) {
            element.prepend(a);
        }
    } else {
        element.prepend(toAppend);
    }
}

export function addListener(element, listener, callback) {
    if (!element || !listener || !callback) return;

    element.addEventListener(listener, callback);
}

export function addText(element, text) {
    if (!element || !text) return;

    element.textContent = text;
}

export function addHtml(element, html) {
    if (!element || html === undefined) return;

    element.innerHTML = html;
}

export function addHypenOnUpper(str) {
    let strfinal = "";

    for (const letter of str) {
        if (letter === letter.toUpperCase()) {
            strfinal += "-" + letter.toLowerCase();
        } else {
            strfinal += letter;
        }
    }

    return strfinal;
}

export function GetClientRect(element) {

}

export function ObjToStyle(obj) {
    return Object.entries(obj)
        .map((style) => {
            return `${addHypenOnUpper(style[0])}:${style[1]}`;
        })
        .join(";")
        .toString();
}

export function addStyles(element, styles = {}) {
    if (!element) return;
    addAttr(element, "style", ObjToStyle(styles));
}

export function CreateElement(element) {
    const {el, className, id, listener, attr} = element;
    const {classes, child, childs, text, html, styles} = element;
    const elem = document.createElement(el ?? "DIV");

    addClass(elem, className);
    addAttr(elem, "id", id);
    append(elem, child);
    addText(elem, text);
    addHtml(elem, html);
    addStyles(elem, styles);

    listener &&
    Object.entries(listener).forEach((pair) => {
        addListener(elem, pair[0], pair[1]);
    });

    attr &&
    Object.entries(attr).forEach((pair) => {
        addAttr(elem, pair[0], pair[1]);
    });

    classes && classes.length && classes.forEach((c) => addClass(elem, c));
    childs && childs.length && childs.forEach((c) => append(elem, c));

    return elem;
}

export function randomDigit() {
    return Math.floor(Math.random() * Math.floor(2));
}

export function generateRandomBinary(binaryLength) {
    let binary = "0b";
    for (let i = 0; i < binaryLength; ++i) {
        binary += randomDigit();
    }
    return binary;
}

export function MakeID(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return [...new Array(length)].map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join("").toString();
}

export function ArrPairToObj(arrays) {
    const obj = {};

    for (const pair of arrays) {
        obj[pair[0]] = pair[1];
    }

    return obj;
}

export function VerifyFormData(formData, except = []) {
    let status = true;
    let empty = [];

    for (const pair of formData.entries()) {
        if (!except.includes(pair[0])) {
            if (typeof pair[1] == "object") {
                if (!pair[1].size) {
                    status = false;
                    empty.push(pair[0]);
                }
            } else {
                if (pair[1].length === 0) {
                    status = false;
                    empty.push(pair[0]);
                }
            }
        }
    }

    return {status, empty};
}

export function FindParent(el, cn) {
    let parent = el.parentNode;

    while (parent) {
        if (parent.classList) {
            if (parent.classList.contains(cn)) {
                break;
            }
        }
        parent = parent.parentNode;
    }

    return parent;
}

export const ApplySuccess = (input, success) => {
    if (!input) return;

    const parent = FindParent(input, "error-container");

    if (parent) {
        parent.classList.remove("input-error");

        if (success) {
            parent.classList.add("input-success");
        } else {
            parent.classList.remove("input-success");
        }
    }
};
export const ApplyError = (inputErr, INPUTS, remove = false) => {
    if (!INPUTS) return;

    const addInputListener = (parent, input) => {
        const listener = function () {
            if (input.value.length > 0) {
                parent.classList.remove("input-error");
                input.removeEventListener("change", listener);
            }
        }

        input.addEventListener("change", listener)
    }

    if (!IsNodeList(INPUTS)) {
        const textareas = INPUTS.querySelectorAll("textarea");
        INPUTS = INPUTS.querySelectorAll("input");

        if (!IsNodeList(INPUTS)) {
            return;
        }

        for (const textarea of textareas) {
            INPUTS = [...textareas, ...INPUTS];
        }
    }

    for (const input of INPUTS) {
        if (input.getAttribute("type") !== "submit") {
            const parent = FindParent(input, "error-container");

            if (parent) {
                if (!remove) {
                    if (inputErr.includes(input.getAttribute("name"))) {
                        parent.classList.add("input-error");

                        addInputListener(parent, input)
                    } else {
                        parent.classList.remove("input-error");
                    }
                } else {
                    parent.classList.remove("input-error");
                }
            }
        }
    }
};

export function IsNodeList(nodes) {
    var stringRepr = Object.prototype.toString.call(nodes);

    return (
        typeof nodes === "object" &&
        /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
        typeof nodes.length === "number" &&
        (nodes.length === 0 ||
            (typeof nodes[0] === "object" && nodes[0].nodeType > 0))
    );
}

export function GetComboValue(combo) {
    const input = combo.querySelector("input");
    return {value: input.getAttribute("data-value"), text: input.value};
}

export function SetNewComboItems(combo, items) {
    if (!combo) return;

    ResetListenerOfCombo(combo);

    const floatingcon = combo.querySelector(".floating-container");

    floatingcon.innerHTML = "";

    for (const item of items) {
        if (typeof item == "string") {
            AddNewComboItem(combo, item, item);
        } else {
            AddNewComboItem(combo, item.value, item.text);
        }
    }

    ListenToThisCombo(combo);
}

export function AddNewComboItem(combo, value, text) {
    if (!combo) return;

    const floatingcon = combo.querySelector(".floating-container");

    const element = CreateElement({
        el: "DIV",
        className:"item",
        attr: { value: value },
        child: CreateElement({
            el: "SPAN",
            text: text
        })
    });

    append(floatingcon, element);
}

export function SetComboValue(combo, text, value) {
    const input = combo.querySelector("input");

    input.value = text;

    input.setAttribute("data-value", value);
}

export function HideItemsInCombo(combo, toHide) {
    const floating = combo.querySelector(".floating-container");
    const items = floating.querySelectorAll(".item");

    for (const item of items) {
        if (toHide.includes(item.textContent)) {
            item.style.display = "none";
        } else {
            item.style.display = "flex";
        }
    }
}

export function ManageComboBoxes() {
    const CUSTOMCOMBOBOXS = document.querySelectorAll(".custom-combo-box");
    for (const combo of CUSTOMCOMBOBOXS) {
        ListenToThisCombo(combo);
    }
}

function ResetListenerOfCombo(combo) {
    const main = combo.querySelector(".main-content");
    const floating = combo.querySelector(".floating-container");
    const items = floating.querySelectorAll(".item");
    const input = combo.querySelector("input");

    RemoveAllListenerOf(main);
    RemoveAllListenerOf(floating);
    RemoveAllListenerOf(input);

    items.forEach((item) => RemoveAllListenerOf(item));
}

export function ListenToThisCombo(combo) {
    const main = combo.querySelector(".main-content");
    const floating = combo.querySelector(".floating-container");
    const items = floating.querySelectorAll(".item");
    const input = combo.querySelector("input");

    let COMBOACTIVE = false;
    let FROMSEARCH = false;
    let SEARCHING = false;
    let SELECTED = -1;

    const reset = () => {
        for (const item of items) {
            item.classList.remove("hide");
        }

        SEARCHING = false;
    };

    const search = (toSearch) => {
        if (toSearch.length) {
            SEARCHING = true;
            FROMSEARCH = false;
            for (const item of items) {
                const text = item.textContent.toLowerCase();
                if (text.indexOf(toSearch.toLowerCase()) >= 0) {
                    item.classList.remove("hide");
                } else {
                    if (!item.classList.contains("hide")) {
                        item.classList.add("hide");
                    }
                }
            }
        } else reset();
    };

    const isItemExist = (target = "") => {
        target = target.toLowerCase();

        let i = 0;

        for (const item of items) {
            if (item.textContent.toLowerCase() === target) {
                return i;
            }

            i++;
        }

        return -1;
    };

    const resetSelect = () => {
        for (const item of items) {
            item.classList.remove("select");
        }
    };

    const getActives = () => {
        const active = [];

        resetSelect();

        for (const item of items) {
            if (!item.classList.contains("hide")) {
                active.push(item);
            }
        }

        return active;
    };

    const selectItem = (index) => {
        const actives = getActives();

        if (actives.length) {
            const active = actives[index];

            if (active) {
                active.classList.add("select");
                active.scrollIntoView();
                input.value = active.textContent;
            }
        }
    };

    const setComboActive = (bool) => {
        COMBOACTIVE = bool;

        if (bool) {
            combo.classList.add("show")
        } else {
            combo.classList.remove("show")
        }

    }

    main.addEventListener("click", () => combo.classList.add("show"));

    let i = 0;
    for (const item of items) {
        item.addEventListener("click", () => {
            input.value = item.textContent;
            input.setAttribute("data-value", item.getAttribute("value"));
            setComboActive(false);
        });

        i++;
    }

    // input.addEventListener("change", () => {
    //
    // });

    input.addEventListener("input", () => search(input.value));
    input.addEventListener("focus", () => {
        setComboActive(true);
    });

    input.addEventListener("blur", () => {
        if (input.value.length === 0) {
            reset();
        }
    });

    combo.addEventListener("keydown", (e) => {
        if (e.keyCode === 40) {
            if (SELECTED + 1 === items.length) {
                SELECTED = 0;
            } else {
                SELECTED++;
            }
        } else if (e.keyCode === 38) {
            if (SELECTED >= 0) {
                if (SELECTED - 1 < 0) {
                    SELECTED = items.length - 1;
                } else {
                    SELECTED--;
                }
            }
        }

        selectItem(SELECTED);
    });

    FNOnClickOutside(combo, () => {

        if (COMBOACTIVE) {
            const ind = isItemExist(input.value);

            if (ind < 0) {
                console.log(input.value)

                reset();
                input.value = "";
            } else {
                input.value = items[ind].textContent;
            }

            if (!SEARCHING) {
                setComboActive(false);
            }

            SEARCHING = false;
        }
    }, [floating]);
}

export function ListenToSelect(element, callback) {
    if (element) {
        const selects = element.querySelectorAll(".custom-select");

        for (const select of selects) {
            select.addEventListener("click", () => {
                const radio = select.querySelector("input[type=radio]");

                if (callback) {
                    callback(radio.value);
                }
            });
        }
    }
}

export function ListenToCombo(element, callback) {
    if (element) {
        const input = element.querySelector("input");
        const items = element.querySelectorAll(".item");

        for (const item of items) {
            item.addEventListener("click", () => {
                const span = item.querySelector("span");
                input.value = span.textContent;
                callback && callback(item.getAttribute("value"), span.textContent);
            });
        }
    }
}

export function LinkViewButtonActive(element, path, bool) {
    const links = element.querySelectorAll(".link-view-button");

    for (const link of links) {
        ToggleComponentClass(link, "active", false);
        if (link.getAttribute("data-redirect") === path) {
            ToggleComponentClass(link, "active", bool);
        }
    }
}

export function ManageDisabledLinkRedirect(className, callback) {
    const links = document.querySelectorAll("a" + "." + className);

    for (const link of links) {
        const href = link.getAttribute("href");

        link.addEventListener("click", (e) => {
            e.preventDefault();

            window.history.pushState({}, "", href);

            callback && callback(href);
        });
    }
}

export function ListenToLinkViewButton(element, callback) {
    const links = element.querySelectorAll(".link-view-button");

    const reset = () => {
        for (const link of links) {
            ToggleComponentClass(link, "active", false);
        }
    };

    for (const link of links) {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const href = link.getAttribute("href");
            const path = link.getAttribute("data-redirect") ?? href;

            window.history.pushState({}, "", href);

            callback && callback(path);

            reset();
            ToggleComponentClass(link, "active", true);
        });
    }
}

export function ManageSelects() {
    const SELECTS = document.querySelectorAll(".custom-selects-parent");

    for (const SELECT of SELECTS) {
        const items = SELECT.querySelectorAll(".custom-select");

        const set = (item, bool) => {
            const radio = item.querySelector("input[type=radio]");
            radio.checked = bool;

            if (bool) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        };

        const reset = () => {
            for (const item of items) {
                set(item, false);
            }
        };

        const setActive = (index) => {
            reset();
            set(items[index], true);
        };

        if (IsNodeList(items)) {
            const searchActive = [...Array(items.length)]
                .map((_, i) => i)
                .filter((_, i) => items[i].classList.contains("active"));

            const active = searchActive.length ? searchActive[0] : -1;

            setActive(active);
        }

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener("click", () => setActive(i));
        }
    }
}

export function GetDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

export const Range = (min, max) => {
    return Array.from({length: max - min + 1}, (_, i) => min + i);
};

export function RemoveAllListenerOf(element) {
    const new_element = element.cloneNode(true);
    element.parentNode.replaceChild(new_element, element);

    return new_element;
}

export function RemoveListener(element, event, listener) {
    element.removeEventListener(event, listener);
}

export function ToggleComponentClass(element, className, bool) {
    if (!element) return;

    if (bool) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

export function HideShowComponent(element, bool, flex = true) {
    if (!element) return
    if (bool) {
        element.classList.remove("hide-component");
        if (flex) {
            element.classList.add("show-component");
        } else {
            element.classList.add("show-component-not-flex");
        }
    } else {
        element.classList.add("hide-component");
        if (flex) {
            element.classList.remove("show-component");
        } else {
            element.classList.remove("show-component-not-flex");
        }
    }
}

export function UUIDV4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

export function GetLocationPathFromIndex(
    start,
    end,
    path = window.location.pathname
) {
    return path.split("/").slice(start, end).join("/").toString();
}

export function IsOutOfViewport(elem) {
    const bounding = elem.getBoundingClientRect();
    const out = {};

    out.top = bounding.top < 0;
    out.left = bounding.left < 0;
    out.bottom =
        bounding.bottom >
        (window.innerHeight || document.documentElement.clientHeight);
    out.right =
        bounding.right >
        (window.innerWidth || document.documentElement.clientWidth);
    out.any = out.top || out.left || out.bottom || out.right;
    out.all = out.top && out.left && out.bottom && out.right;

    return out;
}

export function ManageGrowWrap() {
    const growers = document.querySelectorAll(".grow-wrap");

    growers.forEach((grower) => {
        const textarea = grower.querySelector("textarea");
        let value = null;

        textarea.addEventListener("input", () => {
            const growUntil = textarea.getAttribute("data-grow-until");
            // const bool = growUntil && grower.clientHeight <= parseInt(growUntil);

            grower.dataset.replicatedValue = textarea.value;
        });
    });
}

export function IsOverflowing({
                                  clientWidth,
                                  clientHeight,
                                  scrollWidth,
                                  scrollHeight,
                              }) {
    return scrollHeight > clientHeight || scrollWidth > clientWidth;
}

export function ExecuteFn(listeners, listener, ...args) {
    if (
        listener &&
        listeners[listener] &&
        typeof listeners[listener] === "function"
    ) {
        listeners[listener](...args);
    }
}

export function TextareaSubmitListener(textarea, listeners = {}) {
    if (!textarea) return;
    textarea.addEventListener("keydown", function (e) {
        const keyCode = e.which || e.keyCode;

        if (keyCode === 13 && !e.shiftKey) {
            // Don't generate a new line
            e.preventDefault();
            ExecuteFn(listeners, "onEnter", textarea.value);
        } else if (keyCode === 13 && e.shiftKey) {
            ExecuteFn(listeners, "onBreakLine", textarea.value);
        }
    });

    textarea.addEventListener("input", () => {
        ExecuteFn(listeners, "onInput", textarea.value);
    });

    textarea.addEventListener("change", () => {
        ExecuteFn(listeners, "onChange", textarea.value);
    });
}

export function CountTextareaLines(textarea) {
    const text = textarea.value;
    const lines = text.split("\n");
    return lines.length;
}

export function InsertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        let sel;
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == "0") {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value =
            myField.value.substring(0, startPos) +
            myValue +
            myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

export function OnScrollToBottom(callback) {
    window.onscroll = function (ev) {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            callback && callback();
        }
    };
}

export function ElOnScrollToTop(element, callback) {
    if (!element) return;
    element.onscroll = function (ev) {
        if (element.scrollTop === 0) {
            callback && callback();
        }
    };
}

export function ElOnScrollToBottom(element, callback) {
    if (!element) return;
    element.addEventListener("scroll", function (event) {
        var element = event.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            callback && callback();
        }
    });
}

export function ScrollManager(bool) {
    const keys = {37: 1, 38: 1, 39: 1, 40: 1};

    const preventDefault = (e) => {
        e.preventDefault();
    };

    const preventDefaultForScrollKeys = (e) => {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    };

    let supportsPassive = false;

    try {
        window.addEventListener(
            "test",
            null,
            Object.defineProperty({}, "passive", {
                get: function () {
                    supportsPassive = true;
                },
            })
        );
    } catch (e) {
    }

    const wheelOpt = supportsPassive ? {passive: false} : false;
    const wheelEvent =
        "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

    function DisableScroll() {
        window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
        // window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
        window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
        window.addEventListener("keydown", preventDefaultForScrollKeys, false);
    }

    // call this to Enable
    function EnableScroll() {
        window.removeEventListener("DOMMouseScroll", preventDefault, false);
        // window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
        window.removeEventListener("touchmove", preventDefault, wheelOpt);
        window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
    }

    bool ? EnableScroll() : DisableScroll;
}

export function EnableDisableInput(input, bool) {
    ToggleComponentClass(input, "button-disabled", bool);

    if (bool) {
        addAttr(input, "disabled", "true");
    } else {
        input.removeAttribute("disabled");
    }
}

export function EnableDisableButton(button, bool) {
    ToggleComponentClass(button, "button-disabled", bool);

    if (bool) {
        addAttr(button, "disabled", "true");
    } else {
        button.removeAttribute("disabled");
    }
}

export function PreventScroll(e) {
    e.preventDefault();
    e.stopPropagation();

    return false;
}

export function DisableScroll() {
    document.body.style.overflow = "hidden";
}

export function EnableScroll() {
    document.body.style.overflow = "auto";
}

export function UseImageMiniIcon(name, x, y, width, height, extension = "png") {
    const src = "public/assets/media/mini-icons/" + name + "." + extension;

    return CreateElement({
        el: "i",
        attr: {
            dataVisualcompletion: "css-img",
        },
        styles: {
            width: `${width}px`,
            height: `${height}px`,
            backgroundPosition: `${x}px ${y}px`,
            backgroundImage: `url("${src}")`,
            backgroundSize: `auto`,
            backgroundRepeat: "no-repeat",
        },
    });
}

export function SortArrLowToHigh(array) {
    array.sort(function (a, b) {
        if (a === Infinity) return 1;
        else if (isNaN(a)) return -1;
        else return a + b;
    });

    return array;
}

export function CreateIllustrationInfoContainer(obj) {
    const {illustration, primary, secondary, buttons = []} = obj;
    const path = "/public/assets/media/images/illustrations/";

    const createButton = (btn) => {
        const {text, icon, action, classes = []} = btn;
        const childs = [];

        if (icon) {
            childs.push(
                CreateElement({
                    el: "DIV",
                    className: "icon",
                    child: CreateElement({
                        el: "IMG",
                        attr: {
                            src: icon,
                        },
                    }),
                })
            );
        }

        return CreateElement({
            el: "DIV",
            classes: ["icon-button", ...classes],
            childs: [
                ...childs,
                CreateElement({
                    el: "DIV",
                    className: "text",
                    child: CreateElement({
                        el: "SPAN",
                        text: text,
                    }),
                }),
            ],
            listener: {
                click: () => action && action(),
            },
        });
    };

    return CreateElement({
        el: "DIV",
        className: "illustration-info-container",
        childs: [
            CreateElement({
                el: "DIV",
                className: "illustration",
                child: CreateElement({
                    el: "IMG",
                    attr: {
                        src: `${path}${illustration}`,
                    },
                }),
            }),
            CreateElement({
                el: "DIV",
                className: "body",
                childs: [
                    CreateElement({
                        el: "DIV",
                        className: "top",
                        childs: [
                            CreateElement({
                                el: "h1",
                                text: primary,
                            }),
                            CreateElement({
                                el: "p",
                                text: secondary,
                            }),
                        ],
                    }),
                    CreateElement({
                        el: "DIV",
                        className: "bot",
                        child: CreateElement({
                            el: "DIV",
                            className: "buttons",
                            child: !buttons.length
                                ? []
                                : buttons.map((btn) => createButton(btn)),
                        }),
                    }),
                ],
            }),
        ],
    });
}

export function Ltrim(str) {
    if (!str) return str;
    return str.replace(/^\s+/g, "");
}

export function GetURLParRange(parent, uri, until) {
    const path = uri.split("/").map((a) => a.trim());
    const isTheSame = path.length === 2 && path[0] === path[1];
    const last = path.lastIndexOf(parent);

    return isTheSame
        ? path.join("/").toString()
        : path
            .slice(last, last + 2)
            .join("/")
            .toString();
}

export function ReformatURI(uri) {
    return uri.replaceAll("//", "/");
}

//
// export function MakeID(length) {
//     var result = "";
//     var characters =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     var charactersLength = characters.length;
//     for (var i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
// }

export function ListenToForm(form, callback, excepts = []) {
    const clearBtn = form.querySelector(".clear-form");

    const getAllFields = () => {
        const input = [...form.querySelectorAll("input")].filter(i => !i.classList.contains("table-checkbox"));
        const textarea = form.querySelectorAll("textarea");
        const combos = form.querySelectorAll(".custom-combo-box");

        return {input, textarea, combos};
    }

    const disableButton = (btn, bool) => {
        const parent = btn.parentNode;

        EnableDisableButton(btn, bool);

        if (parent.classList.contains('form-group')) {
            EnableDisableButton(parent, bool);
        }
    }

    const check = (ignore = false) => {
        const formdata = new FormData(form);
        const data = Object.fromEntries(formdata);
        const verify = VerifyFormData(formdata, excepts);
        const button = form.querySelector("input[type=submit]");

        if (button) {
            disableButton(button, true);
        }

        if (!verify.status) {
            if (!ignore) {
                ApplyError(verify.empty, form);
            }

            disableButton(button, true);
        } else {

            if (!ignore) {
                callback && callback(data);
            } else {
                disableButton(button, false);
            }
        }
    }

    const fields = getAllFields();

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            for (const input of fields.input) {
                if (input.type !== "submit") {
                    input.value = null
                }
            }
            for (const textarea of fields.textarea) textarea.value = null;

            check(true)
        })
    }

    for (const input of fields.input) {
        input.addEventListener("input", () => {
            if (input.type !== 'submit') {
                check(true);
            }
        });
        input.addEventListener("input", () => {
            if (input.type !== 'submit') {
                check(true);
            }
        });

        input.addEventListener("blur", () => {
            if (input.type !== 'submit') {
                check(true);
            }
        });
    }

    for (const textarea of fields.textarea) {
        textarea.addEventListener("change", () => check(true));
    }

    for (const combo of fields.combos) {
        ListenToCombo(combo, () => check(true))
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        check();
    })

    check(true);

    return check;
}

export function RemoveToCircularList(element, value, callback) {
    const items = element.querySelectorAll(".circle-item[role=item]");

    for (const item of items) {
        if (item.getAttribute("data-value") === value) {
            item.remove();
            callback && callback(value);
        }
    }
}

export function AddToCircularList(element, items, onRemove) {
    const createItem = ({text, value}) => {
        return CreateElement({
            el: "DIV",
            className: "circle-item",
            attr: {
                role: "item",
                ["data-value"]: value
            },
            text: text,
            listener: {
                click: () => {
                    RemoveToCircularList(element, value);
                    onRemove && onRemove(value, text);
                }
            }
        })
    }

    const elements = [...new Array(items.length)].map((_, i) => createItem(items[i]));

    prepend(element, elements);

}

export function ListenToCircularList(element, currentData = [], listeners = {}, replace = false) {
    const button = element.querySelector(".circle-item[role=button]");

    button.addEventListener("click", () => {
        ExecuteFn(listeners, "onAdd");
    });

    if (currentData.length) {

        if (replace) {
            currentData.forEach((item) => RemoveToCircularList(element, item.value));
        }

        AddToCircularList(element, currentData, (item) => {
            ExecuteFn(listeners, "onRemove", item);
        });
    }
}

export function GetCircularListValues(element) {
    const items = element.querySelectorAll(".circle-item[role=item]");
    return [...new Array(items.length)].map((_, i) => {
        return {
            value: items[i].getAttribute('data-value'),
            text: items[i].textContent
        }
    })
}

export function GetNumsOfYear(y, m) {
    return new Date(y, m, 0).getDate()
}

export function CreateCheckBox() {
    return CreateElement({
        el: "DIV",
        className: "custom-checkbox-parent",
        childs: [
            CreateElement({
                el: "DIV",
                className: "circle"
            }),
            CreateElement({
                el: "DIV",
                className: "custom-checkbox",
                childs: [
                    CreateElement({
                        el: "INPUT",
                        className: "table-checkbox",
                        attr: {
                            type: "checkbox"
                        }
                    }),
                    CreateElement({
                        el: "SPAN",
                        className: "checkmark"
                    })
                ]
            })
        ]
    })
}

export function SetEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    {
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}