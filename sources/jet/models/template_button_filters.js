"use strict";

import {JetView} from "webix-jet";
import TemplateMenuFilters from "../models/template_menu_filters";


export default class TemplateButtonFilters extends JetView{

    constructor(app, name){
        super(app);
        this.p_name = name;
    }


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
        this.app.commonWidgets[this.p_name]['button_filter'] = this;
    }

    init() {
        this.menuFilters = this.ui(new TemplateMenuFilters(this.app, this.p_name))
    }
}