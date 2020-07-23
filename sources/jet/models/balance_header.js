"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../views/variables";
import BalanceStatusBar from "../models/balance_status_bar";
import {html_button_template, message} from "../views/common";
import {createPrice} from "../models/data_processing";
// import SearchBar from "../models/search_bar";
// import { message } from "../views/common";
// import {request, checkResponse} from "../views/common";

export default class BalanceHeaderView extends JetView{
    config(){

        let toolbar = {view: 'toolbar',
            borderless: true,
            margin: 0,
            cols: [
                {view: "label", label: "<span class='label_highlited'>Остатки</span>", autowidth: true,
                    css: "label_highlited", hidden: true
                },
                {width: emptyWidth},
                {view: "text",
                    localId: "__search",
                    label: "",
                    name: "_search",
                    labelWidth: 0,
                    // width: ,
                    hidden: !true,
                    on: {
                        onKeyPress: function(code, event) {
                            // if (code ===32 || (code>=48 && code<=90)) {
                                try {
                                    this.delay.clearInterval()
                                } catch(e) {}
                                this.delay = setTimeout(() => {
                                    this.$scope.app.commonWidgets.balance.center_table.getData();
                                    
                                }, 850);
                            // }
                        },
                    },
                },
                // {$subview: SearchBar, name: "search_bar"},
                {},
                {view:"button", type: 'htmlbutton',
                    width: 35,
                    height: 35, 
                    longPress: false,
                    label: "",
                    localId: "__refresh",
                    template: () => {
                        return html_button_template('./library/img/refresh_1.svg', 'Обновить')
                    },
                    on: {
                        onItemClick:  (id, event) => {
                            this.app.commonWidgets.balance.center_table.getData();
                        },
                    }
                },
                {width: emptyWidth},
                {view:"button", type: 'htmlbutton',
                    width: 35,
                    height: 35, 
                    longPress: false,
                    label: "",
                    localId: "__refresh",
                    template: () => {
                        return html_button_template('./library/img/price.svg', 'Выгрузить прайс')
                    },
                    on: {
                        onItemClick:  (id, event) => {
                            createPrice();
                            message('Выгрузка прайса');
                        },
                    }
                },
                {width: emptyWidth},
            ]
        }

        let status = {
            height: 26, 
            borderless: true,
            cols: [
                {width: emptyWidth},
                {width: emptyWidth},
                {width: emptyWidth},
                {$subview: BalanceStatusBar, name: "status_bar"}
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

    getSearch() {
        return {"n_product": this.$$("__search").getValue()};
    }

    ready() {
        this.app.commonWidgets.balance['header'] = this;
    }

    init() {
    }
}
