"use strict";

import {JetView} from "webix-jet";
import {icon_buttons_cfg} from "../models/side_buttons_config";
import TemplateButtonContextMenu from "../models/template_button_context_menu"

export default class TemplateIconButtonView extends JetView{

    constructor(app, cfg) {
        super(app);
        this.cfg = cfg;
    }

    config(){
        let app = this.app;
        let cfg = icon_buttons_cfg[this.cfg.name];
        let css = [].concat(this.cfg.css || []).concat(cfg.css_class || []);
        let vidget_id = `__button__${this.cfg.name}`;
        let permission = (app.config.permitted.includes(vidget_id)) ? true : false;


        return {
            view:"button",
            hidden: (PRODUCTION) ? cfg.hidden : false,
            id: vidget_id,
            localId: "__i_but",
            hidden: !permission,
            longPress: cfg.longPress,
            width: cfg.width,
            template: () => {
                return app.getService("common").icon_button_template(cfg.label, cfg.icon, cfg.title, css)
            },
            on: {
                onItemClick:  function(id, e) {
                    if (this.$scope.context) {
                        this.$scope.setContext(e);
                    } else {
                        if (this.$scope.cfg.click) {
                        this.$scope.cfg.click(this);
                        } else {
                            document.message(this.$scope.cfg.name);
                        }
                    }
                },
            }
        }

    }


    setContext(e) {
        this.context.setContext({obj:webix.$$(e)});
        this.context.show(this.$$("__i_but").$view);
    }

    ready() {

    }

    init() {
        if (this.cfg.context) {
            this.context = this.ui(new TemplateButtonContextMenu(this.app, this.cfg.name));
        }
    }

}