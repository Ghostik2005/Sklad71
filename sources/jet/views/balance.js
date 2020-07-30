"use strict";
import {JetView} from "webix-jet";
import BalanceHeaderView from "../models/balance_header";
import TemplateCenterView from "../models/template_main_table_center";

export default class BalanceView extends JetView{

    constructor(app, name) {
        super(app);
        this.widget_name = name;
    }

    config() {
        let local_this = this;
        let app = this.app;
        var ui = {
            type:"line",
            rows: [
                new BalanceHeaderView(app, local_this.widget_name),
                {height: 2},
                new TemplateCenterView(app, local_this.widget_name),
            ],
        };
        return ui;
    }


    init(){
    }

    ready() {
        
    }

}
