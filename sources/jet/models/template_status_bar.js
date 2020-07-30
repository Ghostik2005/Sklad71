"use strict";

import {JetView} from "webix-jet";
import {bSpace} from "../variables/variables";



export default class TemplateStatusBar extends JetView{

    constructor(app, name) {
        super(app);
        this.p_name = name;
        this.app.commonWidgets[this.p_name]['status_bar'] = this;
    }

    config(){
        let local_this = this;
        let app = this.app;
        let statusbar = { 
            borderless: true,
            cols: [
                {view: "label", 
                    autowidth: true,
                    label: "Фильтры: ",
                    on: {
                        onItemClick: ()=> {
                            if (app.commonWidgets[local_this.p_name] && 
                                app.commonWidgets[local_this.p_name].button_filter &&
                                app.commonWidgets[local_this.p_name].button_filter.buttonClick) 
                            {
                                app.commonWidgets[local_this.p_name].button_filter.buttonClick()
                            }
                        }
                    }
                },
                {width: bSpace},
                {view: "label", 
                    autowidth: true,
                    css: "status_bar",
                    localId: "__status",
                    label: "нет",
                    on: {
                        onItemClick: ()=> {
                            if (app.commonWidgets[local_this.p_name] && 
                                app.commonWidgets[local_this.p_name].button_filter &&
                                app.commonWidgets[local_this.p_name].button_filter.buttonClick) 
                            {
                                app.commonWidgets[local_this.p_name].button_filter.buttonClick()
                            }
                        }
                    }

                },
            ]
        }

        return statusbar
    }

    setStatus() {
        let filters = this.app.commonWidgets[this.p_name].menu_filters.getFiltersValue();
        let new_label = [];
        for (var elem in filters) {
            let text = filters[elem];
            if (text) {
                let title = document.app.translates[elem].value;
                new_label.push(`${title}: ${text}`);
            }
        }
        new_label = (new_label.length > 0) ? new_label.join('; ') : 'нет'
        this.$$("__status").define({label: new_label, tooltip: new_label});
        this.$$("__status").refresh();
        this.$$("__status").resize();
    }

    ready() {
        this.$$("__status").resize();
    }

    init() {
    }
}