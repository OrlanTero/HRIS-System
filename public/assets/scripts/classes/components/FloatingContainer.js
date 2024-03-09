import {
    addHtml,
    addStyles,
    Ajax,
    append,
    CreateElement,
    FNOnClickOutside,
    HideShowComponent,
} from "../../modules/component/Tool.js";
import {CONTAINERS} from "../../modules/app/Application.js";

export const POSITIONS = {
    top: "POSITION-TOP",
    bot: "POSITION-BOT",
    left: "POSITION-LEFT",
    right: "POSITION-RIGHT",

    topLeft: "POSITION-TOP-LEFT",
    topRight: "POSITION-TOP-RIGHT",
    botLeft: "POSITION-BOT-LEFT",
    botRight: "POSITION-BOT-RIGHT",
};

export class FloatingContainer {
    constructor(request, options = {}) {
        this.element = this.createElement();
        this.activated = false;
        this.hasData = false;
        this.request = request;
        this.options = {excepts: [], ...options};
        this.currentListener = {
            click: null,
            resize: null,
            scroll: null,
        };
    }

    setRequest(r) {
        this.request = {
            ...this.request,
            ...r
        }
    }

    createElement() {
        return CreateElement({
            el: "DIV",
            className: "absolute-floating-container",
        });
    }
3
    async showAt(button, listeners = {}, position = POSITIONS.top) {
        this.currentListeners = listeners;

        if (!this.activated) {
            append(this.options.place ? button : CONTAINERS.popup, this.element);
        }

        const getLocationFromPos = (pos) => {
            const style = window.getComputedStyle(this.element);
            const width = parseInt(style.width);
            const height = parseInt(style.height);
            const rect = button.getBoundingClientRect();
            const bh = rect.height;
            const bw = rect.width;
            const t = rect.top;
            const l = rect.left;
            let left = 0,
                top = 0;

            switch (pos) {
                case POSITIONS.top:
                    top = t - height;
                    left = l + width / 2;
                    left -= bw * 1.5;
                    top -= 20;
                    break;
                case POSITIONS.bot:
                    top = t + bh * 2;
                    left = l - width / 2;
                    top -= 20;
                    break;
                case POSITIONS.left:
                    top = t - height / 2;
                    left = l - width;
                    left -= 20;
                    break;
                case POSITIONS.right:
                    top = t - height / 2;
                    left = l + bw;
                    break;
                case POSITIONS.botLeft:
                    top = t + bh * 2;
                    left = l - width;
                    left -= 20
                    break;
                case POSITIONS.botRight:
                    top = t + bh * 2;
                    left = l + bw;
                    break;
            }

            return {top, left};
        };

        const place = () => {
            let {top: mt, left: ml} = getLocationFromPos(position);

            if (!isNaN(mt) && !isNaN(ml)) {

                if (this.options && this.options.margin) {
                    if (this.options.margin.left) {
                        ml += this.options.margin.left
                    }

                    if (this.options.margin.top) {
                        mt += this.options.margin.top
                    }
                }

                this.options.styles = {
                    ...this.options.styles,
                    top: mt,
                    left: ml,
                }
            }

            this.applyOptions();
        };

        window.removeEventListener("resize", this.currentListener.resize);
        window.removeEventListener("scroll", this.currentListener.scroll);

        window.addEventListener("resize", place);
        window.addEventListener("scroll", place);

        if (!this.options.disableClickOutside) {

            this.currentListener.click = FNOnClickOutside(
                button,
                () => {
                    HideShowComponent(this.element, false);
                },
                [button, ...this.options.excepts],
                () => {
                    HideShowComponent(this.element, true);
                }
            );
        }

        if (!this.activated) {
            this.activated = true;
        } else {
            HideShowComponent(this.element, true);
        }

        place();



        this.executeListener("onReady");

        if (!this.hasData) {
            const picker = await this.getContent();
            this.executeListener("onLoadingStart");

            try {
                addHtml(this.element, picker);
                this.hasData = true;
                place();
                this.executeListener("onLoadingEnd", this.element);
                this.executeListener("onLoad", this.element);
            } catch (e) {
                console.log(e);
            }
        }

        this.showed = true;
    }

    replaceContent(HTML) {
        addHtml(this.element, HTML);
    }

    hide() {
        HideShowComponent(this.element);

        this.showed = false;
    }

    executeListener(listener, ...args) {
        if (listener && typeof this.currentListeners[listener] === "function") {
            this.currentListeners[listener](...args);
        }
    }

    async getContent() {
        return new Promise((resolve, reject) => {
            Ajax({
                url: `/components/containers/${this.request.name ?? 'default'}`,
                type: "POST",
                success: resolve,
                error: reject,
                ...this.request,
            });
        });
    }

    applyOptions() {
        if (this.options.styles) {
            const apply = {
                width: this.options.styles.width ?? 'auto',
                minWidth: this.options.styles.width ?? 'auto'
            };

            apply["position"] = this.options.styles.position ?? 'fixed';
            apply["top"] = `${this.options.styles.top}px`;
            apply["left"] = `${this.options.styles.left}px`;

            console.log(this.element)

            addStyles(this.element, apply)
        }
    }

    toggleShow(button, listeners = {}, position = POSITIONS.top) {
        if (this.showed) {
            this.hide();
        } else {
            this.showAt(button, listeners, position);
        }
    }
}
