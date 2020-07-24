"use strict";

import {JetView} from "webix-jet";
import {message, holdDocument, saveDocument} from "../views/common";
import {getOrdersDocument, saveOrdersDocument, checkOpened} from "../models/data_processing";
import {dtColumns} from "../models/orders_document_dt";
import {ref_states} from "../views/common";
import ProductSelectionView from "../models/product_selection";
import DocumentHeader from "../models/document_header"



export default class OrderBody extends JetView{

    config(){
        let th = this;
        let ret_view = {
            view:"cWindow",
            localId: "__orderbody",
            width: document.documentElement.clientWidth*0.8,
            height: document.documentElement.clientHeight*0.8,
            padding: 4,
            point: false,
            relative: false,
            modal: false,
            move: true,
            on: {
                onShow: () => {
                    // (this.doc.n_state == 1) ? this.$$("__hold").show() : this.$$("__hold").hide();
                    // (this.doc.n_state == 1) ? this.$$("__add").show() : this.$$("__add").hide();
                    // (this.change == true) ? this.$$("__save").show() : this.$$("__save").hide();
                    // (this.change == true) ? this.$$("__cancel").show() : this.$$("__cancel").hide();
                    this.$$("__table").clearAll();
                    let data = getOrdersDocument(this.doc.n_id)
                    // data.data.push({"n_product": "...добавить"});
                    // console.log('id', data);
                    this.$$("__table").parse(data);
                },
                onHide: () => {
                    checkOpened(this.doc.n_id, true);
                    if (this.focus) webix.UIManager.setFocus(this.focus);
                }
            },
            body: {
                rows:[
                    {
                        $subview: new DocumentHeader(th.app, th, true),
                        localId: "__header",
                    },
                    {
                        view: "datatable",
                        borderless: true,
                        name: "__orders_document",
                        clipboard: true,
                        localId: "__table",
                        // navigation: "row",
                        navigation: true,
                        select: "cell",
                        resizeColumn:true,
                        fixedRowHeight:false,
                        rowLineHeight:28,
                        rowHeight:28,
                        editable: false,
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
                        // url: function() {
                        //     console.log('th', this.$scope.doc.doc_id)
                        //     return getOrdersDocument(this.$scope.doc.doc_id);
                        // },
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
                                this.$scope.setChange();
                            },
                            onLiveEdit: function() {
                                // console.log('edit');
                            },
                            onDataUpdate: function() {
                                this.$scope.setChange();
                            },
                            onItemDblClick: function(item) {
                                return
                                if (this.$scope.doc.n_state == 1) {
                                    let prod_select = this.$scope.ui( new ProductSelectionView(this.$scope.app, this, item));
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
                                hidden: true,
                                on: {
                                    onItemClick: function() {
                                        return
                                        if (this.$scope.doc.n_state == 1) {
                                            let prod_select = this.$scope.ui( new ProductSelectionView(this.$scope.app, this.$scope.$$("__table")));
                                            prod_select.show('Приходный документ. Подбор товара');
                                        }
                                    }
                                }
                            },
                            {},
                            {view: "button",
                                label: "Сохранить",
                                localId: "__save",
                                hidden: true,
                                width: 136,
                                on: {
                                    onItemClick: ()=>{
                                        return
                                        //проверка цены, количества, ставки ндс
                                        let not_saved = saveDocument(this);
                                        if (!not_saved) {
                                            //обновляем данные в таблице
                                            this.setUnchange();
                                            this.hide();
                                        } else {
                                            message(not_saved,"error", 3)
                                        }
                                        return not_saved
                                    }
                                }
                            },
                            {view: "button",
                                localId: "__hold",
                                label: "Провести",
                                width: 136,
                                hidden: true,
                                on: {
                                    onItemClick: ()=>{
                                        return
                                        let not_saved = this.$$("__save").callEvent('onItemClick');
                                        if (!not_saved) {
                                            let r_data = holdDocument('arrival', this.doc.n_id, this.doc.id);
                                            console.log('r_data', r_data);
                                            // return
                                            //////////////делаем изменения в таблице!!!!!!!!!!!!!
                                            if (r_data.data) {
                                                if (this.table) {
                                                    if (!this.flag_new) {
                                                        this.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0]);
                                                    } else {
                                                        message("ищем позицию и апдейтим ее")
                                                    }
                                                }
                                                this.hide();
                                            } else {
                                                message("Ошибка проведения транзакции","error", 3)
                                            }
                                            
                                        }   
                                    }
                                }
                            },
                            {view: "button",
                                width: 136,
                                localId: "__cancel",
                                label: "Отменить",
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
                webix.message("Good!");
                    break;
                case "1":
                webix.message("Why?..");
                    break;
                case "2":
                webix.message("Come back later");
            }   
        });
    }

    show(doc, focus, table) {
        // console.log('header', this.getRoot());
        // console.log('doc', doc);
        this.flag_new = doc.flag_new;
        this.change = false;
        this.focus = focus;
        this.table = table;
        this.doc = doc;
        if (doc) {
            let state_item = ref_states.data.getItem(doc.n_state);
            this.getRoot().getHead().getChildViews()[0].setValue(`<span style="color: ${state_item.color}">(${state_item.value })</span>` + 
            ` Заказ покупателя от ${webix.i18n.dateFormatStr(doc.n_dt_invoice)}, ${doc.n_recipient || ''}`);
            this.getRoot().show();
            return webix.UIManager.setFocus(this.$$("__table"))
        };        
        return false
    }

    validateDocument(th, data){
        let result = false;
        if (!data.header.n_base) result = 'Укажите основание документа';
        if (!data.header.n_number) result = 'Укажите номер документа';
        if (!data.header.n_supplier) result = 'Укажите поставщика';
        if (!data.header.n_recipient) result = 'Укажите получателя';
        if (data.table.length<2) result = 'Добавьте товары';
        for (let i in data.table) {
            let row = data.table[i];
            if (!row.n_code) continue;
            if (!row.n_amount || isNaN(row.n_amount) || +row.n_amount < 0) {
                result = `Неверное количство в строке ${(row.row_num) ? row.row_num+1: ''}`;
            }
            if (!row.n_price || row.n_price <= 0) result = `Неверная цена в строке ${row.row_num+1}`;
        }
        return result
    }

    saveDocumentServer(th, data){
        let result = false
        let r_data = saveOrdersDocument(data, th.doc.id);
        // console.log('r_d', r_data);
        if (!r_data.data || !r_data.data[0]) return "Ошибка записи на сервер";
        if (this.table) {
            if (!this.flag_new) {
                this.table.updateItem(r_data.kwargs.intable, r_data.data[0]);
            } else {
                this.table.add(r_data.data[0], 0);
                // message("добавляем позицию наверх")
            }
        }
        return result

    }


    getHeader() {
        return this.getRoot().getChildViews()[1].getChildViews()[0].$scope
    }

    setHeader() {
        return this.getHeader.setHeader();
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

    recalcTable() {
        let table = this.$$("__table")
        table.blockEvent();
        table.eachRow ((row)=> {
            let item = table.getItem(row);
            if (item.n_code) {
                item.n_novats_summ = item.n_price * item.n_amount
                item.n_vats_summ = item.n_novats_summ * (+item.n_vats_base.replace('%', '').replace('НДС ', '')/100);
                item.n_total_summ = item.n_novats_summ + item.n_vats_summ;
                table.updateItem(row, item);
            }
        })
        table.unblockEvent();
        this.getHeader().recalcHeader(table);
    }

    setUnchange() {
        return
        this.change = false;
        let header = this.getRoot().getHead().getChildViews()[0];
        this.$$("__save").hide();
        header.setValue(header.getValue().replace ('<span class="changed">  изменен</span>', ''))
    }

    setChange() {
        return
        this.change = true;
        //делать пересчет всех значение в таблице!!!!!!!!!
        let header = this.getRoot().getHead().getChildViews()[0];
        this.$$("__save").show();
        let q = header.$view.querySelectorAll('[class="changed"]');
        if (q.length === 0) header.setValue(header.getValue() + '<span class="changed">  изменен</span>')
        this.recalcTable()
    }

    ready() {
        webix.UIManager.addHotKey("enter", function(view){
            var pos = view.getSelectedId();
            view.edit(pos);
        }, this.$$("__table"));
    }

    init() {
        this.doc_type = "Заказ покупателя"

    }
}