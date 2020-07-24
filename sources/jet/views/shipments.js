"use strict";
import {JetView} from "webix-jet";
import ShipmentsHeaderView from "../models/shipments_header";
import ShipmentsCenterView from "../models/shipments_center";

export default class ShipmentsView extends JetView{

    constructor(app) {
        super(app)
    }

    config() {

        let app = this.app;
        var ui = {
            type:"line",
            // id: "main_ui",
            rows: [
                { $subview: ShipmentsHeaderView },
                {height: 2},
                // {},
                new ShipmentsCenterView(app, 'shipments'),
            ],
        };
        return ui;
    }


    init(){

    }

    ready() {
    }

}
