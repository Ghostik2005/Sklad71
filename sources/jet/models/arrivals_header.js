"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../views/variables";
import ButtonFilters from "../models/arrivals_button_filters"
import ArrivalsStatusBar from "../models/arrivals_status_bar";
import SearchBar from "../models/search_bar";
import QuickFilters from "../models/arrivals_quick_filters";
import { message } from "../views/common";
import {request, checkResponse} from "../views/common";

export default class ArrivalsHeaderView extends JetView{
    config(){

        let toolbar = {view: 'toolbar',
            borderless: true,
            margin: 0,
            cols: [
                {view: "label", label: "<span class='label_highlited'>Поступления</span>", autowidth: true,
                    css: "label_highlited", hidden: true
                },
                {width: emptyWidth},
                // {$subview: SearchBar, name: "search_bar"},
                {},
                {$subview: QuickFilters, name: "quick_filters"},
                {$subview: ButtonFilters, name: "button_filter"}
            ]
    
        }

        let status = {
            height: 26, 
            borderless: true,
            cols: [
                {view: "label",
                    hidden: true,
                    autowidth: true,
                    label: "Название юр. лица:",
                    on: {
                        onItemClick: function(id, event) {
                            this.$scope.changeOrganization(id, event)
                        },
                    }
                },
                {width: emptyWidth},
                {view: "label",
                    hidden: true,
                    css: "italic",
                    autowidth: true,
                    label: "ООО Организация",
                    on: {
                        onItemClick: function(id, event) {
                            this.$scope.changeOrganization(id, event)
                        },
                    },
                },
                {width: emptyWidth},
                {width: emptyWidth},
                {$subview: ArrivalsStatusBar, name: "status_bar"}
            ]            
        }

        return { 
            borderless: true,
            rows: [
                toolbar,
                status,
            ]
        }

    }

    changeOrganization(id, event) {
        message('Смена организации');
        console.log('commonWidg', this.app.commonWidgets);

    }

    ready() {
        this.app.commonWidgets.arrivals['header'] = this;
    }

    init() {
    }
}
