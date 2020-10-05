"use strict";

import {JetView} from "webix-jet";
import TemplateComboRefCard from "../models/template_combo_ref_card";
import {reference} from "../models/data_processing";



export default class TemplateRefCardView extends JetView{

    constructor(app, parent, edited) {
        super(app);
        this.parent = parent;
        this.edited = edited;
    }

    config(){
        let th = this;
        let popup = {
            view: "cWindow",
            loclalId: "_popup",
            point:!true,
            toFront: true,
            relative: true,
            modal: true,
            css: "menu_filters",
            escHide: true,
            on: {
                onShow: () => {
                },
                onHide: function() {
                    this.destructor();
                }
            },
            // width: document.documentElement.clientWidth*0.6,
            // height: document.documentElement.clientHeight*0.8,
            body: {rows:[
                {view: "form",
                    localId: "__ref_form",
                    on: {
                        onChange: () =>{
                            th.setChange();
                        }
                    },
                    // borderless: true,
                    elements: [

                    ]
                },
                {borderless: !true,
                    padding: 4,
                    cols: [
                        {},
                        {view: "button",
                            label: "Сохранить",
                            width: 136,
                            hidden: true,
                            localId: "__save",
                            on: {
                                onItemClick: ()=>{
                                    let res = th.saveCard();
                                    if (res) {
                                        document.message(res, 'error', 3)
                                    } else {
                                        th.setUnChange();
                                        th.hide();
                                    }
                                }
                            }
                        },
                        {view: "button",
                            label: "Закрыть",
                            width: 136,
                            localId: "__cancel",
                            on: {
                                onItemClick: ()=>{
                                    th.hide();
                                }
                            }
                        },
                    ]
                },
            ]}
        }

        return popup

    }


    show(header){
        header = header || 'Карточка ' + this.parent.header + ".  ";
        if (!this.edited) {
            header += "Новый элемент";
        } else {

            header += this.edited[this.app.getService("common").search_key(this.edited, '_name')];
        }
        this.getRoot().getHead().getChildViews()[0].setValue(header);
        return this.getRoot().show();
    }

    hide(){
        // webix.UIManager.removeHotKey("up", null, this.$$("_popup"));
        setTimeout(() => {
            return this.getRoot().hide();
        }, 10);

    }

    setUnChange() {
        this.change = false;
        let header = this.getRoot().getHead().getChildViews()[0];
        this.$$("__save").hide();
        header.setValue(header.getValue().replace ('<span class="changed">  изменен</span>', ''))
    }

    setChange() {
        this.change = true;
        let header = this.getRoot().getHead().getChildViews()[0];
        this.$$("__save").show();
        let q = header.$view.querySelectorAll('[class="changed"]');
        if (q.length === 0) header.setValue(header.getValue() + '<span class="changed">  изменен</span>')
    }

    parseElement(product) {
        let p_id;
        if (product) {
            // редактируем, id уже есть
            p_id = product.id
        } else {
            return
        }
        //делаем запрос на сервер
        let req_data = reference.get(p_id, this.parent.cfg.name);
        //и парсим товар
        this.$$("__ref_form").blockEvent();
        if (req_data){
            let data = req_data.data[0];
            this.$$("__ref_form").parse(data);
        }
        this.$$("__ref_form").unblockEvent();

    }


    validateCard(data){
        let result = false;
        let n = data[this.app.getService("common").search_key(data, '_name')];
        if (!n || n.length < 2) result = "Укажите наименование "
        // if (!data.c_namefull || data.c_namefull.length < 2) result = "Укажите полное название товара"
        // if (!data.header.n_base) result = 'Укажите основание документа';
        // if (!data.header.n_number) result = 'Укажите номер документа';
        // if (!data.header.n_supplier) result = 'Укажите поставщика';
        // if (!data.header.n_recipient) result = 'Укажите получателя';
        // if (data.table.length<2) result = 'Добавьте товары';
        // for (let i in data.table) {
        //     let row = data.table[i];
        //     if (!row.n_code) continue;
        //     if (!row.n_amount || isNaN(row.n_amount) || +row.n_amount < 0) {
        //         result = `Неверное количство в строке ${(row.row_num) ? row.row_num+1: ''}`;
        //     }
        //     if (!row.n_price || row.n_price <= 0) result = `Неверная цена в строке ${row.row_num+1}`;
        // }
        return result
    }

    saveCard(){
        let result = false
        let data = this.$$("__ref_form").getValues();
        let valid = this.validateCard(data);
        if (valid) return valid;
        let r_data = reference.set(data, this.parent.cfg.name);
        let p_table = $$(this.parent.table_id);
        if (!r_data.data || !r_data.data[0]) return "Ошибка записи на сервер";
        if (p_table) {
            if (this.edited.id) {
                p_table.updateItem(this.edited.id, r_data.data[0]);
            } else {
                p_table.add(r_data.data[0], 0);
            }
        }
        return result

    }


    ready() {
        let th = this;
        setTimeout(() => {
            let columns = this.parent.cfg.columns;
            this.$$("__ref_form").addView({view: "text",
                hidden: true,
                localId: "__ref_name",
                name: "ref_name",
                value: this.parent.cfg.name,
            });
            columns.forEach((col)=>{
                if (!col.hidden){
                    switch (col.filter_type) {
                        case "text":
                            this.$$("__ref_form").addView({
                                view: "text",
                                localId: `__${col.id}_field`,
                                label: col.header[0].text,
                                labelPosition: "top",
                                height: 60,
                                inputHeight: 38,
                                width: 600,
                                name: col.id,
                                labelWidth: 120,
                                on: {
                                    onKeyPress: function(code, event) {
                                        if (code ===32 || (code>=48 && code<=90)) {
                                            th.setChange();
                                        } else if (code === 27) {
                                            th.$$("__cancel").callEvent('onItemClick')
                                        };

                                    },
                                },
                            });
                            break;
                        case "combo":
                            this.$$("__ref_form").addView(new TemplateComboRefCard(this.app, {width: 600, labelName: col.header[0].text,
                                name: col.id, reference: this.parent.cfg.name,
                                cancel: th.$$("__cancel"),
                                fitMaster: true}));
                            break;
                        default:
                            break;
                    }
                }
            })
            //получаем значение товара если есть id, иначе - товар по умолчанию.
            this.parseElement(this.edited)
            // и затем парсим в форму
            webix.UIManager.setFocus(this.$$("__ref_form"))
        }, 200);

    }

    init() {
    }
}



