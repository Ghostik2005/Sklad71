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


    newShipment(th, gr) {
        console.log("gr", gr);
        let app = this.app;
        let focus = webix.UIManager.getFocus();
        let doc = this.ui(ShipmentsBody);
        let blank_item = {
            flag_new: true,
            n_dt_invoice: new Date(),
            n_executor: app.config.user,
            n_paid: "Нет",
            n_state: 1,
            n_supplier_id: app.config.home_org_id,
            order_id: (gr) ? gr.n_id : undefined,
            n_recipient_id: (gr) ? gr.n_recipient_id : undefined,
        }
        doc.show(blank_item, focus, this.__table);

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
