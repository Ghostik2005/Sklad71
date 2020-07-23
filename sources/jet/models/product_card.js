"use strict";

import {JetView} from "webix-jet";
import {message} from "../views/common";
import { emptyWidth } from "../views/variables";
import TemplateComboCard from "../models/template_combo_p_card";
import {getProduct, setProduct, getId, checkCode} from "../models/data_processing";


export default class ProductCardView extends JetView{

    constructor(app, parent, edided) {
        super(app);
        this.parent = parent;
        this.edided = edided;
    }

    config(){

        const fourth = 244;
        const third = 330;
        
        const row1 = {cols: [
            {view: "combo", 
                name: "c_type",
                localId: "__c_type",
                label: "Тип товара",
                labelPosition: "left",
                labelWidth: 77,
                width: 275,
                tooltip: true,
                options: {
                    fitMaster:false,
                    body: {
                        tooltip: true,
                        type:{
                            width:"auto"          
                        },
                        autowidth: true,
                        parentName: "c_type",
                        yCount: 5,
                        scroll: true,
                        data: [{id: 1, value: "Лекарственное средство"},
                            {id: 2, value: "Прочие товары"},
                        ],
                        // url: function(params) {
                        //     return productGetFilters(params, this);
                        // },
                        type:{
                            height:32
                        }
                    }
                },
                value: 1,
            },
            {width: emptyWidth*2},
            {view: "combo", 
                tooltip: true,
                name: "c_gvnls",
                localId: "__c_gvnls",
                label: "ЖВНЛС",
                labelPosition: "left",
                labelWidth: 55,
                width: 130,
                options: {
                    body: {
                        tooltip: true,
                        parentName: "c_gvnls",
                        yCount: 5,
                        scroll: true,
                        data: [{id: 1, value: "Да"},
                            {id: 2, value: "Нет"},
                        ],
                        // url: function(params) {
                        //     return productGetFilters(params, this);
                        // },
                        type:{
                            height:32
                        }
                    }
                },
                value: 2,
            },
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: 150, labelName: "НДС", labelWidth: 35,
                                            labelPosition: "left", name: "c_vatid", value: "2006552811470000003",
                                            fitMaster: true}),
            {minWidth: emptyWidth*2},
            {view: "text", 
                name: "c_nnt",
                localId: "__c_nnt",
                label: "Код товара",
                tooltip: true,
                labelPosition: "left",
                labelWidth: 77,
                width: 250,
                value: "",

            },
            {view: "button",
                width: 50,
                label: "ID",
                localId: "__gen_code",
                tooltip: "Сгенерировать автоматически",
                on: {
                    onItemClick: () => {
                        let new_id = getId();
                        if (new_id && new_id.data) {
                            this.$$("__c_nnt").setValue(new_id.data)
                        }
                    }
                }

            }

        ]};

        const row2 = {cols: [
            new TemplateComboCard(this.app, {width: third, labelName: "Группа", 
                                            name: "c_gpid", //value: "2006552811470000003",
                                            fitMaster: !true}),
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: fourth, labelName: "Форма выпуска", 
                                            name: "c_rfid", //value: "2006552811470000003",
                                            fitMaster: true}),
            {width: emptyWidth*2},
            {view: "text", 
                name: "c_doseval",
                tooltip: true,
                localId: "__c_dosval",
                label: "Дозировка",
                labelPosition: "top",
                height: 60,
                inputHeight: 38,
                labelWidth: 75,
                width: 80,
                value: "",

            },
            new TemplateComboCard(this.app, {width: 80, labelName: "<span style='color: transparent'>_</span>", 
                                            name: "c_doseid", //value: "2006552811470000003",
                                            fitMaster: true}),
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: fourth, labelName: "СПЕ",
                                            name: "c_speid", //value: "2006552811470000003",
                                            fitMaster: !true}),
        ]};

        
        const row3 = {cols: [
            new TemplateComboCard(this.app, {width: third, labelName: "МНН", 
                                            name: "c_mnnid", //value: "2006552811470000003",
                                            fitMaster: !true}),
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: third, labelName: "Производитель", 
                                            name: "c_manid", //value: "2006552811470000003",
                                            fitMaster: !true}),
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: third, labelName: "Страна производства", 
                                            name: "c_mancid", //value: "2006552811470000003",
                                            fitMaster: !true}),            
        ]};

        const row4 = {cols: [
            {view: "text", 
                name: "c_pack",
                tooltip: true,
                localId: "__c_pack",
                label: "Упаковка",
                labelPosition: "top",
                height: 60,
                inputHeight: 38,
                labelWidth: 70,
                width: fourth,
                value: "",
            },
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: fourth, labelName: "Первичная упаковка", 
                                            name: "c_ppid", //value: "2006552811470000003",
                                            fitMaster: !true}),
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: fourth, labelName: "Вторичная упаковка", 
                                            name: "c_psid", //value: "2006552811470000003",
                                            fitMaster: !true}),
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: fourth, labelName: "Третичная упаковка", 
                                            name: "c_ptid", //value: "2006552811470000003",
                                            fitMaster: !true}),
        ]};

        const row5 = {cols: [
            new TemplateComboCard(this.app, {width: fourth, labelName: "Область применения", 
                                            name: "c_aaid", //value: "2006552811470000003",
                                            fitMaster: !true}),
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: fourth, labelName: "Направление", 
                                            name: "c_dirid", //value: "2006552811470000003",
                                            fitMaster: !true}),
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: fourth, labelName: "Мегакатегория", 
                                            name: "c_megaid", //value: "2006552811470000003",
                                            fitMaster: !true}),
            {width: emptyWidth*2},
            new TemplateComboCard(this.app, {width: fourth, labelName: "Категория", 
                                            name: "c_catid", //value: "2006552811470000003",
                                            fitMaster: !true}),
        ]};

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
                    localId: "__p_form",
                    on: {
                        onChange: () =>{
                            this.setChange();
                        }
                    },
                    // borderless: true,
                    elements: [
                        row1,
                        {cols: [
                            {view:"text", 
                                hidden: true, 
                                name: "c_id",
                                value: ""
                            },
                            {view: "text",
                                css: "card_text_field",
                                name: "c_name",
                                height: 60,
                                inputHeight: 38,
                                localId: "__c_name",
                                label: "Наименование товара",
                                labelPosition: "top",
                                labelWidth: 180,
                                value: ""
                            },
                            {rows: [
                                {},
                                {view: "button", 
                                    label: "COP",
                                    width: 50,
                                    tooltip: "Скопировать в полное название",
                                    localId: "__copy",
                                    on: {
                                        onItemClick: ()=>{
                                            let value = this.$$("__c_name").getValue()
                                            this.$$("__c_namefull").setValue(value)
                                        }
                                    }

                                },
                            ]},
                        ]},
                        {view: "text", 
                            name: "c_namefull",
                            css: "card_text_field",
                            localId: "__c_namefull",
                            height: 60,
                            inputHeight: 38,
                            label: "Полное наименование товара",
                            labelPosition: "top",
                            labelWidth: 180,
                            value: "",
                            
                        },
                        row3,
                        row2,
                        row4,
                        row5,
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
                                    let res = this.saveCard();
                                    if (res) {
                                        message(res, 'error', 3)
                                    } else {
                                        this.setUnChange();
                                        this.hide();
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
                                    this.hide();
                                }
                            }
                        },
                    ]
                },           
            ]}
        }

        return popup

    }

    show(){
        let header = 'Карточка товара. '
        if (!this.edided) {
            header += "Новый товар";
        } else {
            header += this.edided.c_name;
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

    parseProduct(product) {
        // console.log(product);
        let p_id;
        if (product) {
            // редактируем, id уже есть
            p_id = product.c_id
            this.$$("__gen_code").disable();
            this.$$("__c_nnt").disable();
        } else {
            // id пустой
        }
        //делаем запрос на сервер 
        let req_data = getProduct(p_id);

        //и парсим товар
        this.$$("__p_form").blockEvent();
        if (req_data){
            let data = req_data.data[0];
            // console.log('data_prod', data);
            this.$$("__p_form").parse(data);
        }
        this.$$("__p_form").unblockEvent();        

    }


    validateCard(data){
        let result = false;
        // console.log('data', data);
        if (!data.c_name || data.c_name.length < 2) result = "Укажите название товара"
        if (!data.c_namefull || data.c_namefull.length < 2) result = "Укажите полное название товара"
        if (!data.c_nnt) result = "Укажите код товара"
        if (!this.edided) {
            if (!checkCode(data.c_nnt)) result = "Код товара не уникален"
        }

        return result
    }

    saveCard(){
        let data = this.$$("__p_form").getValues();
        let valid = this.validateCard(data);
        if (valid) return valid;
        let result = false
        let p_table = $$(this.parent.table_id)
        // console.log('pt', );
        let r_data = setProduct(data);
        // console.log('r_d', r_data);
        if (!r_data.data || !r_data.data[0]) return "Ошибка записи на сервер";
        if(p_table) {
            if (this.edided.id) {
                p_table.updateItem(this.edided.id, r_data.data[0]);
            } else {
                p_table.add(r_data.data[0], 0);   
            }
        }

        return result

    }


    ready() {
        // webix.UIManager.addHotKey("Esc", () => { 
        //     console.log('----');
        //     this.$$("__cancel").callEvent("onItemClick")
        //     return false; 
        // }, this.$$("_popup"));
        //получаем значение товара если есть id, иначе - товар по умолчанию.
        this.parseProduct(this.edided)
        // и затем парсим в форму
        webix.UIManager.setFocus(this.$$("__c_name"))
    }

    init() {
    }
}



