"use strict";

import {JetView} from "webix-jet";
import infoView from "../models/info_view";
import { message } from "./common";

export default class CenterView extends JetView{
    config(){
        let app = this.app;

        var tabbar = {
            view: "tabbar",
            tabMargin: 8,
            localId: "__tabbar",
            borderless: true,
            popupWidth:170,
            tabMinWidth:170,
            tabMoreWidth:70,
            animate: false,
            multiview: true,
            on: {
                onOptionRemove: (id) => {
                    $$(id).destructor();
                    delete  app.commonWidgets.sidebar.screens[id];
                },
                onBeforeTabClose: (id) => {
                    if (Object.keys(app.commonWidgets.sidebar.screens).length <= 1) {
                        message('Для работы нужна хотя бы одна вкладка', 'error');
                        return false;
                    }
                },
            },
            options: [
                {value: "Информация", id: "_mView", close: !false, width: 130},
                ]
            };
        var tabmain = {
            width: document.documentElement.clientWidth-46,
            view: "multiview",
            localId: "__multiview",
            animate: false,
            keepViews:true,
            cells: [
                {$subview: infoView, id: "_mView"},
            ]
            };


        return {
            view: "layout",
            id: "__bar__main_center",
            rows: [
                tabbar,
                tabmain,
            ]
        }
    }

    setValue(id){
        this.$$("__tabbar").setValue(id);
    }

    addBar(formConfig, tabConfig) {
        let result = true;
        try {
            this.$$("__multiview").addView(formConfig);
            this.$$("__tabbar").addOption(tabConfig, true);
        } catch(e) {
            result = false
        }
        return result
    }


    ready() {
        this.app.commonWidgets[this.widget_name] = this;
        
    }
    
    init() {
        this.widget_name = "centerbar";
        
    }
}
