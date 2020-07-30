"use strict";

import {JetView} from "webix-jet";

export default class TemplateRefreshButton extends JetView{

    constructor(app, widget) {
        super(app);
        this.widget = widget;
    }

    config(){
        let app = this.app;
        let button =  {view:"button", type: 'htmlbutton',
            width: 35,
            height: 35, 
            longPress: false,
            label: "",
            localId: "__refresh",
            template: () => {
                return app.getService("common").html_button_template('./library/img/refresh_1.svg', 'Обновить')
            },
            on: {
                onItemClick:  (id, event) => {
                    this.app.commonWidgets[this.widget].center_table.getData();
                },
            }
        }
         
        return button
    }


    ready() {

    }

    init() {
    }
}
