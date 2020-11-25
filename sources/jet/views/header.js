"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../variables/variables";
import {getUser} from "../views/common";
import {icon_buttons_cfg} from "../models/side_buttons_config";


export default class HeaderView extends JetView{
    config(){
        let app = this.app;
        let cfg = icon_buttons_cfg["logout"];
        let toolbar = {view: 'toolbar',
            id: "__bar__main_header",
            height: 32,
            borderless: true,
            margin: 0,
            cols: [
                {view: "label", label: "<span class='label_highlited'>Хознужды</span>", autowidth: true,
                    css: "label_highlited",
                    hidden: true,
                },
                {width: emptyWidth*3},
                {view: "label",
                    hidden: !true,
                    // autowidth: true,
                    width: 150,
                    label: "Название юр. лица:",
                    on: {
                        onItemClick: function(id, event) {
                            this.$scope.changeOrganization(id, event)
                        },
                    }
                },
                {width: emptyWidth},
                {view: "label",
                    hidden: !true,
                    localId: "__org_name",
                    css: "italic",
                    autowidth: true,
                    label: "ООО Организация",
                    on: {
                        onItemClick: function(id, event) {
                            this.$scope.changeOrganization(id, event)
                        },
                    },
                },
                {},
                {view: "label",
                    hidden: !true,
                    autowidth: true,
                    // width: 150,
                    label: "Пользователь:",
                },
                {width: emptyWidth},
                {view: "label",
                    hidden: !true,
                    css: "italic",
                    localId: "__uname",
                    autowidth: true,
                    label: "",
                    on: {
                        onItemClick: function(id, event) {
                            this.$scope.changeOrganization(id, event)
                        },
                    },
                },
                {width: emptyWidth},
                {view: "button",
                    id: `__button__logout`,
                    hidden: (PRODUCTION) ? cfg.hidden : false,
                    longPress: cfg.longPress,
                    width: cfg.width,
                    height: 24,
                    template: () => {
                        let icon = '<svg  version="1.1" class="icon_exit_button" viewBox="0 0 22 22">' + cfg.icon +'</svg>';
                        let box = "<div class='webix_el_box', title='" + cfg.title + "'><button class='webix_button exit_button'>" + icon + "<span class='exit_button_label', style=''>" + cfg.label + "</span>"
                        let but = "<div class='webix_el_button'>" + box + "</div>";
                        return but
                    },
                    on: {
                        onItemClick: () => {
                            app.getService("common").logout();
                        }
                    }
                }
            ]

        }

        return toolbar;

    }

    changeOrganization(id, event) {
        document.message('Для смены организации свяжитесь с администратором');

    }

    setUser() {
        this.$$("__uname").setValue(getUser());
        this.$$("__uname").resize();
    }

    setOrg() {
        this.$$("__org_name").setValue(this.app.config.home_org);
        // console.log('org', this.app.config.home_org)
        this.$$("__org_name").resize();
    }

    ready() {
        this.app.commonWidgets[this.widget_name] = this;
    }

    init() {
        this.widget_name = "header";
    }
}
