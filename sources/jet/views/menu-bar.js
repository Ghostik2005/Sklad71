"use strict";

import {JetView} from "webix-jet";
import PopMenuView from "../models/template_pop_menu";
import {screens} from "../variables/variables";
import TemplateMainTableView from  "../models/template_main_table";
import TemplateSideButtonView from "../models/template_button_side";
import TemplateIconButtonView from "../models/template_icon_button";
import TemplateMenuButtonMenu from "../models/template_menu_button_menu";
import BalanceHeaderView from "../models/balance_header";

export default class MenuButtonsBar extends JetView{
    config(){
        let app = this.app;
        let l_this = this;
        var side_bar = {view: 'toolbar',
            css: "side_bar_bar",
            id: "_sideMenu",
            height: 44,
            // width: 44,
            cols: [
                new TemplateSideButtonView(app, {
                    name: "references",
                    click: function(lt) {
                        (l_this.refs.isVisible()) ? l_this.refs.hide() : l_this.refs.show(lt)
                    }
                }),
                new TemplateSideButtonView(app, {
                    name: "balances",
                    click: function(lt) {
                        l_this.add_bar(lt, TemplateMainTableView, "balances");
                    }
                }),
                new TemplateSideButtonView(app, {
                    name: "arrivals",
                    click: function(lt) {
                        l_this.add_bar(lt, TemplateMainTableView, "arrivals");
                    }
                }),
                new TemplateSideButtonView(app, {
                    name: "orders",
                    click: function(lt) {
                        l_this.add_bar(lt, TemplateMainTableView, "orders");
                    }
                }),
                new TemplateSideButtonView(app, {
                    name: "shipments",
                    click: function(lt) {
                        l_this.add_bar(lt, TemplateMainTableView, "shipments");
                    }
                }),
                {view: "side-menu-separator"},
                new TemplateMenuButtonMenu(app, {name: "documents"}),
                new TemplateMenuButtonMenu(app, {name: "journals"}),
                new TemplateMenuButtonMenu(app, {name: "products"}),
                new TemplateMenuButtonMenu(app, {name: "classifiers"}),
                {view: "side-menu-separator"},
                new TemplateMenuButtonMenu(app, {name: "contragents"}),
                {view: "side-menu-separator"},
                new TemplateIconButtonView(app, {name: "reports"}),
                new TemplateIconButtonView(app, {name: "analitics"}),
                {},
                {view: "side-menu-separator", hidden: PRODUCTION},
                new TemplateMenuButtonMenu( app, {name: "managements"}),
                new TemplateMenuButtonMenu( app, {name: "options"}),
            ]};
        return side_bar
        }

    add_bar(parent, view, view_name) {
        let options = (screens[view_name]) ? screens[view_name] : screens.info;
        let c_header = (view_name == 'balances') ? BalanceHeaderView : undefined;
        let uid = options.id;
        if (!this.screens[uid]) {
            let header = options.name
            if (!header) return false;
            var tabConfig = {
                id: uid,
                value: header, width: options.width,
                close: true
            };
            let formConfig = {
                $scope: parent.$scope,
                id: uid,
                $subview: new view(this.app, view_name, c_header)
            };

            if (this.app.commonWidgets.centerbar.addBar(formConfig, tabConfig)) this.screens[uid] = true;

        } else {
            this.app.commonWidgets.centerbar.setValue(uid);
        }
    }

    ready() {
        this.screens = {"_mView": true};
    }

    init() {
        this.widget_name = "sidebar";
        this.refs = this.ui(new PopMenuView(this.app, {buttons: "refs_menu", name: "refs"}));
        this.app.commonWidgets[this.widget_name] = this;
    }
}
