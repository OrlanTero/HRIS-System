import {
    addClass,
    Ajax,
    CreateElement,
    DisableScroll,
    EnableScroll,
    ExecuteFn,
    HideShowComponent,
    ToData,
} from "../../modules/component/Tool.js";
import {CONTAINERS} from "../../modules/app/Application.js";

export const NotificationType = {
    ERROR: 'notification-error',
    SUCCESS: 'notification-success',
    INFO: 'notification-info',
    WARNING: 'notification-warning'
}

export class NotificationPopup {
    constructor(DATA = {}, OPTIONS = {}) {
        this.DATA = {...this.GetDefaultData(),...DATA};
        this.OPTIONS = this.InitOptions(OPTIONS);
        this.PARENT = this.FindMyParent();
        this.ELEMENT = null;
        this.MAINELEMENTITEM = null;
        this.LISTENERS = {};
        this.REMOVED = false;
    }

    GetDefaultData() {
        return {
            title: 'This is my Popup',
            message: 'Supporting Details'
        }
    }


    AddListeners(listeners = {onYes: null, onNo: null, onCancel: null, onShow: null, onHide: null}) {
        this.LISTENERS = {
            ...listeners,
            ...this.LISTENERS
        }
    }

    InitOptions(option = {}) {
        return {
            type: NotificationType.INFO,
            ...option,
            backgroundDismiss: option.backgroundDismiss ?? false,
            removeOnDismiss: option.removeOnDismiss ?? false,
        };
    }

    FindMyParent() {
        const parentID = "notification-all";
        const parent = document.querySelector("#" + parentID);

        const newParent = CreateElement({
            el: "section",
            id: parentID,
        });

        if (!parent) {
            CONTAINERS.notifications.appendChild(newParent);
        }

        return parent ?? newParent;
    }

    Create() {
        const pop = this;

        return new Promise((resolve) => {

            const element = CreateElement({
                el: 'DIV',
                className: ['notification-item', pop.OPTIONS.type],
                child: CreateElement({
                    el: 'div',
                    className: 'main',
                    childs: [
                        CreateElement({
                            el: 'div',
                            className: 'header',
                            childs: [
                                CreateElement({
                                    el: 'div',
                                    className: 'left',
                                    child: CreateElement({
                                        el: 'h4',
                                        text: pop.DATA.title
                                    })
                                }),
                                CreateElement({
                                    el: 'div',
                                    className: 'right',
                                    child: CreateElement({
                                        el: 'div',
                                        className: 'floating-button',
                                        child: [
                                            CreateElement({
                                                el: 'div',
                                                className:  ['popup-button', 'close-popup'],
                                                html: `<svg width="50px" height="50px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M37.304 11.282l1.414 1.414-26.022 26.02-1.414-1.413z"/><path d="M12.696 11.282l26.022 26.02-1.414 1.415-26.022-26.02z"/></svg>`
                                            })
                                        ]
                                    })
                                }),
                            ]
                        }),
                        CreateElement({
                            el: 'div',
                            className: 'body',
                            child: CreateElement({
                                el: 'p',
                                text: pop.DATA.message
                            })
                        }),
                        CreateElement({
                            el: 'div',
                            className: 'footer',
                            child: CreateElement({
                                el: 'div',
                                className: 'notification-time-control'
                            })
                        }),
                    ]
                })
            })

            pop.Place(element);

            resolve();
        });
    }


    Place(popup) {
        if (popup && this.PARENT) {
            this.ELEMENT = popup;

            this.PARENT.appendChild(this.ELEMENT);

            this.Listeners();

            this.Show();

            ExecuteFn(this.LISTENERS, "onPlace");
        }
    }

    Listeners() {
        if (this.PARENT && this.ELEMENT) {
            // const background = this.ELEMENT.querySelector(".popup-background");
            const closeBtn = this.ELEMENT.querySelector(".close-popup");

            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    this.Remove();
                });
            }
        }
    }

    Show() {
        if (!this.ELEMENT) return false;

        DisableScroll();
        HideShowComponent(this.ELEMENT, true, false);
        ExecuteFn(this.LISTENERS, "onShow");

        return this.ELEMENT;
    }

    Hide() {
        if (!this.ELEMENT) return false;

        EnableScroll();
        HideShowComponent(this.ELEMENT, false);
        ExecuteFn(this.LISTENERS, "onHide");
    }

    Remove() {
        if (!this.ELEMENT) return false;
        const pop = this;

        if (this.REMOVED) return;

        this.REMOVED = true;

        EnableScroll()

        addClass(this.ELEMENT, 'closing');

        setTimeout(function () {
            pop.ELEMENT.remove();
        }, 500)

        ExecuteFn(this.LISTENERS, "onRemove");
    }
}

export function NewNotification({title, message}, interval, type) {
    const popup = new NotificationPopup({
        title: title,
        message: message
    }, {
        backgroundDismiss: false,
        type: type ?? NotificationType.INFO
    });

    popup.Create().then(((pop) => {
        popup.Show();

        setTimeout(function () {
            popup.Remove();
        }, interval)
    }));
}

export default NotificationPopup;
