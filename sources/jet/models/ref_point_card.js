"use strict";

import {JetView} from "webix-jet";
import TemplateComboRefCard from "../models/template_combo_ref_card";
import {getPoint, setPoint} from "../models/data_processing";


export default class RefPointCardView extends JetView{

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
                    localId: "__ref_points_form",
                    on: {
                        onChange: () =>{
                            th.setChange();
                        }
                    },
                    padding: 2,
                    margin: 1,
                    // borderless: true,
                    elements: [],
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
                            label: "Отменить",
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
        let req_data = getPoint(p_id, this.parent.cfg.name);
        //и парсим товар
        this.$$("__ref_points_form").blockEvent();
        if (req_data){
            let data = req_data.data[0];
            this.$$("__ref_points_form").parse(data);
        }
        this.$$("__ref_points_form").unblockEvent();        

    }


    validateCard(data){
        let result = false;
        if (!data.n_name || data.n_name.length < 2) return "Укажите название"
        if (!data.n_address || data.n_address.length < 2) return "Укажите адрес"
        if (!data.n_parent_id) return "Укажите юр.лицо"
        return result
    }

    saveCard(){
        let result = false
        let data = this.$$("__ref_points_form").getValues();
        console.log('data', data);
        let valid = this.validateCard(data);
        if (valid) return valid;
        let r_data = setPoint(data);
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
            this.$$("__ref_points_form").addView({view: "text",
                hidden: true,
                localId: "__ref_name",
                name: "ref_name",
                value: this.parent.cfg.name,
            });
            this.$$("__ref_points_form").addView(
                {cols: [
                    {view: "text", name: "n_id", width: 1, hidden: true, localId: "__n_id_field"},
                    new TemplateComboRefCard(this.app, {width: 200, labelName: "Юр.лицо", 
                        name: "n_parent_id", reference: this.parent.cfg.name,
                        cancel: th.$$("__cancel"),
                        fitMaster: true}
                    ),
                    {view: "text",
                        localId: "__n_code_field",
                        label: "Код",
                        labelPosition: "top",
                        height: 60,
                        inputHeight: 38,
                        width: 200,
                        name: "n_code",
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
                    },
                ]}
            );

            this.$$("__ref_points_form").addView(
                {cols: [
                    {view: "text",
                        localId: "__n_address_field",
                        label: "Адрес",
                        labelPosition: "top",
                        height: 60,
                        inputHeight: 38,
                        width: 540,
                        name: "n_address",
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
                    },
                    {rows: [
                        {},
                        {view: "button", 
                            label: "COPY",
                            width: 60,
                            tooltip: "Скопировать в название",
                            localId: "__copy_to_namr",
                            on: {
                                onItemClick: ()=>{
                                    let value = this.$$("__n_address_field").getValue()
                                    this.$$("__n_name_field").setValue(value)
                                }
                            }
                        },
                    ]},
                ]},
            );

            this.$$("__ref_points_form").addView(
                {cols: [
                    {view: "text",
                        localId: "__n_name_field",
                        label: "Название",
                        labelPosition: "top",
                        height: 60,
                        inputHeight: 38,
                        width: 600,
                        name: "n_name",
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
                    },
                    // {rows: [
                    //     {},
                    //     {view: "button", 
                    //         label: "COPY",
                    //         width: 60,
                    //         tooltip: "Скопировать в адрес",
                    //         localId: "__copy_to_address",
                    //         on: {
                    //             onItemClick: ()=>{
                    //                 let value = this.$$("__n_name_field").getValue()
                    //                 this.$$("__n_address_field").setValue(value)
                    //             }
                    //         }
                    //     },
                    // ]},
                ]},
            );

            this.$$("__ref_points_form").addView(
                {cols: [
                    {view: "text",
                        localId: "__n_contact",
                        label: "Контактное лицо",
                        labelPosition: "top",
                        height: 60,
                        inputHeight: 38,
                        width: 200,
                        name: "n_contact",
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
                    },
                    {view: "text",
                        localId: "__n_phone_field",
                        label: "Телефон",
                        labelPosition: "top",
                        height: 60,
                        inputHeight: 38,
                        width: 200,
                        name: "n_phone",
                        pattern: webix.patterns.phone, 
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
                    },
                    {view: "text",
                        localId: "__n_email_field",
                        label: "e-mail",
                        labelPosition: "top",
                        height: 60,
                        inputHeight: 38,
                        width: 200,
                        name: "n_email",
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
                    },
                ],
            });
            this.$$("__ref_points_form").addView({view: "textarea",
                localId: "__n_comment_field",
                label: "Комментарий",
                labelPosition: "top",
                height: 114,
                inputHeight: 76,
                width: 600,
                name: "n_comment",
                labelWidth: 120,
                on: {
                    onKeyPress: function(code, event) {
                        if (code ===32 || (code>=48 && code<=90)) {
                            th.setChange();
                        } else if (code === 27) {
                            th.$$("__cancel").callEvent('onItemClick')
                        };

                    },
                }

            });

            //получаем значение товара если есть id, иначе - товар по умолчанию.
            this.parseElement(this.edited)
            // и затем парсим в форму
            webix.UIManager.setFocus(this.$$("__n_address_field"))       
        },30);

    }

    init() {
    }
}



