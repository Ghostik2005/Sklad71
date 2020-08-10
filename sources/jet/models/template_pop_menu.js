"use strict";

import {JetView} from "webix-jet";
import ButtonTemplate from "../models/template_menu_button";
import {menus} from "../models/refs_variables";

export default class PopMenuView extends JetView{

    constructor(app, cfg) {
        super(app);
        this.cfg = cfg;
    }
    config(){
        return {view: "popup",
            // head: "sub-menu",
            loclalId: "_pop",
            // width: 140,
            padding: 2,
            point: true,
            css: "pop-up-menu",
            relative: true,
            body: { 
                cols: [
                    {//view: "form",
                        // minWidth: 160,
                        localId: "__mform",
                        rows: [
                        ]
                    },
                    {//view: "form",
                        // minWidth: 160,
                        hidden: true,
                        localId: "__eform",
                        rows: [
                        ]
                    },
                ]
            }
        }
    }

    isVisible() {
        return this.getRoot().isVisible();
    }
    show(target){
        return this.getRoot().show(target.$view, {x:0, y:-3});
    }
    hide(){
        return this.getRoot().hide();
    }

    init(){

    }

    ready() {
        // console.log("cfg", this.cfg);
        // let buttons = this.cfg.buttons;
        // console.log('menus', menus);
        let buttons = menus[this.cfg.name];
        let s1, s2;
        if (buttons.length > 10) {
            s1 = buttons.slice(0,10);
            s1.forEach( (item) => {
                this.$$("__mform").addView(new ButtonTemplate(this.app, item))
            })
            s2 = buttons.slice(10);
            this.$$("__eform").show();
            s2.forEach( (item) => {
                this.$$("__eform").addView(new ButtonTemplate(this.app, item))
            })
        } else {
            buttons.forEach( (item) => {
                this.$$("__mform").addView(new ButtonTemplate(this.app, item))
            })
        }
        // this.$$("__mform").resize();
        // this.$$("__eform").resize();
    }
}
