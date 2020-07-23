"use strict";

import {JetView} from "webix-jet";
import {message} from "../views/common";
import {request} from "../views/common";
import ArrivalsMenuFilters from "../models/arrivals_menu_filters";


export default class ArrivalsButtonFilters extends JetView{
    config(){

        let button = {view:"button",
            localId: "_bFilter",
            type: "icon",
            width: 100,
            icon: "mdi-filter",
            label: "Фильтры",
            on: {
                onItemClick: function() {
                    if (!this.$scope.menuFilters.isVisible()) 
                        this.$scope.menuFilters.show(this);
                    else this.$scope.menuFilters.hide();
                }
            },
        }

        return button
    }

    buttonClick() {
        this.$$("_bFilter").callEvent('onItemClick');
    }

    ready() {
        this.app.commonWidgets.arrivals['button_filter'] = this;
    }

    init() {
        this.menuFilters = this.ui(ArrivalsMenuFilters)
    }
}