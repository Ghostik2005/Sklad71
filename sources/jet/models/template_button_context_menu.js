"use strict";

import {JetView} from "webix-jet";
import {button_menu_options} from "../variables/variables";

import {handle_buttom_context} from "../models/context_menu_handler";


export default class TemplateButtonContextMenu extends JetView{

    constructor(app, name){
        super(app);
        this.p_name = name;
    }

    config(){
        let g_this = this;
        console.log('dd', g_this.p_name);
        let c_menu = {
            view:'contextmenu',
            autowidth: true,
            localId: `__${g_this.p_name}_cmenu`,
            css: "context_menu",
            point: true,
            on:{
                onMenuItemClick: function(id, e, html){
                    var context = this.getContext();
                    let cfg = {local_this: this, context: context, id: id}
                    handle_buttom_context[g_this.p_name](cfg)
                },
            }
        }

        return c_menu
    }

    isVisible() {
        return this.getRoot().isVisible();
    }

    hide() {
        this.getRoot().hide();
    }

    attachTo(parent) {
        this.getRoot().attachTo(parent);
    }

    setContext(context) {
        this.getRoot().setContext(context);
    }

    clearAll() {
        this.getRoot().clearAll();
    }

    parse(obj) {
        this.getRoot().parse(obj);
    }

    show(e, position){
        this.clearAll();
        this.parse(button_menu_options[this.p_name]);
        this.getRoot().show(e, {x:0, y:-3});
    }

    ready() {
    }

    init() {
    }
}