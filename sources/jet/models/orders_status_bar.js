"use strict";

import {JetView} from "webix-jet";
import {message} from "../views/common";
import {bSpace} from "../views/variables";




export default class OrdersStatusBar extends JetView{
    config(){

        let statusbar = { 
            borderless: true,
            cols: [
                {view: "label", 
                    autowidth: true,
                    // css: "status_bar",
                    label: "Фильтры: ",
                    on: {
                        onItemClick: ()=> {
                            this.app.commonWidgets.orders.button_filter.buttonClick()
                        }
                    }
                },
                {width: bSpace},
                {view: "label", 
                    autowidth: true,
                    css: "status_bar",
                    localId: "__status",
                    label: "нет",
                    on: {
                        onItemClick: ()=> {
                            this.app.commonWidgets.orders.button_filter.buttonClick()
                        }
                    }

                },
            ]
        }

        return statusbar
    }


    setStatus() {
        let filters = this.app.commonWidgets.orders.menu_filters.getFiltersValue();
        let new_label = [];
        for (var elem in filters) {
            let text = filters[elem];
            if (text) {
                let title = document.app.translates[elem].value;
                new_label.push(`${title}: ${text}`);
            }
        }
        new_label = (new_label.length > 0) ? new_label.join('; ') : 'нет'
        this.$$("__status").define({label: new_label, tooltip: new_label});
        this.$$("__status").refresh();
        this.$$("__status").resize();
    }

    ready() {
        this.$$("__status").resize();
        this.app.commonWidgets.orders['status_bar'] = this;
    }

    init() {
    }
}