"use strict";

import {JetView} from "webix-jet";



export default class ButtonUnFilter extends JetView{

    constructor(app, global_this,element_id) {
        super(app);
        this.element_id = element_id;
        this.global_this = global_this;
    }

    config(){
        let button = {view:"button",
            localId: "__button",
            type: "icon",
            width: 32,
            icon: "mdi-filter-remove-outline",
            label: "",
            css: "remove_filter",
            on: {
                onItemClick: ()=> {
                    this.global_this.$$(this.element_id).setValue();
                }
            },
        }
        return button
    }

    click() {
        this.$$("__button").callEvent("onItemClick");
    }

    ready() {

    }

    init() {
    }
}