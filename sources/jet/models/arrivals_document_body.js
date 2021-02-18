"use strict";

import {JetView} from "webix-jet";
import {checks, documentProcessing} from "../models/data_processing";
import {dtColumns} from "../variables/arrivals_document_dt";
import DocumentHeader from "../models/document_header"
import ChargesView from "../models/arrivals_set_charges";
import ProductSelectionView from "../models/product_selection";
import {newReport} from "../models/common_functions";

let states = document.app.states;

export default class ArrivalBody extends JetView{

    constructor(app) {
        super(app);
    }

    config(){
        let th = this;
        let app = this.app;

        let ret_view = {
            view:"cWindow",
            localId: "__arrivalbody",
            width: document.documentElement.clientWidth*0.9,
            height: document.documentElement.clientHeight*0.9,
            padding: 4,
            point: false,
            relative: false,
            modal: false,
            move: true,
            on: {
                onShow: () => {
                    (this.doc.n_state == 1) ? this.$$("__hold").show() : this.$$("__hold").hide();
                    (this.doc.n_state == 1) ? this.$$("__add").show() : this.$$("__add").hide();
                    (this.change == true) ? this.$$("__save").show() : this.$$("__save").hide();
                    // (this.change == true) ? this.$$("__cancel").show() : this.$$("__cancel").hide();
                    this.$$("__table").clearAll();
                    let data = documentProcessing.get(this.doc.n_id, "arrivals")
                    // console.log('dd', this.doc);
                    if (this.doc.n_state == 1) data.data.push({"n_product": "...добавить"});
                    this.$$("__table").parse(data);
                },
                onHide: () => {
                    checks.opened(this.doc.n_id, true);
                    if (this.focus) webix.UIManager.setFocus(this.focus);
                }
            },
            body: {
                rows:[
                    new DocumentHeader(app, th),
                    {view: "datatable",
                        borderless: true,
                        name: "__arrivals_document",
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
                        // editaction: "custom",
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
                            onKeyPress: function(code, event) {
                                if (event.key === "Delete") {
                                    let pos = this.getSelectedId();
                                    this.remove(pos)
                                }
                            },
                            onAfterDelete: function() {
                                th.setChange();
                            },
                            onLiveEdit: function() {
                            },
                            onDataUpdate: function(row_id, new_val, old_val) {
                                let col_change;
                                if (new_val.n_total_summ != old_val.n_total_summ) col_change = 'n_total_summ'
                                else if (new_val.n_proci != old_val.n_price) col_change = 'n_price'
                                th.setChange(col_change);
                            },
                            onItemClick: function(row, ev) {
                                let item = this.getItem(row)
                                if (item.n_product == '...добавить') {
                                    this.callEvent('onItemDblClick', [row,])
                                }
                            },
                            onItemDblClick: function(item) {
                                if (th.doc.n_state == 1) {
                                    let prod_select = th.ui( new ProductSelectionView(app, this, item));
                                    prod_select.show('Приходный документ. Подбор товара');
                                }
                            },
                        }
                    },
                    {borderless: !true,
                        padding: 3,
                        cols: [
                            {view: "button",
                                width: 136,
                                localId: "__add",
                                label: "подобрать товар",
                                on: {
                                    onItemClick: function() {
                                        if (th.doc.n_state == 1) {
                                            let prod_select = th.ui( new ProductSelectionView(app, th.$$("__table")));
                                            prod_select.show('Приходный документ. Подбор товара');
                                        }
                                    }
                                }
                            },
                            {view: "button",
                                localId: "__report",
                                label: "Печать",
                                width: 136,
                                on: {
                                    onItemClick: ()=>{
                                        if (this.doc.n_state != 2) {
                                            let not_saved = this.$$("__save").callEvent('onItemClick');
                                            if (!not_saved) {
                                                newReport.document(this, "arrival", this.doc);
                                            }
                                        } else {
                                            newReport.document(this, "arrival", this.doc);
                                        }
                                    }
                                }
                            },
                            {},
                            {view: "button",
                                label: "Сохранить",
                                localId: "__save",
                                width: 136,
                                on: {
                                    onItemClick: ()=>{
                                        //проверка цены, количества, ставки ндс
                                        let not_saved = app.getService("common").saveDocument(this);
                                        if (!not_saved) {
                                            //обновляем данные в таблице
                                            this.setUnchange();
                                            this.flag_new = false;
                                        } else {
                                            document.message(not_saved,"error", 3)
                                        }
                                        return not_saved
                                    }
                                }
                            },
                            {view: "button",
                                localId: "__hold",
                                label: "Провести",
                                width: 136,
                                on: {
                                    onItemClick: ()=>{
                                        let not_saved = this.$$("__save").callEvent('onItemClick');
                                        if (!not_saved) {
                                            // console.log('doc', this.doc);
                                            // console.log('doc.id', this.doc.id);
                                            let r_data = app.getService("common").holdDocument('arrival', this.doc.n_id, this.doc.id);
                                            //////////////делаем изменения в таблице!!!!!!!!!!!!!
                                            if (r_data.data) {
                                                if (this.table) {
                                                    if (!this.flag_new) {
                                                        this.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0]);
                                                    } else {
                                                        document.message("ищем позицию и апдейтим ее")
                                                    }
                                                }
                                                this.hide();
                                                // ////////не делаем наценки!!!!!
                                                // let q = this.ui(new ChargesView(app, this, r_data.data1))
                                                // q.show('Установка наценок для прайса')
                                            } else {
                                                document.message("Ошибка транзакции при проведении документа","error", 3)
                                            }

                                        }
                                    }
                                }
                            },
                            {view: "button",
                                width: 136,
                                localId: "__cancel",
                                label: "Закрыть",
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
        return ret_view
    }

    getConfirm(){
        let result = "1";
        result = webix.modalbox({
            title:"Документ был изменен",
            type:"confirm-warning",
            buttons:["Да", "Нет", "Отменить"],
            text:"сохранить изменения?",
            width:500
        }).then(function(result){
            switch(result){
                case "0":
                    document.message("Good!");
                    break;
                case "1":
                    document.message("Why?..");
                    break;
                case "2":
                    document.message("Come back later");
                    break;
            }
        });
    }

    show(doc, focus, table) {
        this.flag_new = doc.flag_new;
        this.change = false;
        this.focus = focus;
        this.table = table;
        this.doc = doc;
        if (doc) {
            let state_item = states[doc.n_state];
            this.getRoot().getHead().getChildViews()[0].setValue(`<span style="color: ${state_item.color}">(${state_item.value })</span>` +
            ` Приходный документ №${doc.n_number || ''} от ${webix.i18n.dateFormatStr(doc.n_dt_invoice)}, ${doc.n_supplier || ''}`);
            this.getRoot().show();
            return webix.UIManager.setFocus(this.$$("__table"))
        };
        return false
    }

    validateDocument(th, data){
        let result = false;
        // if (!data.header.n_base) result = 'Укажите основание документа';
        if (!data.header.n_number) result = 'Укажите номер документа';
        if (!data.header.n_supplier) result = 'Укажите поставщика';
        if (!data.header.n_recipient) result = 'Укажите получателя';
        if (data.table.length<2) result = 'Добавьте товары';
        for (let i in data.table) {
            let row = data.table[i];
            if (!row.n_code) continue;
            if (!row.n_amount || isNaN(row.n_amount) || +row.n_amount < 0) {
                result = `Неверное количество в строке ${(row.row_num) ? row.row_num+1: ''}`;
            }
            if (!row.n_price || row.n_price <= 0) result = `Неверная цена в строке ${row.row_num+1}`;
            if (!row.n_consignment) result = `Укажите партию в строке ${row.row_num+1}`;
        }
        return result
    }

    saveDocumentServer(th, data){
        let result = false
        let r_data = documentProcessing.save(data, th.doc.id, 'arrivals');
        if (!r_data.data || !r_data.data[0]) return "Ошибка записи на сервер";
        this.doc = r_data.data[0];
        this.getHeader().$$("__n_id").setValue(this.doc.n_id);
        // this.getRoot().getChildViews()[1].getChildViews()[0].$scope.$$("__n_id").setValue(this.doc.n_id)
        if (this.table) {
            if (!this.flag_new) {
                r_data.data[0]['id'] = r_data.kwargs.intable;
                this.table.updateItem(r_data.kwargs.intable, r_data.data[0]);
            } else {
                // document.message("добавляем позицию наверх")
                this.table.add(r_data.data[0], 0);
            }
        }
        return result

    }


    getHeader() {
        return this.getRoot().getChildViews()[1].getChildViews()[0].$scope
    }

    setHeader() {
        return this.getHeader().setHeader();
    }

    hide(){
        // if (this.change) {
            // this.getConfirm()
        // }
        this.$$("__table").clearAll();
        return this.getRoot().hide()
    }

    add_new(item) {
        let last_row = this.$$("__table").count()
        this.$$("__table").add(item, last_row-1);
        this.setChange();
        this.recalcTable();

    }

    recalcTable(col_change) {
        let table = this.$$("__table")
        table.blockEvent();
        table.eachRow ((row)=> {
            let item = table.getItem(row);
            if (item.n_code) {
                if (col_change !='n_price') {
                    item.n_vats_summ = 0 // item.n_novats_summ * (+item.n_vats_base.replace('%', '').replace('НДС ', '')/100);
                    item.n_novats_summ = item.n_total_summ - item.n_vats_summ;
                    item.n_novats_summ = item.n_price = item.n_novats_summ / item.n_amount;
                } else {
                    item.n_novats_summ = item.n_price * item.n_amount;
                    item.n_vats_summ = 0 // item.n_novats_summ * (+item.n_vats_base.replace('%', '').replace('НДС ', '')/100);
                    item.n_total_summ = item.n_novats_summ + item.n_vats_summ;
                }

                table.updateItem(row, item);
            }
        })
        table.unblockEvent();
        this.getHeader().recalcHeader(table);
    }

    setUnchange() {
        this.change = false;
        let header = this.getRoot().getHead().getChildViews()[0];
        this.$$("__save").hide();
        header.setValue(header.getValue().replace ('<span class="changed">  изменен</span>', ''))
    }

    setChange(col_change) {
        this.change = true;
        //делать пересчет всех значение в таблице!!!!!!!!!
        let header = this.getRoot().getHead().getChildViews()[0];
        this.$$("__save").show();
        let q = header.$view.querySelectorAll('[class="changed"]');
        if (q.length === 0) header.setValue(header.getValue() + '<span class="changed">  изменен</span>')
        this.recalcTable(col_change)
    }

    ready() {
        webix.UIManager.addHotKey("enter", function(view){
            var pos = view.getSelectedId();
            view.edit(pos);
        }, this.$$("__table"));
    }

    init() {
        this.con_count = 0;
        this.doc_type = "Приходная накладная"
        this._block = 'recipient'

    }
}