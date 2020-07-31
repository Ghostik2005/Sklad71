"use strict";

import {JetView} from "webix-jet";
import {getShipmentsDocument, saveShipmentsDocument, getOrdersDocumentShip, checkOpened} from "../models/data_processing";
import {dtColumns} from "../variables/shipments_document_dt";
import ShipmentSelectionView from "../models/shipment_product_selection";
import DocumentHeader from "../models/document_header"
let states = document.app.states;


export default class ShipmentsBody extends JetView{

    config(){
        let th = this;
        let app = this.app;
        let ret_view = {
            view:"cWindow",
            localId: "__shipmentbody",
            width: document.documentElement.clientWidth*0.8,
            height: document.documentElement.clientHeight*0.8,
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
                    let data;
                    if (this.base){
                        //получаем документ с сервера и парсим его в таблицу
                        data = getOrdersDocumentShip(this.base);
                    } else {
                        data = getShipmentsDocument(this.doc.n_id);
                    }
                    this.$$("__table").clearAll();
                    data.data.push({"n_product": "...добавить"});
                    this.$$("__table").parse(data);
                    setTimeout(() => {
                        if (this.getHeader().recalcHeader) this.getHeader().recalcHeader(this.$$("__table"));    
                    }, 100);
                    let table = this.$$("__table");
                    table.eachRow( (row) => {
                        let item = table.getItem(row);
                        if (item.warning) table.addCss(row, 'warning')
                    })
                },
                onHide: () => {
                    checkOpened(this.doc.n_id, true);
                    if (this.focus) webix.UIManager.setFocus(this.focus);
                }
            },
            body: {
                localId: "__body",
                rows:[
                    {cols:[
                        {view: "text",
                            width: 250,
                            label: "Наценка на документ, %",
                            value: "",
                            localId: "__charge",
                            name: "n_charge",
                            labelWidth: 150,
                            on: {
                                onChange: function() {
                                }
                            }
                        },
                        {}
                    ]},
                    {
                        $subview: new DocumentHeader(app, th),
                        localId: "__header",
                    },
                    {
                        view: "datatable",
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
                            onAfterLoad: function () {
                                let c = this.count();
                                if (c > 1 ) {
                                    th.recalcTable();
                                }
                            },
                            onAfterAdd: () => {
                            },
                            onAfterDelete: () => {
                            },
                            onDataUpdate: function() {
                                th.setChange();
                            },
                            onItemDblClick: function(item) {
                                if (th.doc.n_state == 1) {
                                    let prod_select = th.ui( new ShipmentSelectionView(app, this, item));
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
                                            let prod_select = th.ui( new ShipmentSelectionView(app, th.$$("__table")));
                                            prod_select.show('Приходный документ. Подбор товара');
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
                                            this.setUnChange();
                                            // this.hide();
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
                                            let r_data = app.getService("common").holdDocument('shipment', this.doc.n_id, this.doc.id);
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
                                            } else {
                                                document.message("Ошибка проведения транзакции","error", 3)
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
        this.base = doc.order_id;
        this.change = false;
        this.focus = focus;
        this.table = table;
        this.doc = doc;
        if (doc) {
            let state_item = states[doc.n_state];
            this.getRoot().getHead().getChildViews()[0].setValue(`<span style="color: ${state_item.color}">(${state_item.value })</span>` + 
            ` Отгрузка №${doc.n_number || ''} от ${webix.i18n.dateFormatStr(doc.n_dt_invoice)}, ${doc.n_supplier || ''}`);
            this.getRoot().show();
            webix.UIManager.setFocus(this.$$("__table"))
        };
        if (this.doc.n_state==2) {
            this.$$("__table").disable();
            this.$$("__charge").disable();
            
        }
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
            if (row.n_stock < row.n_amount) result = `Количество на складе меньше чем в заказе в строке ${row.row_num+1}`;
            if (!row.n_price || row.n_price <= 0) result = `Неверная цена в строке ${row.row_num+1}`;
        }
        return result
    }

    saveDocumentServer(th, data){
        let result = false
        let r_data = saveShipmentsDocument(data, th.doc.id);
        if (!r_data.data || !r_data.data[0]) return "Ошибка записи на сервер";
        if (this.table) {
            if (!this.flag_new) {
                this.table.updateItem(r_data.kwargs.intable, r_data.data[0]);
            } else {
                this.table.add(r_data.data[0], 0);
            }
        }
        return result

    }


    getHeader() {
        return this.getRoot().getChildViews()[1].getChildViews()[1].$scope
    }

    setHeader() {
        return this.getHeader.setHeader();
    }

    hide(){
        // if (this.change) {
        //     this.getConfirm()
        // }
        this.$$("__table").clearAll();
        return this.getRoot().hide()
    }

    add_new(item) {
        let last_row = this.$$("__table").count();
        this.$$("__table").add(item, last_row-1);
        this.setChange();
        this.recalcTable();

    }

    recalcTable() {
        let table = this.$$("__table")
        function getSum(columnId) {
            let result = 0;
            table.mapCells(null, columnId, null, 1, function(value){
                let v = +value
                if (!isNaN(v))
                result+=v;
                return value;
            });
            return result
        }
    
        table.blockEvent();
        table.eachRow ((row)=> {
            let item = table.getItem(row);
            if (item.n_stock < item.n_amount) {
                table.addCss(row, 'warning');
            } else {
                table.removeCss(row, 'warning')
            }
            if (item.n_code) {
                item.n_ship_price = item.n_price*(+item.n_charge+100)/100;
                item.n_novats_summ = item.n_ship_price * item.n_amount
                item.n_vats_summ = item.n_amount * (item.n_vat *(+item.n_charge+100)/100);
                item.n_total_summ = item.n_novats_summ + item.n_vats_summ;
                table.updateItem(row, item);
            }
        })
        let pr = getSum("n_price");
        let sh_pr = getSum("n_ship_price");
        let charge = (sh_pr/pr)*100 - 100;
        this.$$("__charge").setValue(charge.toFixed(2));
        table.unblockEvent();
        if (this.getHeader().recalcHeader) this.getHeader().recalcHeader(table);
        
    }

    setUnChange() {
        this.change = false;
        let header = this.getRoot().getHead().getChildViews()[0];
        this.$$("__save").hide();
        header.setValue(header.getValue().replace ('<span class="changed">  изменен</span>', ''))
    }

    setChange() {
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
        this.doc_type = "Отгрузка"
        this._block = 'supplier'

    }
}