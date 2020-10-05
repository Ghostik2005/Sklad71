"use strict";

import {getDatas} from "../models/data_processing";

import ArrivalBody from "../models/arrivals_document_body";
import {ArrivdtColumns} from "../variables/arrivals_centerDt";

import ShipmentsBody from "../models/shipments_document_body";
import {ShipdtColumns} from "../variables/shipments_centerDt";

import MovementsBody from "../models/movements_document_body";
import {MovedtColumns} from "../variables/movements_centerDt";

import OrderBody from "../models/orders_document_body";
import {OrddtColumns} from "../variables/orders_centerDt";

import {BaldtColumns} from "../variables/balance_centerDt";

import RestBody from "../models/rests_document_body";
import {RestsdtColumns} from "../variables/rests_centerDt";


export const main_tables_cfg = {

    rests: {
        loadData: getDatas.getAllData,
        sorting: {id: "n_dt_invoice", dir: "desc"},
        docBody: RestBody,
        columns: RestsdtColumns,
        id: "_rests_main",
    },

    arrivals: {
        loadData: getDatas.getAllData,
        sorting: {id: "n_dt_invoice", dir: "desc"},
        docBody: ArrivalBody,
        columns: ArrivdtColumns,
        id: "_arrivals_main",
        _block: "recipient",
    },

    movements: {
        loadData: getDatas.getAllData,
        sorting: {id: "n_dt_invoice", dir: "desc"},
        docBody: MovementsBody,
        columns: MovedtColumns,
        id: "_movements_main",
    },

    shipments: {
        loadData: getDatas.getAllData,
        sorting: {id: "n_dt_invoice", dir: "desc"},
        docBody: ShipmentsBody,
        columns: ShipdtColumns,
        id: "_shipments_main",
    },

    orders: {
        loadData: getDatas.getAllData,
        sorting: {id: "n_dt_send", dir: "desc"},
        docBody: OrderBody,
        columns: OrddtColumns,
        id: "_orders_main",
    },

    balances: {
        loadData: getDatas.getAllData,
        sorting: {id: "n_product", dir: "asc"},
        columns: BaldtColumns,
        id: "_balances_main",
    }





}