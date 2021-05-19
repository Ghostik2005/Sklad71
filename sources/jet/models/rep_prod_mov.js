"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../variables/variables";
import {getDatas, set_limit} from "../models/data_processing";
import TemplateProductsRepView from "../models/template_products_report_dt"
import {repProdSelColumns} from "../variables/rep_product_selection_dt";
import {report_processing} from "../models/data_processing";

export default class RepProductsMovView extends JetView{

    constructor(app, parent) {
        super(app);
        this.parent = parent;
    }

    config(){
        let th = this;
        this.table_id = webix.uid();
        let dt = new TemplateProductsRepView(th.app, {
            columns: repProdSelColumns,
            loadFunction: getDatas.product_data,
            sorting: {id: "c_name", dir: "asc"},
            topParent: th,
            name: "_products_",
            id: this.table_id,
            dblClick: function(item) {
                th.$$("__create").callEvent("onItemClick")
            },

        });

        let popup = {
            //view: "popup",
            view: "cWindow",
            loclalId: "_popup",
            width: 420,
            padding: 4,
            point:!true,
            toFront: true,
            relative: true,
            modal: true,
            css: "menu_filters",
            escHide: true,
            on: {
                onShow: () => {
                    // this.loadValues();
                },
                onHide: function() {
                    this.destructor();
                }
            },
            width: document.documentElement.clientWidth*0.6,
            height: document.documentElement.clientHeight*0.8,
            body: {
                rows:[
                    {height: emptyWidth},
                    {cols: [
                        {view:"datepicker",
                            align: "right",
                            localId: "__date1",
                            label: "Начальная дата",
                            value: new Date(),
                            labelWidth:110,
                            width: 230
                        },
                        {width:emptyWidth},
                        {view:"datepicker",
                            align: "right",
                            localId: "__date2",
                            label: "Конечная дата",
                            value: new Date(),
                            labelWidth:100,
                            width: 230
                        },
                        {width:emptyWidth*4},
                        {view: "checkbox",
                            localId: "__arrivals",
                            labelRight: "Приходы",
                            value: 1,
                            labelWidth: 0,
                            labelAlign:"right",
                            width: 120,
                        },
                        {width:10},
                        {view: "checkbox",
                            localId: "__departures",
                            labelRight: "Расходы",
                            value: 1,
                            labelWidth: 0,
                            labelAlign:"right",
                            width: 120,
                        },

                    ]},
                    {cols: [

                        {view: "text",
                            localId: "__search",
                            label: "",
                            name: "_search",
                            labelWidth: 0,
                            width: 450,
                            hidden: !true,
                            on: {
                                onKeyPress: function(code, event) {
                                    // if (code ===32 || (code>=48 && code<=90)) {
                                        clearTimeout(this.delay);
                                        this.delay = setTimeout(() => {
                                            this.$scope.getData();
                                        }, 850);
                                    // }
                                },
                            },
                        },
                    ]
                    },
                    dt,
                    // dattable,
                    {borderless: !true,
                        cols: [
                            {},
                            {view: "button",
                                label: "Сформировать",
                                width: 160,
                                tooltip: "Сформировать отчет",
                                localId: "__create",
                                hidden: true,
                                on: {
                                    onItemClick: ()=>{
                                        let date1 = this.$$("__date1").getValue() || new Date();
                                        let date2 = this.$$("__date2").getValue() || new Date();
                                        let arr_fg = this.$$("__arrivals").getValue();
                                        let dep_fg = this.$$("__departures").getValue();
                                        let item_id = $$(this.table_id).getSelectedItem();
                                        if (item_id) {
                                            item_id = item_id.c_id;
                                            report_processing.new_product_movement(date1, date2, arr_fg, dep_fg, item_id);
                                        }

                                    }
                                }
                            },
                            {view: "button",
                                label: "Закрыть",
                                width: 136,
                                localId: "__apply",
                                on: {
                                    onItemClick: ()=>{
                                        this.hide();
                                    }
                                }
                            },
                        ]
                    },
                ]
            }
        }

        return popup

    }


    getData(){

        let t = $$(this.table_id)
        t.clearAll(true);
        t.loadNext(0, 0, 0, 0, 1).then((data)=> {
            if (data) {
                t.clearAll(true);
                t.parse(data);
                t.showItemByIndex(0);
            }
        })
    }

    getFilter() {
        let re = ''
        try {
            re = this.$$("__search").getValue();
        } catch(e) {
        }
        return re;
    }

    show(header){
        if (header) {
            this.getRoot().getHead().getChildViews()[0].setValue(header);
        }
        this.getRoot().show();

    }

    hide(){
        setTimeout(() => {
            return this.getRoot().hide();
        }, 10);

    }

    ready() {
        this.$$("__search").focus();
    }

    init() {
    }
}