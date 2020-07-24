"use strict";

import {JetView} from "webix-jet";
import infoView from "../models/info_view";

export default class CenterView extends JetView{
    config(){


        var tabbar = {
            view: "tabbar",
            tabMargin: 8,
            localId: "_tabbar",
            id: "__tabbar",
            borderless: true,
            popupWidth:170,
            tabMinWidth:170,
            tabMoreWidth:70,
            animate: false,
            multiview: true,
            on: {
                onOptionRemove: (id) => {
                    // $$("__multiview").removeView(id);
                    $$(id).destructor();
                    delete $$("_sideMenu").$scope.screens[id];
                },
                onChange: (i, ii) => {                    
                }
            },
            options: [
                {value: "Информация", id: "_mView", close: false, width: 120},
                ]
            };
        var tabmain = {
            width: document.documentElement.clientWidth-46,
            view: "multiview",
            id: "__multiview",
            animate: false,
            keepViews:true,
            cells: [
                {$subview: infoView, id: "_mView"},
            ]
            };


        return {
            view: "layout",
            // css: "full-size",
            // css: 'center_view',
            cols: [
                {width: 1}, 
                {rows: [
                    tabbar,
                    tabmain,

                ]},
                {width: 1},
            ]
        }

    }


    ready() {
        
    }
    
    init() {
        
    }
}
