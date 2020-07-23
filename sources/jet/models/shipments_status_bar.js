"use strict";

import {JetView} from "webix-jet";
import {message} from "../views/common";
import {bSpace} from "../views/variables";



export default class ShipmentsStatusBar extends JetView{
    config(){

        let statusbar = { 
            // id: "_shipmentsstatusbar",
            borderless: true,
            cols: [
                {view: "label", 
                    autowidth: true,
                    // css: "status_bar",
                    label: "Фильтры: ",
                    on: {
                        onItemClick: ()=> {
                            this.app.commonWidgets.shipments.button_filter.buttonClick()
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
                            this.app.commonWidgets.shipments.button_filter.buttonClick()
                        }
                    }

                },
            ]
        }

        return statusbar
    }


    setStatus() {
        let filters = this.app.commonWidgets.shipments.menu_filters.getFiltersValue();
        let new_label = [];
        for (var elem in filters) {
            let text = filters[elem];
            if (text) {
                let title = $$('translates_dc').getItem(elem).value;
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
        this.app.commonWidgets.shipments['status_bar'] = this;
    }

    init() {
    }
}