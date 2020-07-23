"use strict";

import {JetView} from "webix-jet";
import {dtColumns} from "../models/orders_centerDt";
import ContextCenterDt from "../models/orders_context_center_dt";
import {ordersGetData, ordersSaveData} from "../models/data_processing";
import OrderBody from "../models/orders_document_body";
import TemplateCenterTable from "../models/template_table"

export default class OrdersCenterView extends JetView{
    
    constructor(app, view_name) {

        super(app);
        this.view_name = view_name;

    }


    config(){

        // let th = this;

        let cfg = {
            loadData: ordersGetData,
            sorting: {id: "n_dt_send", dir: "desc"},
            docBody: OrderBody,
            columns: dtColumns,
            parent: this,
            id: "_orders_main"
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


    newOrder() {
        let app = this.app;
        let focus = webix.UIManager.getFocus();
        let doc = this.ui(OrderBody);
        let blank_item = {
            flag_new: true,
            n_dt_invoice: new Date(),
            n_executor: app.config.user,
            n_paid: "Нет",
            n_state: 1,
            n_recipient_id: app.config.home_org_id,
            _block: "recipient"
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

        this.__table = $$("_orders_main");
        this.app.commonWidgets.orders['center_table'] = this;
        
    }

    
    init() {

        this.contextDt = this.ui(ContextCenterDt);

    }
}
