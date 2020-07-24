"use strict";

import {JetView} from "webix-jet";
import {dtColumns} from "../models/arrivals_centerDt";
import ContextCenterDt from "../models/arrivals_context_center_dt";
import {arrivalsGetData, arrivalsSaveData} from "../models/data_processing";
import ArrivalBody from "../models/arrivals_document_body";
import TemplateCenterTable from "../models/template_table"

export default class ArrivalsCenterView extends JetView{
    
    constructor(app, view_name) {

        super(app);
        this.view_name = view_name;

    }


    config(){

        // let th = this;

        let cfg = {
            loadData: arrivalsGetData,
            sorting: {id: "n_dt_invoice", dir: "desc"},
            docBody: ArrivalBody,
            columns: dtColumns,
            parent: this,
            id: "_arrivals_main",
            _block: "recipient"
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

        this.__table = $$("_arrivals_main");
        this.app.commonWidgets.arrivals['center_table'] = this;
        
    }

    
    init() {

        this.contextDt = this.ui(ContextCenterDt);

    }
}
