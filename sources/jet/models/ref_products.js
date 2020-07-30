"use strict";

import {JetView} from "webix-jet";
import {message} from "../views/common";
import {productSelectionGetData} from "../models/data_processing";
import ProductCardView from "../models/product_card";
import TemplateProductsView from "../models/template_products_dt"
import {refProdSelColumns} from "../models/ref_product_selection_dt";

export default class RefProductsView extends JetView{

    constructor(app, parent) {
        super(app);
        this.parent = parent;
    }

    config(){
        let th = this;
        this.table_id = webix.uid();
        let dt = new TemplateProductsView(th.app, {
            columns: refProdSelColumns,
            loadFunction: productSelectionGetData,
            sorting: {id: "c_name", dir: "asc"},
            topParent: th,
            id: this.table_id,
            dblClick: function(item) {
                th.$$("__edit").callEvent("onItemClick")
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
                        {},
                        {view: "button",
                            label: "edit",
                            width: 50,
                            tooltip: "Редактировать товар",
                            localId: "__edit",
                            hidden: true,
                            on: {
                                onItemClick: ()=>{
                                    // let item = this.$$("__table").getSelectedItem();
                                    let item = $$(this.table_id).getSelectedItem();
                                    let prod_select = this.ui( 
                                        new ProductCardView(this.app, this, {c_id: item.c_id, c_name: item.c_name, id: item.id})
                                    );
                                    prod_select.show();
                                }
                            }
                        },
                        {view: "button",
                            label: "add",
                            width: 50,
                            tooltip: "Добавить товар",
                            localId: "__add",
                            on: {
                                onItemClick: ()=>{
                                    let prod_select = this.ui( new ProductCardView(this.app, this, false));
                                    prod_select.show();
                                }
                            }
                        },

                    ]
                    },
                    dt,
                    // dattable,
                    {borderless: !true,
                        cols: [
                            {},
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

    searchDuplicates(table, item_id) {
        let d_id;
        table.eachRow( (row)=> {
            let item = table.getItem(row);
            if (item.n_prod_id && (item.n_prod_id.toString() === item_id.toString())) d_id = row;
        })
        return d_id;
    }

    getData(){
        // let t = this.$$("__table")
        let t = $$(this.table_id)
        t.clearAll(true);
        t.loadNext(0, 0, 0, 0, 1).then((data)=> {
            // console.log('data1', data);
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
            // console.log('e', e)
        }
        return re;
    }

    show(header){
        // console.log(header)
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