"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../variables/variables";
import {createPrice} from "../models/data_processing";
import TemplateRefreshButton from "../models/template_refresh_button";
import TemplateStatusBar from "../models/template_status_bar";

export default class BalanceHeaderView extends JetView{

    constructor(app, name) {
        super(app);
        this.view_name = name;
        this.app.commonWidgets[name]['header'] = this;
    }

    config(){
        let l_this = this;
        let app = this.app;
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
                                clearTimeout(this.delay);
                                this.delay = setTimeout(() => {

                                    app.commonWidgets.balances.center_table.getData();

                                }, 850);
                            // }
                        },
                    },
                },
                // {$subview: SearchBar, name: "search_bar"},
                {},
                new TemplateRefreshButton(this.app, 'balances'),
                {width: emptyWidth},
                {view:"button", type: 'htmlbutton',
                    width: 35,
                    height: 35,
                    longPress: false,
                    label: "",
                    localId: "__price_upl",
                    template: () => {
                        return  app.getService("common").html_button_template('./library/img/price.svg', 'Выгрузить прайс')
                    },
                    on: {
                        onItemClick:  (id, event) => {
                            createPrice();
                            document.message('Выгрузка прайса');
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
                new TemplateStatusBar(app, l_this.view_name),
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
        try {
            return {"n_product": this.$$("__search").getValue()}
        } catch(e){
            return {}
        }

    }

    ready() {

    }

    init() {

    }
}
