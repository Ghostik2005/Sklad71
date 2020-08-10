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
        // let context = this.getRoot().getContext();
        // console.log('c', context);
        this.clearAll();
        this.parse(button_menu_options[this.p_name]);
        
        // let id_hide = []
        // id_hide = id_hide.concat(context_menu_excludes[this.p_name]);
        // if(context.position) {
        //     let item = context.table.getItem(context.position.row);
        //     if (item.n_state == 2) {
        //         id_hide = id_hide.concat([3, 6, 7])
        //     } else if (item.n_state == 1) {
        //         id_hide = id_hide.concat([4, 5, 7, 100, 200, 1003])
        //     } else if (item.n_state == 3) {
        //         id_hide = id_hide.concat([3, 4, 5, 6, 100, 200, 1003])
        //     }
        //     context.table.select(context.position, false);
        //     if (tables_excludeColumns.includes(context.position.column)) {
        //         id_hide = id_hide.concat([1, 1000]);
        //     }
        // } else {//empty area is clicked
        //     id_hide = id_hide.concat([1, 1000, 3, 4, 5, 6, 7, 1001, 1002, 1003, 100, 200, 300, 1004, 10])
        // }
        // id_hide = Array.from(new Set(id_hide));
        // id_hide.forEach( (id)=> {
        //     this.getRoot().hideItem(id);

        // })

        this.getRoot().show(e, {x:0, y:-3});
    }

    ready() {
    }

    init() {
    }
}