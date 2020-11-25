"use strict";

import OrderBody from "../models/orders_document_body";
import ArrivalBody from "../models/arrivals_document_body";
import ShipmentsBody from "../models/shipments_document_body";
import MovementsBody from "../models/movements_document_body";
import RestBody from "../models/rests_document_body";
import {report_processing} from "../models/data_processing";


export const newReport = {

    document: (th, doc_type, doc) => {
        // console.log('th', th);
        // console.log('ar1', doc_type);
        // console.log('ar2', doc);
        report_processing.new_report(doc_type, doc.n_id);

    }

}

export const newDocument = {

    arrival: () => {
        let master = $$("sklad_main_ui").$scope;
        let table = (master.app.commonWidgets.sidebar.screens._arrivals) ? $$("_arrivals_main") : undefined;
        let new_doc = master.ui(new ArrivalBody(master.app));
        let blank_item = {
            flag_new: true,
            n_dt_invoice: new Date(),
            n_executor: master.app.config.user,
            n_paid: "Нет",
            n_state: 1,
            n_recipient_id: master.app.config.home_org_id,
            _block: "recipient"
        }
        new_doc.show(blank_item, webix.UIManager.getFocus(), table);
    },

    shipment: (th, gr) => {
        let master = $$("sklad_main_ui").$scope;
        let table = (master.app.commonWidgets.sidebar.screens._shipments) ? $$("_shipments_main") : undefined;
        let new_doc = master.ui(ShipmentsBody);
        let blank_item = {
            flag_new: true,
            n_dt_invoice: new Date(),
            n_executor: master.app.config.user,
            n_paid: "Нет",
            n_state: 1,
            n_supplier_id: master.app.config.home_org_id,
            order_id: (gr) ? gr.n_id : undefined,
            n_recipient_id: (gr) ? gr.n_recipient_id : undefined,
        }
        new_doc.show(blank_item, webix.UIManager.getFocus(), table);
    },

    order: () => {
        let master = $$("sklad_main_ui").$scope;
        let table = (master.app.commonWidgets.sidebar.screens._orders) ? $$("_orders_main") : undefined;
        let doc = master.ui(OrderBody);
        let blank_item = {
            flag_new: true,
            n_dt_invoice: new Date(),
            n_executor: master.app.config.user,
            n_paid: "Нет",
            n_state: 1,
            n_recipient_id: master.app.config.home_org_id,
            _block: "recipient"
        }
        doc.show(blank_item, webix.UIManager.getFocus(), table);
    },

    movement: (th, gr) => {
        let master = $$("sklad_main_ui").$scope;
        let table = (master.app.commonWidgets.sidebar.screens._movements) ? $$("_movements_main") : undefined;
        let new_doc = master.ui(MovementsBody);
        // console.log('gr', gr);
        let blank_item = {
            flag_new: true,
            n_dt_invoice: new Date(),
            n_executor: master.app.config.user,
            n_paid: "Нет",
            n_state: 1,
            n_supplier_id: master.app.config.home_org_id,
            order_id: (gr) ? gr.n_id : undefined,
            n_recipient_id: (gr) ? gr.n_recipient_id : undefined,
        }
        new_doc.show(blank_item, webix.UIManager.getFocus(), table);

        // document.message(`Перемещение ${direction}`)
    },

    rest: () => {
        let master = $$("sklad_main_ui").$scope;
        let table = (master.app.commonWidgets.sidebar.screens._rests) ? $$("_rests_main") : undefined;
        let new_doc = master.ui(new RestBody(master.app));
        let blank_item = {
            flag_new: true,
            n_dt_invoice: new Date(),
            n_executor: master.app.config.user,
            n_paid: "Нет",
            n_state: 1,
            n_recipient_id: master.app.config.home_org_id,
            _block: "recipient"
        }
        new_doc.show(blank_item, webix.UIManager.getFocus(), table);
    },

    writeoff: () => {
        document.message('Списание')
    }


}

