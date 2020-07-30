"use strict";

import {JetView} from "webix-jet";



export default class CommonButtonTemplate extends JetView{

    constructor(app, cfg) {
        super(app);
        this.cfg = cfg;
    }

    config(){
        let local_this = this;
        let button_id = `__button__${local_this.cfg.name}`;

        let button = {view:"button",
            localId: "__button",
            id: button_id,
            type: "icon",
            width: this.cfg.width || 102,
            // icon: "mdi-filter-remove-outline",
            label: this.cfg.label,
            css: local_this.button_css.join(" "),
            on: {
                onItemClick: () => {
                    local_this.cfg.callback(local_this.cfg.parent, local_this)
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