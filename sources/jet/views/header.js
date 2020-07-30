"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../views/variables";

import { message } from "../views/common";
import {getUser} from "../views/common";

export default class HeaderView extends JetView{
    config(){
        let app = this.app;
        let toolbar = {view: 'toolbar',
            borderless: true,
            margin: 0,
            cols: [
                {view: "label", label: "<span class='label_highlited'>Склад71</span>", autowidth: true,
                    css: "label_highlited"
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
                // {$subview: SearchBar, name: "search_bar"},
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
                            // this.$scope.changeOrganization(id, event)
                        },
                    },
                },
                {width: emptyWidth},
                {view: "button", 
                    label: "logout", 
                    width: 80,
                    on: {
                        onItemClick: () => {
                            app.getService("common").logout();
                        }
                    }
                }
                // {$subview: QuickFilters, name: "quick_filters"},
                // {$subview: ButtonFilters, name: "button_filter"}
            ]
    
        }

        return {
            id: "__bar__main_header",
            borderless: true,
            rows: [
                toolbar,
            ]
        }

    }

    changeOrganization(id, event) {
        message('Смена организации');
        console.log('commonWidg', this.app.commonWidgets);

    }

    setUser() {
        this.$$("__uname").setValue(getUser());
        this.$$("__uname").resize();
    }

    setOrg() {
        this.$$("__org_name").setValue(this.app.config.home_org);
        this.$$("__org_name").resize();
    }

    ready() {
        this.app.commonWidgets[this.widget_name] = this;
    }

    init() {
        this.widget_name = "header";
    }
}
