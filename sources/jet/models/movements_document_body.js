"use strict";

import {JetView} from "webix-jet";
import {checks, documentProcessing} from "../models/data_processing";
import {dtColumns} from "../variables/movements_document_dt";
import MovementSelectionView from "../models/movement_product_selection";
import DocumentHeader from "../models/document_header";
import {newReport} from "../models/common_functions";
let states = document.app.states;


export default class MovementsBody extends JetView{

    config(){
        let th = this;
        let app = this.app;
        let ret_view = {
            view:"cWindow",
            localId: "__movementbody",
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
                    let data;
                    if (this.base){
                        //получаем документ с сервера и парсим его в таблицу
                        data = documentProcessing.get_on_order(this.base);
                    } else {
                        data = documentProcessing.get(this.doc.n_id, "movements");
                    }
                    this.$$("__table").clearAll();
                    if (this.doc.n_state == 1) data.data.push({"n_product": "...добавить"});
                    this.$$("__table").parse(data);
                    setTimeout(() => {
                        if (this.getHeader().recalcHeader)
                            this.getHeader().recalcHeader(this.$$("__table"));
                    }, 10);
                    setTimeout(() => {
                        this.setChange();
                        // this.setRelease();
                    }, 1500);
                    let table = this.$$("__table");
                    table.eachRow( (row) => {
                        let item = table.getItem(row);
                        if (item.warning) table.addCss(row, 'warning')
                    })
                },
                onHide: () => {
                    checks.opened(this.doc.n_id, true);
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
                        {width: 25},
                        {view: "text",
                            width: 250,
                            disabled: true,
                            labelWidth: 100,
                            label: "Лимит точки",
                            value: "",
                            localId: "__limit",
                            name: "n_limit",
                        },
                        {width: 25},
                        {view: "text",
                            width: 250,
                            disabled: true,
                            label: "Отпущено на точку",
                            value: "",
                            localId: "__release_total",
                            name: "n_release_total",
                            labelWidth: 120,
                        },
                        {width: 25},
                        {view: "text",
                            width: 320,
                            disabled: true,
                            label: "Отпущено на точку по документу",
                            value: "",
                            localId: "__release",
                            name: "n_release",
                            labelWidth: 220,
                        },
                        {}
                    ]},
                    new DocumentHeader(app, th),
                    {view: "datatable",
                        borderless: true,
                        name: "__movements_document",
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
                                    th.setChange();
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
                            onItemClick: function(row, ev) {
                                let item = this.getItem(row)
                                if (item.n_product == '...добавить') {
                                    this.callEvent('onItemDblClick', [row,])
                                }
                            },
                            onItemDblClick: function(item) {
                                if (th.doc.n_state == 1) {
                                    let prod_select = th.ui( new MovementSelectionView(app, this, item));
                                    prod_select.show('Перемещение. Подбор товара');
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
                                            let prod_select = th.ui( new MovementSelectionView(app, th.$$("__table")));
                                            prod_select.show('Перемещение. Подбор товара');
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
                                                newReport.document(this, "movement", this.doc);
                                            }
                                        } else {
                                            newReport.document(this, "movement", this.doc);
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
                                            let r_data = app.getService("common").holdDocument('movement', this.doc.n_id, this.doc.id);
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

    setRelease() {
        let point = this.getHeader().$$("__recipient");
        let v = point.getValue();
        let l = point.getList();
        let item = l.getItem(v)
        if (item && Number.isInteger(item.n_limit)) {
            this.n_limit = item.n_limit
            this.n_release = item.n_release
            this.$$("__limit").setValue(webix.Number.formatNumber(this.n_limit));
            this.$$("__release_total").setValue(webix.Number.formatNumber(this.n_release));
        }

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
            ` Перемещение №${doc.n_number || ''} от ${webix.i18n.dateFormatStr(doc.n_dt_invoice)}, ${doc.n_supplier || ''}`);
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
        // if (!data.header.n_base) result = 'Укажите основание документа';
        if (!data.header.n_number) result = 'Укажите номер документа';
        if (!data.header.n_supplier) result = 'Укажите поставщика';
        if (!data.header.n_recipient) result = 'Укажите получателя';
        if (data.table.length<2) result = 'Добавьте товары';
        for (let i in data.table) {
            let row = data.table[i];
            if (!row.n_code) continue;
            if (isNaN(row.n_amount) || +row.n_amount < 0) {
                result = `Неверное количство в строке ${(row.row_num) ? row.row_num+1: ''}`;
            }
            if (row.n_stock < row.n_amount) result = `Количество на складе меньше чем в заказе в строке ${row.row_num+1}`;
            if (!row.n_price || row.n_price <= 0) result = `Неверная цена в строке ${row.row_num+1}`;
        }
        return result
    }

    saveDocumentServer(th, data){
        let result = false;
        let r_data = documentProcessing.save(data, th.doc.id, 'movements');
        if (!r_data.data || !r_data.data[0]) return "Ошибка записи на сервер";
        this.doc = r_data.data[0];
        this.getHeader().$$("__n_id").setValue(this.doc.n_id);
        // this.getRoot().getChildViews()[1].getChildViews()[0].$scope.$$("__n_id").setValue(this.doc.n_id)
        if (this.table) {
            if (!this.flag_new) {
                r_data.data[0]['id'] = r_data.kwargs.intable;
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
        return this.getHeader().setHeader();
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
        this.setRelease();

    }

    recalcTable() {
        let table = this.$$("__table")
        function getLimits() {
            let result = 0;
            table.mapCells(null, "n_total_summ", null, 1, function(value, row_id){
                console.log('c_limit_excl', table.getItem(row_id).c_limit_excl);
                if (table.getItem(row_id) && !table.getItem(row_id).c_limit_excl) {
                    let v = +value
                    if (!isNaN(v)) result+=v;
                } else {

                }
                return value;
            });
            return result
        };

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
                item.n_total_summ = item.n_novats_summ// + item.n_vats_summ;
                table.updateItem(row, item);
            }
        })
        let pr = getSum("n_price");
        let sh_pr = getSum("n_ship_price");
        let charge = (sh_pr/pr)*100 - 100;
        let total_limit = getLimits();
        this.$$("__release").setValue(webix.Number.formatNumber(total_limit));
        // let limit = +this.$$("__limit").getValue();
        // let t_release = +this.$$("__release_total").getValue();

        let r_total = this.$$("__release_total");
        let r_order = this.$$("__release");
        if (this.n_limit == 0 || +total_limit == 0) {
            this.$$("__save").show();
            this.$$("__hold").show();
        } else if (+total_limit+this.n_release > this.n_limit ) {
            document.message('Превышен лимит на точку', 'error', 3);
            r_total.$view.classList.add('label_warning')
            r_order.$view.classList.add('label_warning')
            this.$$("__save").hide();
            this.$$("__hold").hide();
        } else {
            r_total.$view.classList.remove('label_warning');
            r_order.$view.classList.remove('label_warning');
            this.$$("__save").show();
            this.$$("__hold").show();
        }
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
        this.setRelease();
        this.recalcTable();

    }

    ready() {
        webix.UIManager.addHotKey("enter", function(view){
            var pos = view.getSelectedId();
            view.edit(pos);
        }, this.$$("__table"));
    }

    init() {
        this.doc_type = "Перемещение"
        this._block = 'supplier'

    }
}