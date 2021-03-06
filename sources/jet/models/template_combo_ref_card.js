"use strict";

import {JetView} from "webix-jet";
import {filters_process}  from "../models/data_processing";

export default class TemplateComboRefCard extends JetView{

    constructor(app, cfg) {
        super(app);
        let default_cfg = {
            width: 150,
            labelName: "label",
            labelWidth: 100,
            labelPosition: "top",
            name: "c_label",
            fitMaster: false
        }
        this.cfg = Object.assign(default_cfg, cfg || {});
    }

    config(){

        let combo = {view: "combo",
            name: this.cfg.name,
            localId: `__${this.cfg.name}`,
            label: this.cfg.labelName,
            labelPosition: this.cfg.labelPosition,
            labelWidth: this.cfg.labelWidth,
            tooltip: true,
            height: (this.cfg.labelPosition === 'top') ? 60 : 38,
            inputHeight: 38,
            width: this.cfg.width,
            tooltip: function(obj){
                return obj.text;
            },
            on: {
                onKeyPress: (code, event) => {
                    if (code === 27 && this.cfg.cancel) {
                        this.cfg.cancel.callEvent('onItemClick')
                    };

                },
            },
            options: {
                fitMaster: this.cfg.fitMaster,
                filter:function(obj, value){
                    var vf = obj.value.toString().toLowerCase().indexOf(value) != -1;
                    return vf;
                },
                body: {
                    tooltip: true,
                    width: +this.cfg.width * 1.2,
                    parentName: this.cfg.name,
                    yCount: 10,
                    scroll: true,
                    url: function(params) {
                        return filters_process.get_ref_filters(params, this);
                    },
                    type:{
                        height:32
                    }
                }
            },
            value: this.cfg.value,
        }
        return combo
    }

    ready() {
    }

    init() {
    }
}

