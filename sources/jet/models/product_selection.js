"use strict";

import {JetView} from "webix-jet";
import {getDatas} from "../models/data_processing";
import ProductCardView from "../models/product_card";
import TemplateProductsView from "../models/template_products_dt"
import {prodSelColumns} from "../variables/product_selection_dt";


export default class ProductSelectionView extends JetView{

    constructor(app, parent, single_selection) {
        super(app);
        this.parent = parent;
        this.s_sel = single_selection;
    }

    config(){
        let th = this;
        this.table_id = webix.uid();
        let dt = new TemplateProductsView(th.app, {
            columns: prodSelColumns,
            loadFunction: getDatas.product_data,
            sorting: {id: "c_name", dir: "asc"},
            topParent: th,
            id: this.table_id,
            dblClick: function(item, table) {
                // console.log('tab', th.parent);
                if (item) {
                    // let new_item = this.getItem(item);
                    let new_item = table.getItem(item);
                    let doc_num = th.parent.$scope.getHeader().$$("__number").getValue();
                    let doc_dt = th.parent.$scope.getHeader().$$("__date").getValue();
                    doc_dt = webix.Date.dateToStr("%d%m%y")(doc_dt)
                    let cons = `${doc_num}:${doc_dt}`
                    new_item = {
                        n_id: undefined,
                        n_product: new_item.c_name,
                        n_code: new_item.c_code,
                        n_unit: 'шт.',
                        n_okei_code: '',
                        n_type_package: '',
                        n_amount_mass: '',
                        n_amount_b: '',
                        n_gross_weight: '',
                        n_amount: 1,
                        n_price: '',
                        n_novats_summ: '',
                        n_vats_base: new_item.c_vat,
                        n_vats_summ: '',
                        n_total_summ: '',
                        n_prod_id: new_item.c_id,
                        n_consignment: (th.parent.$scope.doc_type == "Ввод остатков") ? 'остатки' : cons
                    }
                    let o_i = th.parent.getItem(th.s_sel);
                    let old_item = (o_i) ? JSON.parse(JSON.stringify(o_i)): {}
                    let q = th.searchDuplicates(th.parent, new_item.n_prod_id);
                    if (q) {
                        th.parent.$scope.con_count += 1;
                        new_item.n_consignment = new_item.n_consignment + `_${th.parent.$scope.con_count}`
                        if (th.s_sel) {
                            th.parent.updateItem(th.s_sel.row, new_item);
                            if (! old_item.n_prod_id) {
                                delete old_item.id;
                                th.parent.add(old_item)
                            }
                        } else {
                            th.parent.$scope.add_new(new_item);
                        }
                        // new_item = th.parent.getItem(q);
                        // new_item.n_amount += 1;
                        // th.parent.updateItem(q, new_item);
                        // if (th.s_sel && q != old_item.id) th.parent.remove(old_item.id)
                    } else {
                        if (th.s_sel) {
                            th.parent.updateItem(th.s_sel.row, new_item);
                            if (! old_item.n_prod_id) {
                                delete old_item.id;
                                th.parent.add(old_item)
                            }
                        } else {
                            th.parent.$scope.add_new(new_item);
                        }
                    };
                    if (th.s_sel) th.hide();
                }
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
                            label: "Ред.",
                            width: 50,
                            tooltip: "Редактировать товар",
                            localId: "__edit",
                            hidden: true,
                            on: {
                                onItemClick: ()=>{
                                    let item = $$(this.table_id).getSelectedItem();
                                    let prod_select = this.ui(
                                        new ProductCardView(this.app, this, {c_id: item.c_id, c_name: item.c_name, id: item.id})
                                    );
                                    prod_select.show();
                                }
                            }
                        },
                        {view: "button",
                            label: "доб.",
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
        // return d_id;
        table.eachRow( (row)=> {
            let item = table.getItem(row);
            if (item.n_prod_id && (item.n_prod_id.toString() === item_id.toString())) d_id = row;
        })
        return d_id;
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