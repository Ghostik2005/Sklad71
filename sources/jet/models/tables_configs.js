"use strict";

import {arrivalsGetData} from "../models/data_processing";
import ArrivalBody from "../models/arrivals_document_body";
import {ArrivdtColumns} from "../variables/arrivals_centerDt";

import {ShipdtColumns} from "../variables/shipments_centerDt";
import {shipmentsGetData} from "../models/data_processing";
import ShipmentsBody from "../models/shipments_document_body";

import {OrddtColumns} from "../variables/orders_centerDt";
import {ordersGetData, ordersSaveData} from "../models/data_processing";
import OrderBody from "../models/orders_document_body";


import {BaldtColumns} from "../variables/balance_centerDt";
import {balanceGetData} from "../models/data_processing";

export const main_tables_cfg = {

    arrivals: {
        loadData: arrivalsGetData,
        sorting: {id: "n_dt_invoice", dir: "desc"},
        docBody: ArrivalBody,
        columns: ArrivdtColumns,
        id: "_arrivals_main",
        _block: "recipient",
    },

    shipments: {
        loadData: shipmentsGetData,
        sorting: {id: "n_dt_invoice", dir: "desc"},
        docBody: ShipmentsBody,
        columns: ShipdtColumns,
        id: "_shipments_main",
    },

    orders: {
        loadData: ordersGetData,
        sorting: {id: "n_dt_send", dir: "desc"},
        docBody: OrderBody,
        columns: OrddtColumns,
        id: "_orders_main",
    },

    balances: {
        loadData: balanceGetData,
        sorting: {id: "n_product", dir: "asc"},
        columns: BaldtColumns,
        id: "_balances_main",
    }





}