"use strict";
import {JetView} from "webix-jet";
import OrdersHeaderView from "../models/orders_header";
import OrdersCenterView from "../models/orders_center";

export default class OrdersView extends JetView{

    constructor(app) {
        super(app)
    }

    config() {
        let app = this.app;
        var ui = {
            type:"line",
            rows: [
                { $subview: OrdersHeaderView },
                {height: 2},
                new OrdersCenterView(app, 'orders'),
            ],
        };
        return ui;
    }


    init(){

    }

    ready() {
    }

}
