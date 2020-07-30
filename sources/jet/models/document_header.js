"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../variables/variables"
import {filtersGetData} from "../models/data_processing";
import {formatText} from "../views/common";

export default class DocumentHeader extends JetView{

    constructor(app, parent, readonly=false) {
        super(app);
        this.parent = parent;
        this.readonly = readonly;
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
                {cols:[
                    {view: "text", label: "Исполнитель", labelWidth: 100,
                        name: "n_executor",
                        localId: "__exec",
                        disabled: true,
                        width: 250,
                        
                        on: {
                            onChange: () => {
                                this.parent.setChange();
                            }
                        }
                    },
                    {},
                ]},
                {height: emptyWidth},
                {cols:[
                    {rows:[
                        {template: "Тип документа", type: "section", localId: "__type"},
                        {cols:[
                            {view: "combo",
                                disabled: true,
                                name: "n_state",
                                label: "Состояние документа",
                                localId: "__status",
                                labelWidth: 140,
                                on: {
                                    onChange: () => {
                                        this.parent.setChange();
                                    }
                                },
                                options:{
                                    body:{
                                        parentName: "n_state",
                                        url: function(params) {
                                            return filtersGetData(params, this);
                                        },
                                        type:{
                                            height:32
                                        },
                                        on:{
                                            onAfterLoad: function() {
                                                // this.add({ $empty:true, value:"" },0);
                                            }
                                        }
                                    }
                                },
                            },

                            {width: emptyWidth},
                            {view: "text", 
                                label: "Номер документа", 
                                name: "n_number",
                                labelWidth: 120, 
                                localId: "__number",
                                on: {
                                    onKeyPress: function(code, event) {
                                        this.callEvent('onChange');
                                    },
                                    onChange: () => {
                                        this.parent.setChange();
                                    }
                                }
                            },
                            {width: emptyWidth},
                            {view: "datepicker", 
                                name: "n_dt_document",
                                label: "Дата документа", 
                                format: webix.i18n.dateFormatStr,
                                labelWidth: 105, 
                                value: new Date(), 
                                localId: "__date",
                                on: {
                                    onChange: () => {
                                        this.parent.setChange();
                                    }
                                }
                            },
                        ]}                        
                    ]},
                    {width: emptyWidth*3},
                    {rows: [
                        {template: "Итого по документу", type: "section"},
                        {cols:[
                            {view: "text", label: "Сумма документа", labelWidth: 120,
                                format: formatText,
                                disabled: true,
                                localId: "__sum", 
                            },
                            {width: emptyWidth},
                            {view: "text", label: "Сумма НДС", labelWidth: 80, 
                                disabled: true,
                                format: formatText,
                                localId: "__vats"
                            },
                            {width: emptyWidth},
                            {view: "text", label: "Количество позиций", labelWidth: 135, 
                                disabled: true,
                                localId: "__pos"
                            },
                        ]}
                    ]},
                ]},
                {height: emptyWidth*3},
                {cols: [
                    {rows: [
                        {template: "поставщик", type: "section"},
                        {view: "combo",
                            disabled: !true,
                            name: "n_supplier",
                            localId: "__supplier",
                            labelWidth: 0,
                            on: {
                                onChange: () => {
                                    this.parent.setChange();
                                }
                            },
                            options:{
                                body:{
                                    parentName: "n_supplier",
                                    url: function(params) {
                                        return filtersGetData(params, this);
                                    },
                                    type:{
                                        height:32
                                    },
                                }
                            },
                        },
                    ]},
                    {width: emptyWidth*3},
                    {rows: [
                        {template: "получатель", type: "section"},
                        {view: "combo",
                            name: "n_recipient",
                            disabled: !true,
                            localId: "__recipient",
                            labelWidth: 0,
                            on: {
                                onChange: () => {
                                    this.parent.setChange();
                                }
                            },
                            options:{
                                body:{
                                    parentName: "n_recipient",
                                    url: function(params) {
                                        return filtersGetData(params, this);
                                    },
                                    type:{
                                        height:32
                                    },
                                }
                            },
                        },
                    ]},
                    {width: emptyWidth*3},
                    {rows: [
                        {template: "основание документа", type: "section"},
                        {view: "text",
                            name: "n_base",
                            labelWidth: 0, 
                            localId: "__base",
                            on: {
                                onKeyPress: function() {
                                    this.callEvent('onChange');
                                },
                                onChange: () => {
                                    this.parent.setChange();
                                }
                            },
                        },
                    ]},
                ]},
                {height: emptyWidth*3},
            ],

        }

        return header
    }

    getData(top_view) {
        let local_data = {};
        if (!top_view) top_view = this.getRoot();
        let views = top_view.getChildViews();
        views.forEach( (item, index)=>{
            let new_data = this.getData(item);
            local_data = Object.assign(new_data, local_data)
            if (item.config.name) {
                let ld = {}
                ld[item.config.name] = item.getValue(name)
                local_data = Object.assign(local_data, ld)
            }
        })
        return local_data
    }

    setHeader(){
        if (this.parent.doc) {
            this.$$("__number").blockEvent();
            this.$$("__exec").blockEvent();
            this.$$("__date").blockEvent();
            this.$$("__status").blockEvent();
            this.$$("__supplier").blockEvent();
            this.$$("__recipient").blockEvent();
            this.$$("__base").blockEvent();
            this.$$("__sum").setValue(this.parent.doc.n_summ);
            this.$$("__vats").setValue(this.parent.doc.n_nds);
            this.$$("__pos").setValue(this.parent.doc.n_pos_numbers);
            this.$$("__status").setValue(this.parent.doc.n_state);
            this.$$("__supplier").setValue(this.parent.doc.n_supplier_id);
            this.$$("__recipient").setValue(this.parent.doc.n_recipient_id);
            this.$$("__number").setValue(this.parent.doc.n_number);
            this.$$("__exec").setValue(this.parent.doc.n_executor);
            this.$$("__date").setValue(this.parent.doc.n_dt_invoice);
            this.$$("__base").setValue( (this.parent.base) ? this.parent.base : this.parent.doc.n_base);
            this.$$("__n_id").setValue(this.parent.doc.n_id);
            this.$$("__type").define('template', this.parent.doc_type);
            this.$$("__type").refresh();
            this.$$("__number").unblockEvent();
            this.$$("__exec").unblockEvent();
            this.$$("__date").unblockEvent();
            this.$$("__status").unblockEvent();
            this.$$("__supplier").unblockEvent();
            this.$$("__recipient").unblockEvent();
            this.$$("__base").unblockEvent();
            if (this.parent.doc.n_state === 2) {
                this.$$("__number").disable();
                this.$$("__exec").disable();
                this.$$("__date").disable();
                this.$$("__status").disable();
                this.$$("__supplier").disable();
                this.$$("__recipient").disable();
                this.$$("__base").disable();
            }
            if (this.readonly) {
                this.$$("__header-form").disable();
            };
            if (this.parent.base) {
                this.$$("__base").disable();
                this.$$("__recipient").disable();
            }
            if (this.parent._block) {
                this.$$(`__${this.parent._block}`).disable();
            
            }
        }
    }
 
    recalcHeader(master){
        function getSum(columnId) {
            let result = 0;
            master.mapCells(null, columnId, null, 1, function(value){
                let v = +value
                if (!isNaN(v))
                result+=v;
                return value;
            });
            return result
        }

        this.$$("__sum").setValue(getSum("n_total_summ"));
        this.$$("__vats").setValue(getSum("n_vats_summ"));
        this.$$("__pos").setValue(getSum("n_amount"));



    }


    ready() {
        this.setHeader();
    }

    init() {

    }
}