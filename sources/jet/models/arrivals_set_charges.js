"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../variables/variables"
import {balance_processing} from "../models/data_processing";
import {formatText} from "../views/common";
import {dtColumns} from "../variables/arrivals_charge_price_dt"




export default class ChargesView extends JetView{

    constructor(app, parent, ids) {
        super(app);
        this.parent = parent;
        this.ids = ids
    }

    config(){

        let header = {
            localId: "__header-form",
            borderless: true,
            rows: [
                {view: "text",
                    name: "n_id",
                    localId: "__n_id",
                    disabled: true,
                    width: 0,
                    hidden: true
                },
                {height: emptyWidth},
                {rows: [
                    {template: "Итого по документу", type: "section"},
                    {cols:[
                        {view: "text", label: "Наценка, %",
                            value: "",
                            format: "1111.00",
                            labelPosition: "top",
                            localId: "__charge",
                            disabled: !true,
                            name: "n_charge",
                            labelWidth: 100,
                            on: {
                                onChange: ()=> {
                                    this.recalcTable('all')
                                }
                            }
                        },
                        {view: "text", label: "Сумма документа", labelWidth: 120,
                            format: formatText,
                            labelPosition: "top",
                            disabled: true,
                            localId: "__sum",
                        },
                        {width: emptyWidth},
                        {view: "text", label: "Сумма в прайс", labelWidth: 120,
                            format: formatText,
                            labelPosition: "top",
                            disabled: true,
                            localId: "__sum_price",
                        },
                        {width: emptyWidth},
                        {view: "text", label: "Количество позиций", labelWidth: 135,
                            disabled: true,
                            labelPosition: "top",
                            localId: "__pos"
                        },
                    ]}
                ]},
                // {height: emptyWidth*3},
                {rows: [
                    {view: "text",
                        disabled: true,
                        value: "",
                        label: "Поставщик",
                        labelPosition: "top",
                        name: "n_supplier",
                        localId: "__supplier",
                        labelWidth: 0,
                    },
                ]},

            ],

        }

        let dt = {view: "datatable",
            borderless: true,
            name: "__shipments_document",
            clipboard: true,
            localId: "__table",
            // navigation: "row",
            navigation: true,
            select: "cell",
            resizeColumn:true,
            fixedRowHeight:false,
            rowLineHeight:28,
            rowHeight:28,
            editable: !false,
            editaction: "custom",
            footer: true,
            headermenu:{
                autowidth: true,
                scroll: true,
                autoheight:false,
                spans: true,
                yCount: 4
            },
            data: {},
            css:"webix_header_border center_dt",
            scroll: 'xy',
            tooltip: true,
            columns: dtColumns,
            on: {
                onItemClick: function(pos) {
                    this.editCell(pos.row, pos.column)
                },
                onDataUpdate: function(row, new_item, old_item) {
                    if (new_item.n_charge && old_item.n_charge != new_item.n_charge) {
                        this.$scope.recalcTable('charge');
                    } else if (new_item.n_price_price && old_item.n_price_price != new_item.n_price_price) {
                        this.$scope.recalcTable('price');
                    } else {
                    }
                },
            }
        }



        let popup = {
            //view: "popup",
            view: "cWindow",
            loclalId: "_popup",
            // width: 420,
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
                    header,
                    dt,
                    {borderless: !true,
                        cols: [
                            {},
                            {view: "button",
                                label: "Установить",
                                width: 136,
                                localId: "__apply",
                                on: {
                                    onItemClick: ()=>{
                                        let v = this.validate();
                                        if (v) {
                                            let r = balance_processing.set_charge({
                                                table: this.$$("__table").serialize(),
                                                doc_id:this.$$("__n_id").getValue()
                                            });
                                            if (r) this.hide();
                                        } else {
                                            document.message('Устанвите наценки, иначе товар не попадет в прайс', 'error', 5)
                                        }
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

    validate() {
        let table = this.$$("__table");
        let result = true;
        table.mapCells(null, "n_price_price", null, 1, function(value){
            let v = +value;
            if (isNaN(v)) result = false
            // result+=v;
            return value;
        });
        return result
    }

    getSum(master, columnId) {
        let result = 0;
        master.mapCells(null, columnId, null, 1, function(value){
            let v = +value
            if (!isNaN(v))
            result+=v;
            return value;
        });
        return result
    }

    show(header){
        if (header) {
            this.getRoot().getHead().getChildViews()[0].setValue(header);
        }
        this.getRoot().getHead().getChildViews()[1].hide();
        // получамем данные с сервера
        let rows = balance_processing.get_all(this.ids);
        this.getRoot().show();
        this.$$("__n_id").setValue(this.parent.doc.n_id);
        let c_data = this.parent.$$("__table").serialize();
        this.$$("__table").clearAll();
        rows.data.forEach( (item)=> {
            let new_item = {
                n_id: item.n_id,
                n_amount: item.n_amount,
                n_price: item.n_price,
                n_total_summ: item.n_total_summ,
                n_product: item.n_product
            }

            this.$$("__table").add(new_item)
        })
        webix.UIManager.addHotKey("enter", function(view){
            var pos = view.getSelectedId();
            view.edit(pos);
        }, this.$$("__table"));
        this.$$("__charge").focus();
    }

    recalcTable(elem) {
        let table = this.$$("__table");
        table.blockEvent();
        if (elem == 'all') {
            let charge = +this.$$("__charge").getValue()
            table.eachRow ((row)=> {
                let item = table.getItem(row);
                item.n_charge = charge;
                item.n_price_price = item.n_price*(+item.n_charge+100)/100;
                item.n_total_price_summ = item.n_price_price * item.n_amount
                item.n_total_summ = item.n_price*item.n_amount;
                table.updateItem(row, item);
            })
        } else if (elem == "charge") {
            table.eachRow ((row)=> {
                let item = table.getItem(row);
                let charge = item.n_charge;
                if (charge!=undefined && !isNaN(charge)) {
                    item.n_charge = (+charge).toFixed(2);
                    item.n_price_price = (item.n_price*(+charge+100)/100).toFixed(0);
                    item.n_total_price_summ = item.n_price_price * item.n_amount
                    item.n_total_summ = item.n_price*item.n_amount;
                    table.updateItem(row, item);
                }
            })
            this.$$("__charge").blockEvent();
            let pr = this.getSum(table, "n_price");
            let sh_pr = this.getSum(table, "n_price_price");
            this.$$("__charge").setValue( (pr <= sh_pr) ? charge.toFixed(2): "");
            this.$$("__charge").unblockEvent();
        } else if (elem == "price") {
            table.eachRow ((row)=> {
                let item = table.getItem(row);
                let charge = (item.n_price_price/item.n_price)*100-100;
                if ( !isNaN(charge) ) {
                    item.n_charge = charge.toFixed(2);
                    item.n_total_price_summ = item.n_price_price * item.n_amount
                    item.n_total_summ = item.n_price*item.n_amount;
                    table.updateItem(row, item);
                }
            })
            this.$$("__charge").blockEvent();
            let pr = this.getSum(table, "n_price");
            let sh_pr = this.getSum(table, "n_price_price");
            let charge = (sh_pr/pr)*100 - 100;
            this.$$("__charge").setValue( (pr <= sh_pr) ? charge.toFixed(2): "");
            this.$$("__charge").unblockEvent();
        }
        table.unblockEvent();
        this.$$("__sum").setValue(this.getSum(table, "n_total_summ"));
        this.$$("__pos").setValue(this.getSum(table, "n_amount"));
        this.$$("__sum_price").setValue(this.getSum(table ,"n_total_price_summ"));
    }

    hide(){
        setTimeout(() => {
            return this.getRoot().hide();
        }, 10);

    }

    ready() {
    }

    init() {
    }
}