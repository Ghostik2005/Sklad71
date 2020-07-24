"use strict";

import {JetView} from "webix-jet";
import {dtColumns} from "../models/shipments_centerDt";
import ShipmentsContextCenterDt from "../models/shipments_context_center_dt";
import {shipmentsGetData} from "../models/data_processing";
import ShipmentsBody from "../models/shipments_document_body";
import TemplateCenterTable from "../models/template_table"

export default class ShipmentsCenterView extends JetView{
    
    constructor(app, view_name) {

        super(app);
        this.view_name = view_name;

    }


    config(){

        // let th = this;

        let cfg = {
            loadData: shipmentsGetData,
            sorting: {id: "n_dt_invoice", dir: "desc"},
            docBody: ShipmentsBody,
            columns: dtColumns,
            parent: this,
            id: "_shipments_main"
        }

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

        this.__table = $$("_shipments_main");
        this.app.commonWidgets.shipments['center_table'] = this;
        
    }

    
    init() {

        this.contextDt = this.ui(ShipmentsContextCenterDt);

    }
}
