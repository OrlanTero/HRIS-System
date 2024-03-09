import {
    Ajax,
    CreateElement,
    DisableScroll,
    EnableScroll,
    ExecuteFn,
    HideShowComponent,
    ToData,
} from "../../modules/component/Tool.js";
import {CONTAINERS} from "../../modules/app/Application.js";

export const AlertTypes = {
    YES_NO: 'alert-yes-no',
    YES_ONLY: 'alert-yes-only',
    CLOSE_ONLY: 'alert-close-only',
    NO_BUTTON: 'alert-no-button'
}

export const AlertStatusType = {
    ERROR: 'alert-error',
    SUCCESS: 'alert-success',
    INFO: 'alert-info'
}

export class AlertPopup {
    constructor(DATA = {}, OPTIONS = {}) {
        this.DATA = {...this.GetDefaultData(),...DATA};
        this.OPTIONS = this.InitOptions(OPTIONS);
        this.PARENT = this.FindMyParent();
        this.ELEMENT = null;
        this.LISTENERS = {};
    }

    GetDefaultData() {
        return {
            primary: 'This is my Popup',
            secondary: 'Supporting Details'
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
            status_type: AlertStatusType.INFO,
            alert_type: AlertTypes.NO_BUTTON,
            ...option,
            backgroundDismiss: option.backgroundDismiss ?? false,
            removeOnDismiss: option.removeOnDismiss ?? false,
        };
    }

    FindMyParent() {
        const parentID = "big-pipes-container";
        const parent = document.querySelector("#" + parentID);

        const newParent = CreateElement({
            el: "section",
            id: parentID,
        });

        if (!parent) {
            CONTAINERS.popup.appendChild(newParent);
        }

        return parent ?? newParent;
    }

    Create() {
        const pop = this;

        return new Promise((resolve) => {

            Ajax({
                url: `/components/popup/system/createAlertPopup`,
                type: "POST",
                data: ToData({data: JSON.stringify(this.DATA), options: JSON.stringify(this.OPTIONS)}),
                success: (popup) => {
                    pop.Place(popup);
                    resolve(pop);
                },
            });
        });
    }


    Place(popup, node = false) {
        if (popup && this.PARENT) {
            this.ELEMENT = node
                ? this.CreateDefaultElement(popup)
                : CreateElement({
                    el: "SPAN",
                    html: popup,
                });

            this.PARENT.appendChild(this.ELEMENT);

            this.Listeners();

            this.Show();

            ExecuteFn(this.LISTENERS, "onPlace");
        }
    }

    Listeners() {
        if (this.PARENT && this.ELEMENT) {
            const background = this.ELEMENT.querySelector(".popup-background");
            const closeBtn = this.ELEMENT.querySelector(".close-popup");

            const yesBtn = this.ELEMENT.querySelector(".yes-btn");
            const noBtn = this.ELEMENT.querySelector(".no-btn");
            const cancelBtn = this.ELEMENT.querySelector(".cancel-btn");

            background.addEventListener("click", () => {
                if (this.OPTIONS.backgroundDismiss) {
                    if (this.OPTIONS.removeOnDismiss) {
                        this.Remove();
                    } else {
                        this.Hide();
                    }
                }
            });

            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    this.Remove();
                });
            }

            if (yesBtn) {
                yesBtn.addEventListener("click", () => {
                    ExecuteFn(this.LISTENERS, "onYes");

                    this.Remove();
                });
            }

            if (noBtn) {
                noBtn.addEventListener("click", () => {
                    ExecuteFn(this.LISTENERS, "onNo");

                    this.Remove();
                });
            }

            if (cancelBtn) {
                cancelBtn.addEventListener("click", () => {
                    ExecuteFn(this.LISTENERS, "onCancel");

                    this.Remove();
                });
            }
        }
    }

    Show() {
        if (!this.ELEMENT) return false;

        DisableScroll();
        HideShowComponent(this.ELEMENT, true);
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

        EnableScroll()

        this.ELEMENT.remove();

        ExecuteFn(this.LISTENERS, "onRemove");
    }
}

export default AlertPopup;
