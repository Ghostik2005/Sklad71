"use strict";

import {JetView} from "webix-jet";
// import {message} from "../views/common";
import {bSpace} from "../views/variables";



export default class BalanceStatusBar extends JetView{
    config(){

        let statusbar = { 
            // id: "_arrivalsstatusbar",
            borderless: true,
            cols: [
                {view: "label", 
                    autowidth: true,
                    // css: "status_bar",
                    label: "Фильтры: ",
                    on: {
                        onItemClick: ()=> {
                            // this.app.commonWidgets.balance.button_filter.buttonClick()
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
                            // this.app.commonWidgets.balance.button_filter.buttonClick()
                        }
                    }

                },
            ]
        }

        return statusbar
    }


    setStatus() {

    }

    ready() {
        this.$$("__status").resize();
        this.app.commonWidgets.balance['status_bar'] = this;
    }

    init() {
    }
}