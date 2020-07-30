"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../views/variables";
import ShipmentsButtonFilters from "../models/shipments_button_filters"
import ShipmentsStatusBar from "../models/shipments_status_bar";
import SearchBar from "../models/search_bar";
import { message } from "../views/common";
import TemplateQuickFilters from "../models/template_quick_filters";

export default class ShipmentsHeaderView extends JetView{
    config(){

        let toolbar = {view: 'toolbar',
            borderless: true,
            margin: 0,
            cols: [
                {view: "label", label: "<span class='label_highlited'>Отгрузки</span>", autowidth: true,
                    css: "label_highlited", hidden: true
                },
                {width: emptyWidth},
                // {$subview: SearchBar, name: "search_bar"},
                {},
                new TemplateQuickFilters(this.app, 'shipments'),

                ShipmentsButtonFilters,
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
                {$subview: ShipmentsStatusBar, name: "status_bar"}
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
        this.app.commonWidgets.shipments['header'] = this;
    }

    init() {
    }
}
