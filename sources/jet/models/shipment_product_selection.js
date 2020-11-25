"use strict";

import {JetView} from "webix-jet";
import {sipmentsProdSelColumns} from "../variables/shipment_product_selection_dt";
import {balance_processing} from "../models/data_processing";
import ProductCardView from "../models/product_card";



export default class ShipmentSelectionView extends JetView{

    constructor(app, parent, single_selection) {
        super(app);
        this.parent = parent;
        this.s_sel = single_selection;
    }

    config(){
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
                            label: "РЕД",
                            width: 50,
                            tooltip: "Редактировать товар",
                            localId: "__edit",
                            hidden: true,
                            on: {
                                onItemClick: ()=>{
                                    let item = this.$$("__table").getSelectedItem();
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
                            hidden: true,
                            on: {
                                onItemClick: ()=>{
                                    let prod_select = this.ui( new ProductCardView(this.app, this, false));
                                    prod_select.show();
                                }
                            }
                        },

                    ]
                    },
                    {view: "datatable",
                        // summs: undefined,
                        borderless: true,
                        clipboard: true,
                        localId: "__table",
                        navigation: "row",
                        select: "row",
                        // multiselect: true, //если решим делать групповые действия
                        datafetch: 30, //количество записей для подгрузки
                        datathrottle: 10, //время для следующей загрузки
                        loadahead: 40, //количество записей для предзагрузки
                        resizeColumn:true,
                        fixedRowHeight:false,
                        rowLineHeight:28,
                        rowHeight:28,
                        editable: !false,
                        footer: true,
                        url: function(params) {
                            return balance_processing.get_data(params, this);
                        },
                        headermenu:{
                            autowidth: true,
                            scroll: true,
                            autoheight:false,
                            spans: true,
                            yCount: 4
                            },
                        css:"webix_header_border center_dt",
                        scroll: 'xy',
                        tooltip: true,
                        columns: sipmentsProdSelColumns,
                        // leftSplit: 1,
                        sorting: {id: "n_product", dir: "asc"},
                        onClick: {
                            // menubtn:function(e, id, html){
                            //     return this.$scope.callContext(e, this);
                            // }
                        },
                        onContext: {
                            // webix_ss_center: function(e, id){
                            //     return this.$scope.callContext(e, this);
                            // }
                        },
                        on: {
                            onAfterSelect: function() {
                                let i = this.getSelectedId()
                                if (i) {
                                    // this.$scope.$$("__edit").show();
                                } else {
                                    // this.$scope.$$("__edit").hide();
                                }
                            },
                            onAfterLoad: function() {
                                this.markSorting(this.config.sorting.id, this.config.sorting.dir);
                            },
                            onKeyPress: function(code, event) {
                                if (code===13) {
                                    let item = this.getSelectedId();
                                    this.callEvent('onItemDblClick', [item])
                                }
                            },
                            onItemDblClick: function(item) {
                                if (item) {
                                    let new_item = this.getItem(item);
                                    new_item = {
                                        n_id: undefined,
                                        n_balance_id: new_item.n_balance_id,
                                        n_product: new_item.n_product,
                                        n_code: new_item.n_code,
                                        n_unit: "",
                                        n_okei_code: "",
                                        n_type_package: "",
                                        n_amount_mass: "",
                                        n_amount_b: "",
                                        n_gross_weight: "",
                                        n_stock: new_item.n_quantity,
                                        n_amount: 1,
                                        n_charge: "",
                                        n_price: new_item.n_price,
                                        n_vat: new_item.n_vat,
                                        n_novats_summ: "",
                                        n_vats_summ: "",
                                        n_total_summ: "",
                                        n_prod_id: new_item.n_id,
                                    }
                                    if (this.$scope.s_sel) {
                                        let old_item = JSON.parse(JSON.stringify(this.$scope.parent.getItem(this.$scope.s_sel)));
                                        //заменяем товар в родителе, закрываем окно
                                        let q = this.$scope.searchDuplicates(this.$scope.parent, new_item.n_prod_id);
                                        if (q) {
                                            let new_item = this.$scope.parent.getItem(q);
                                            new_item.n_amount += 1;
                                            this.$scope.parent.updateItem(q, new_item)
                                            this.$scope.parent.remove(old_item.id)
                                        } else {
                                            this.$scope.parent.updateItem(this.$scope.s_sel.row, new_item)
                                            if (! old_item.n_prod_id) {
                                                delete old_item.id;
                                                this.$scope.parent.add(old_item)
                                            }
                                        }
                                        this.$scope.hide();
                                    } else {
                                        //добавляем товар в родетеля, окно оставляем открытым
                                        if (this.$scope.parent.config.view === 'datatable') {
                                            let q = this.$scope.searchDuplicates(this.$scope.parent, new_item.n_prod_id);
                                            if (q) {
                                                let new_item = this.$scope.parent.getItem(q);
                                                new_item.n_amount += 1;
                                                this.$scope.parent.updateItem(q, new_item)
                                            } else {
                                                this.$scope.parent.$scope.add_new(new_item);
                                            }
                                        } else {
                                        }

                                    }
                                }

                            }
                        }
                    },
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
        this.$$("__table").clearAll(true);
        this.$$("__table").loadNext(0, 0, 0, 0, 1).then((data)=> {
            if (data) {
                this.$$("__table").clearAll(true);
                this.$$("__table").parse(data);
                this.$$("__table").showItemByIndex(0);
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