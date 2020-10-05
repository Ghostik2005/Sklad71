"use strict";

import {JetView} from "webix-jet";
import {side_buttons_cfg} from "../models/side_buttons_config";

export default class TemplateSideButtonView extends JetView{

    constructor(app, cfg) {
        super(app);
        this.cfg = cfg;
    }

    config(){
        let app = this.app;
        let cfg = side_buttons_cfg[this.cfg.name];
        let vidget_id = `__button__${this.cfg.name}`;
        let permission = (app.config.permitted.includes(vidget_id)) ? true : false;

        return {
            view:"button",
            hidden: (PRODUCTION) ? cfg.hidden : false,
            id: vidget_id,
            type: 'htmlbutton',
            hidden: !permission,
            longPress: cfg.longPress,
            width: 40,
            height: 40,
            template: () => {
                return app.getService("common").html_button_template(cfg.img, cfg.title, cfg.css_class)
            },
            on: {
                onItemClick:  function(id, e) {
                    if (this.$scope.cfg.click) {
                        this.$scope.cfg.click(this);
                    } else {
                        document.message(this.$scope.cfg.name);
                    }
                },
            }
        }

    }

}