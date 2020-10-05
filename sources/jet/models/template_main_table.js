"use strict";
import {JetView} from "webix-jet";
import TemplateCenterView from "../models/template_main_table_center";
import TemplateMainHeaderView from "../models/template_main_table_header";


export default class TemplateMainTableView extends JetView{
    
    constructor(app, name, c_header) {
        super(app);
        this.p_name = name;
        this.app.commonWidgets[name] = {};
        this.c_header = c_header || TemplateMainHeaderView;


    }

    config() {
        let local_this = this;
        let app = this.app;
        var ui = {
            type:"line",
            rows: [
                new local_this.c_header(app, local_this.p_name),
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
