"use strict";

import {JetView} from "webix-jet";
import {button_menu_options} from "../variables/variables";
import {icon_buttons_cfg} from "../models/side_buttons_config";

import {handle_buttom_context} from "../models/context_menu_handler";


export default class TemplateMenuButtonMenu extends JetView{

    constructor(app, cfg){
        super(app);
        this.cfg = cfg;
        this.p_name = cfg.name;
    }

    config(){
        let app = this.app;
        let cfg = icon_buttons_cfg[this.p_name];
        let g_this = this;
        let menu = {
            view:'menu', 
            width: cfg.width,
            autowidth: true,
            id: `__${g_this.p_name}_menu`,
            data: {id: -1, 
                value: app.getService("common").icon_menu_button_template(cfg.label, cfg.icon, cfg.title),
                submenu: button_menu_options[this.p_name],
                config:{
                    type: {
                        height: 30
                    },
                },
            },
            on:{
                onMenuItemClick: function(id, e, html){
                    console.log('m i', id)
                    console.log('m e', e)
                    let cfg = {local_this: this, id: id}
                    handle_buttom_context[g_this.p_name](cfg)
                },
            }
        }

        return menu
    }


    ready() {
    }

    init() {
    }
}