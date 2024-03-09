import {ResetActiveComponent, SetActiveComponent} from "../../modules/component/Tool.js";

export default class MenuBarListener {

    constructor(menubar) {
        this.parent = menubar;
        this.elements = this.initElements();
        this.selected = 0;

        this.init();
    }

    init() {

        this.moveNotOfficial();

        this.listen();
    }

    initElements() {
        return {
            header: this.parent.querySelector(".menu-header"),
            body: this.parent.querySelector(".menu-body"),
            headerItems: this.parent.querySelectorAll(".menu-header .header-item"),
            notOfficial: this.parent.querySelector(".menu-content-not-official"),
            bodyItems: this.parent.querySelectorAll(".menu-body-item")
        };
    }

    listen() {
        const main = this;

        for (const item of this.elements.headerItems) {
            item.addEventListener("click", function () {
                const id = item.getAttribute("data-id");

                main.setActive(id);
            })
        }
    }

    resetContentActive() {
        ResetActiveComponent(this.elements.bodyItems);
    }

    setActive(id) {
        const item = this.getHeaderItem(id);
        this.resetContentActive();

        ResetActiveComponent(this.elements.headerItems);
        SetActiveComponent(item, true);

        const content = this.elements.bodyItems[parseInt(id)];

        SetActiveComponent(content, true);

        this.selected = id;
    }

    moveNotOfficial() {
        const fragment = document.createDocumentFragment();

        fragment.appendChild(this.elements.notOfficial);

        this.elements.body.appendChild(fragment);

        this.elements.headerItems =  this.parent.querySelectorAll(".menu-header .header-item");
    }

    makeActive(number) {
        this.setActive(number);
    }

    getHeaderItem(id) {
        return [...this.elements.headerItems].filter((item) => item.getAttribute("data-id") == id)[0];
    }
}