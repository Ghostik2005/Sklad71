"use strict";

import {JetView} from "webix-jet";
import {filters_process} from "../models/data_processing";
import ButtonUnFilter from "../models/button_unfilter";

export default class TemplateMenuFilters extends JetView{

    constructor(app, name) {
        super(app);
        this.p_name = name;
    }


    config(){
        let local_this = this;
        let app = this.app;

        let popup = {
            view: "cWindow",
            loclalId: "_pop",
            width: 420,
            padding: 4,
            point:!true,
            toFront: true,
            relative: true,
            modal: !true,
            css: "menu_filters",
            on: {
                onShow: () => {
                    this.loadValues();
                },
            },
            body: {
                rows:[
                    {view: "form",
                        autoheight: true,
                        borderless: !true,
                        localId: "__body",
                        rows: [
                        ]
                    },
                    {borderless: !true,
                        cols: [
                            {},
                            {view: "button",
                                width: 136,
                                label: "Сбросить все",
                                on: {
                                    onItemClick: ()=>{
                                        let elem = Array.from(document.getElementsByClassName('remove_filter'));
                                        elem.forEach( (e) => {
                                            let view_id = webix.html.locate(e, 'view_id');
                                            $$(view_id).$scope.click()
                                        })
                                    }
                                }
                            },
                            {view: "button",
                                label: "Применить",
                                width: 136,
                                localId: "__apply",
                                on: {
                                    onItemClick: ()=>{
                                        if (this.isVisible()) {
                                            let b = this.$$("__body").getValues().n_state;
                                            if (b) {
                                                app.commonWidgets[local_this.p_name].quick_filters.checkTag("__" + b, b, false) ;
                                            } else {
                                                app.commonWidgets[local_this.p_name].quick_filters.uncheckAll()
                                            };
                                        };
                                        app.commonWidgets[local_this.p_name].center_table.getData();
                                        this.saveValues();
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

    setState(state){
        this.$$("__n_state_field").setValue(state);
        this.$$("__apply").callEvent("onItemClick");
    }

    saveValues() {
        this.values = this.$$("__body").getValues();
        this.app.commonWidgets[this.p_name].status_bar.setStatus(this.values);
    }

    loadValues() {
        this.$$("__body").setValues(this.values);
    }

    isVisible() {
        return this.getRoot().isVisible();
    }

    getFiltersValue() {
        let result = {};
        let childs = this.$$("__body").getChildViews();
        for (var i in childs) {
            let child = childs[i].getChildViews()[0]
            result[child.config.name] = (child.getText) ? child.getText(): child.getValue();
        }
        return result
    }

    getFilters() {
        return this.$$("__body").getValues();
    }

    ready() {
        this.values = {}
        let global_this = this;
        this.app.commonWidgets[this.p_name]['menu_filters'] = this;
        setTimeout( ()=> {
        let columns = this.app.commonWidgets[this.p_name].center_table.getHeaders()
        columns.forEach((col)=>{
            let gen_id = `_${col.id}_field`;
            switch (col.filter_type) {
                case "text":
                    this.$$("__body").addView({
                        css: "menu_filters_margin_top",
                        cols: [
                            {view: "text",
                                localId: `__${col.id}_field`,
                                label: col.header[0].text,
                                name: col.id,
                                labelWidth: 120,
                            },
                            new ButtonUnFilter(this.app, global_this, `__${col.id}_field`)
                        ]
                    })
                    break
                case "date":
                    this.$$("__body").addView({
                        css: "menu_filters_margin_top",
                        cols: [
                            {localId: `__${col.id}_field`,
                                view: "daterangepicker",
                                multiselect: true,
                                label: col.header[0].text,
                                name: col.id,
                                labelWidth: 120
                            },
                            new ButtonUnFilter(this.app, global_this, `__${col.id}_field`)
                        ]
                    });
                    break
                case "multi":
                    this.$$("__body").addView({
                        css: "menu_filters_margin_top",
                        cols: [
                            {view: "multiselect",
                                localId: `__${col.id}_field`,
                                label: col.header[0].text,
                                name: col.id,
                                labelWidth: 120,
                                options: {
                                    view:"multisuggest",
                                    button:true,
                                    body: {
                                        parentName: col.id,
                                        yCount: 5,
                                        scroll: true,
                                        url: function(params) {
                                            return filters_process.get_data(params, this);
                                        },
                                        type:{
                                            height:32
                                        }
                                    }
                                },
                            },
                            new ButtonUnFilter(this.app, global_this, `__${col.id}_field`)
                        ]
                    })
                    break;
                case "combo":
                    this.$$("__body").addView({
                        css: "menu_filters_margin_top",
                        cols: [
                            {view: "combo",
                                label: col.header[0].text || "Состояние",
                                name: col.id,
                                localId: `__${col.id}_field`,
                                labelWidth: 120,
                                options:{
                                    body:{
                                        parentName: col.id,
                                        url: function(params) {
                                            return filters_process.get_data(params, this);
                                        },
                                        type:{
                                            height:32
                                        },
                                        on:{
                                            onAfterLoad: function() {
                                                this.add({ $empty:true, value:"" },0);
                                            }
                                        }
                                    }
                                },
                            },
                            new ButtonUnFilter(this.app, global_this, `__${col.id}_field`)
                    ]
                    })
                    break;
                default:
                    break;
            }
        })
    }, 500)
    }

    show(target){
        return this.getRoot().show(target.$view);
    }
    hide(){
        return this.getRoot().hide();
    }
}
