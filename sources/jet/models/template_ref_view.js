"use strict";

import {JetView} from "webix-jet";
import TemplateProductsView from "../models/template_products_dt"
import TemplateRefCardView from "../models/template_ref_card";
import RefPartnerCardView from "../models/ref_partner_card";
import RefPointCardView from "../models/ref_point_card";



export default class RefView extends JetView{

    constructor(app, cfg) {
        super(app);
        // this.parent = parent;
        this.cfg = cfg;
    }

    config(){
        let th = this;
        this.table_id = webix.uid();
        let dt = new TemplateProductsView(th.app, {
            columns: th.cfg.columns,
            loadFunction: th.cfg.loadFunction,
            sorting: th.cfg.sorting,
            topParent: th,
            id: this.table_id,
            name: th.cfg.name,
            dblClick: function(item) {
                th.$$("__edit").callEvent('onItemClick')
            },
        });

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
                    {cols: [
                        {view: "text",
                            localId: "__search",
                            label: "",
                            name: "_search",
                            labelWidth: 0,
                            width: 450,
                            hidden: !true,
                            on: {
                                onKeyPress: function(code, event) {
                                    // if (code ===32 || (code>=48 && code<=90)) {
                                        clearTimeout(this.delay);
                                        this.delay = setTimeout(() => {
                                            this.$scope.getData();
                                        }, 850);
                                    // }
                                },
                            },
                        },
                        {},
                        {view: "button",
                            label: "edit",
                            width: 50,
                            tooltip: "Редактировать запись",
                            localId: "__edit",
                            hidden: true,
                            on: {
                                onItemClick: ()=>{
                                    // let item = this.$$("__table").getSelectedItem();
                                    let item = $$(this.table_id).getSelectedItem();
                                    let ref_ed;
                                    

                                    if (this.cfg.name == "partners") {
                                        ref_ed = this.ui(new RefPartnerCardView(this.app, this, item));
                                    } else if (this.cfg.name == "points") {
                                        ref_ed = this.ui(new RefPointCardView(this.app, this, item));
                                    } else {
                                        ref_ed = this.ui(new TemplateRefCardView(this.app, this, item));
                                    }
                                    ref_ed.show();
                                }
                            }
                        },
                        {view: "button",
                            label: "add",
                            width: 50,
                            tooltip: "Добавить запись",
                            localId: "__add",
                            on: {
                                onItemClick: ()=>{
                                    let ref_ed;
                                    if (this.cfg.name == "partners") {
                                        ref_ed = this.ui(new RefPartnerCardView(this.app, this, false));
                                    } else if (this.cfg.name == "points") {
                                        ref_ed = this.ui(new RefPointCardView(this.app, this, false));
                                    } else {
                                        ref_ed = this.ui(new TemplateRefCardView(this.app, this, false));
                                    }
                                    ref_ed.show();
                                }
                            }
                        },

                    ]
                    },
                    dt,
                    // dattable,
                    {borderless: !true,
                        cols: [
                            {},
                            {view: "button",
                                label: "Закрыть",
                                width: 136,
                                localId: "__apply",
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

        return popup

    }

    searchDuplicates(table, item_id) {
        let d_id;
        table.eachRow( (row)=> {
            let item = table.getItem(row);
            if (item.n_prod_id && (item.n_prod_id.toString() === item_id.toString())) d_id = row;
        })
        return d_id;
    }

    getData(){
        // let t = this.$$("__table")
        let t = $$(this.table_id)
        t.clearAll(true);
        t.loadNext(0, 0, 0, 0, 1).then((data)=> {
            if (data) {
                t.clearAll(true);
                t.parse(data);
                t.showItemByIndex(0);
            }
        })
    }

    getFilter() {
        let re = ''
        try {
            re = this.$$("__search").getValue();
        } catch(e) {
        }
        return re;
    }

    show(header){
        this.header = header;
        if (this.header) {
            this.getRoot().getHead().getChildViews()[0].setValue(this.header);
        }
        this.getRoot().show();

    }

    hide(){
        setTimeout(() => {
            return this.getRoot().hide();    
        }, 10);
        
    }

    ready() {
        this.$$("__search").focus();
    }

    init() {
    }
}