"use strict";

import {JetView} from "webix-jet";
import TemplateCenterTable from "../models/template_table"
import {main_tables_cfg} from "../models/tables_configs";
import TemplateCenterContextMenu from "../models/template_center_context_menu";


export default class TemplateCenterView extends JetView{
    
    constructor(app, view_name) {
        super(app);
        this.view_name = view_name;
        this.app.commonWidgets[this.view_name]['center_table'] = this;
    }

    config(){
        let cfg = main_tables_cfg[this.view_name];
        cfg['parent'] = this;
        return new TemplateCenterTable(this.app, cfg);
    }

    callContext(e, table) {
        let pos = table.locate(e);
        this.contextDt.setContext({obj:webix.$$(e), table:table, position: pos});
        this.contextDt.show(e);
        return webix.html.preventEvent(e);
    }

    getData(){
        this.__table.clearAll(true);
        this.__table.loadNext(0, 0, 0, 0, true).then((data)=> {
            if (data) {
                this.__table.clearAll(true);
                this.__table.parse(data);
                this.__table.showItemByIndex(0);
            }
        })
    }

    getHeaders(){
        let configs = []
        this.__table.eachColumn((colId) => {
            let col = this.__table.getColumnConfig(colId);
            configs.push(col)
        }, true)
        return configs

    }


    ready() {
        this.__table = $$(main_tables_cfg[this.view_name].id);
    }
    
    
    init() {
        this.contextDt = this.ui(new TemplateCenterContextMenu(this.app, this.view_name));
    }
}
