"use strict";

import {JetView} from "webix-jet";



export default class ButtonTemplate extends JetView{

    constructor(app, cfg) {
        super(app);
        this.cfg = cfg;
    }

    config(){
        let button = {view:"button",
            localId: "__button",
            // type: "icon",
            width: this.cfg.width,
            // icon: "mdi-filter-remove-outline",
            label: this.cfg.label,
            // css: "remove_filter",
            on: {
                onItemClick: () => {
                    
                    this.cfg.callback(this)
                    this.getRoot().getParentView().$scope.hide();
                },
            },
        }
        return button
    }

    ready() {

    }

    init() {
    }
}