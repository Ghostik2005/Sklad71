"use strict";

import {JetView} from "webix-jet";
import {message} from "../views/common";
import {new_doc_context_center_dt_optoins} from "../views/variables";
import {newDocument} from "../views/common";


export default class NewDocContextCenterDt extends JetView{
    config(){
        let th = this;

        let c_menu = {
            view:'contextmenu', 
            autowidth: true,
            id:"new_doc_cmenu",
            css: "context_center_dt",
            point: true,
            on:{
                onMenuItemClick: function(id, e, html){
                    var context = this.getContext();
                    // console.log("id", id)
                    switch(id) {
                        case "901":
                            newDocument.arrival(th);
                            break;
                        case "902":
                            newDocument.shipment(th);
                            break;
                        default:
                            message(this.getMenuItem(id).value);
                            break

                    }
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

    show(e){
        let context = this.getRoot().getContext();
        // console.log('c', context);
        this.clearAll();
        this.parse(new_doc_context_center_dt_optoins);
        this.getRoot().show(e);
    }

    ready() {
    }

    init() {
    }
}