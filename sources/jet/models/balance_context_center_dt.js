"use strict";

import {JetView} from "webix-jet";
import {message, holdDocument, unHoldDocument, deleteDocument, unDeleteDocument} from "../views/common";
import {balance_context_center_dt_optoins, balance_excludeColumns} from "../views/variables";
import {newDocument} from "../views/common";


export default class BalanceContextCenterDt extends JetView{
    config(){
        let th = this;

        let c_menu = {
            view:'contextmenu', 
            autowidth: true,
            id:"balance_cmenu",
            css: "context_center_dt",
            point: true,
            on:{
                onMenuItemClick: function(id, e, html){
                    var context = this.getContext();
                    // console.log("id", id)
                    switch(id) {
                        case "1":
                            let row = context.table.getItem(context.position.row);
                            let copied = row[context.position.column];
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(copied).then(() => {
                                    message('Скопировано в буфер');
                                })
                            } else {
                                message('Браузер устарел, скопировать в буфер невозможно', 'error', 3);
                            };
                            break;
                        // case "2":
                        //     message('Загрузить');
                        //     break;
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

    show(e, position){
        let context = this.getRoot().getContext();
        // console.log('c', context);
        this.clearAll();
        this.parse(balance_context_center_dt_optoins);
        let id_hide = []
        if(context.position) {
            let item = context.table.getItem(context.position.row);
            if (item.n_state == 2) {
                id_hide = id_hide.concat([3, 6, 7])
            } else if (item.n_state == 1) {
                id_hide = id_hide.concat([4, 5, 7, 100, 200, 1003])
            } else if (item.n_state == 3) {
                id_hide = id_hide.concat([3, 4, 5, 6, 100, 200, 1003])
            }
            context.table.select(context.position, false);
            if (balance_excludeColumns.includes(context.position.column)) {
                id_hide = id_hide.concat([1, 1000]);
            }
        } else {//empty area is clicked
            id_hide = id_hide.concat([1, 1000, 3, 4, 5, 6, 7, 1001, 1002, 1003, 100, 200, 300, 1004, 10])
        }
        
        id_hide.forEach( (id)=> {
            this.getRoot().hideItem(id);

        })

        this.getRoot().show(e);
    }

    ready() {
    }

    init() {
    }
}