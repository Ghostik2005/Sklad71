"use strict";

import {JetView} from "webix-jet";
import {message} from "../views/common";
import {tables_excludeColumns} from "../views/variables";
import {newDocument} from "../models/common_functions";
import {menu_options, shipments_menu_options_excludes} from "../views/variables";


export default class ShipmentsContextCenterDt extends JetView{
    config(){
        let th = this;
        let app = this.app;
        let c_menu = {
            view:'contextmenu', 
            autowidth: true,
            localId:"__shipments_cmenu",
            css: "context_center_dt",
            point: true,
            on:{
                onMenuItemClick: function(id, e, html){
                    var context = this.getContext();
                    console.log('row', context.position);
                    let row = (context.position) ? context.table.getItem(context.position.row) : undefined;
                    let r_data;
                    console.log("id", id)
                    switch(id) {
                        case "1":
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
                        case "3":
                            r_data = app.getService("common").holdDocument('shipment', row.n_id, row.id);
                            //делаем изменения в таблице
                            if (r_data.data) {
                                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
                            }

                            break;
                        case "4":
                            r_data = app.getService("common").unHoldDocument('shipment', row.n_id, row.id);
                            //делаем изменения в таблице
                            if (r_data.data) {
                                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
                            }
                            break;
                        case "6":
                            r_data = app.getService("common").deleteDocument('shipment', row.n_id, row.id);
                            //делаем изменения в таблице
                            if (r_data.data) {
                                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
                            }
                            break;
                        case "7":
                            r_data = app.getService("common").unDeleteDocument('shipment', row.n_id, row.id);
                            //делаем изменения в таблице
                            if (r_data.data) {
                                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
                            }
                            break;
                        case "901":
                            newDocument.arrival(th);
                            break;
                        case "902":
                            newDocument.shipment(th);
                            break;
                        // case "6":    
                        //     message('Action2');
                        //     break;
                        // case "7":
                        //     message('Action3');
                        //     break;
                        // case "200":
                        //     message('Печать');
                        //     break;
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
        this.parse(menu_options);
        let id_hide = []
        id_hide = id_hide.concat(shipments_menu_options_excludes);
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
            if (tables_excludeColumns.includes(context.position.column)) {
                id_hide = id_hide.concat([1, 1000]);
            }
        } else {//empty area is clicked
            id_hide = id_hide.concat([1, 1000, 3, 4, 5, 6, 7, 1001, 1002, 1003, 100, 200, 300, 1004, 10])
        }
        id_hide = Array.from(new Set(id_hide));
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