"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../views/variables";
import ButtonFilters from "../models/orders_button_filters"
import OrdersStatusBar from "../models/orders_status_bar";
import { message } from "../views/common";
import TemplateQuickFilters from "../models/template_quick_filters";

export default class OrdersHeaderView extends JetView{
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

                new TemplateQuickFilters(this.app, 'orders'),
                ButtonFilters,
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
                {$subview: OrdersStatusBar, name: "status_bar"}
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
        this.app.commonWidgets.orders['header'] = this;
    }

    init() {
    }
}
