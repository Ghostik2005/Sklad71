"use strict";
import {JetView} from "webix-jet";
import BalanceHeaderView from "../models/balance_header";
import BalanceCenterView from "../models/balance_center";

export default class BalanceView extends JetView{

    constructor(app) {
        super(app)
    }

    config() {
        let app = this.app;
        var ui = {
            type:"line",
            rows: [
                { $subview: BalanceHeaderView },
                {height: 2},
                new BalanceCenterView(app, 'balance'),
            ],
        };
        return ui;
    }


    init(){
        this.widget_name = "balance";
        this.app.commonWidgets[this.widget_name] = this;
    }

    ready() {
        
    }

}
