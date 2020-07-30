"use strict";
import {JetView} from "webix-jet";
import TemplateCenterView from "../models/template_main_table_center";
import TemplateMainHeaderView from "../models/template_main_table_header";


export default class TemplateMainTableView extends JetView{
    
    constructor(app, name) {
        super(app);
        this.p_name = name;
        console.log('name', name);

    }

    config() {
        let local_this = this;
        let app = this.app;
        var ui = {
            type:"line",
            rows: [
                new TemplateMainHeaderView(app, local_this.p_name),
                {height: 2},
                new TemplateCenterView(app, local_this.p_name),
            ],
        };
        return ui;
    }


    init(){

    }

    ready() {
    }

}
