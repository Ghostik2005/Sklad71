"use strict";
import {JetView} from "webix-jet";


export default class FooterView extends JetView{
    config(){
        var cfg = this.app.config;
        var prod = (cfg.production) ? "Production" : "test";
        return {view: 'toolbar',
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
    
    ready() {
        this.app.commonWidgets['footer'] = this;
    }
}
