"use strict";
import {JetView} from "webix-jet";


export default class FooterView extends JetView{
    config(){
        var cfg = this.app.config;
        var prod = (cfg.production) ? "Production" : "test";
        return {view: 'toolbar',
            id: "__bar__main_footer",
            css: 'margin0',
            borderless: true,
            cols: [
                {view: "label",
                    label: "<span class='footer'>Вы находитесь на сервере:  " + location.hostname + " | " + prod  + " | " + cfg.name  + " | " + cfg.version + "</span>",
                    height: 14
                },

            ]
        }
    }

    init() {
        this.widget_name = "footer";
    }
    
    ready() {
        this.app.commonWidgets[this.widget_name] = this;
    }
}
