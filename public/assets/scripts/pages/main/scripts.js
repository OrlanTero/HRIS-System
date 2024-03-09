import {
    HideShowComponent,
    ResetActiveComponent,
    SetActiveComponent,
    ToggleComponentClass
} from "../../modules/component/Tool.js";
import {FloatingContainer, POSITIONS} from "../../classes/components/FloatingContainer.js";


function manageNavbar() {
    const navbar = document.querySelector(".main-navbar");
    const rightHeader = document.querySelector(".flex-container");
    const links = navbar.querySelectorAll(".nav-link-items .nav-link");
    const navButtonProfile  = document.querySelector(".nav-button.profile");
    const navButtonProfileContent  = document.querySelector(".nav-button.profile .content");

    const float = new FloatingContainer({
        name: "global/profileButtonContent",
    }, {margin:  {left: -100}, place: true, excepts: [navButtonProfile, navButtonProfileContent], disableClickOutside: false});

    const getCurrentActive = () => {
        const path = window.location.pathname;
        const splited = path.split("/").filter((a) => a);
        return "/" + splited[0];
    }

    const showViaPath = (path) => {
        for (const link of links) {

            const sublink = link.querySelector(".sub-content");

            if (sublink) {
                const isLPath = sublink.getAttribute("data-path") === path;

                if (isLPath) {
                    ResetActiveComponent(links);

                    SetActiveComponent(link, isLPath);
                }

                ToggleComponentClass(sublink, "show-active", isLPath ? (!sublink.classList.contains("show-active")) : false);
            }
        }
    }


    for (const link of links) {
        link.querySelector(".main").addEventListener("click", function () {
            const sublink = link.querySelector(".sub-content");

            if (sublink) {
                showViaPath(sublink.getAttribute("data-path"));
            }
        })
    }


    navButtonProfile.addEventListener("click", function () {
        float.showAt(navButtonProfile, {}, POSITIONS.bot)
    })


    showViaPath(getCurrentActive())


}


function init() {
    manageNavbar();

}

init();