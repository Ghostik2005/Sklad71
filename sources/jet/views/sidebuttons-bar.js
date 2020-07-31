"use strict";

import {JetView} from "webix-jet";
import BalanceView from "../views/balance";
import PopMenuView from "../models/template_pop_menu";
import {screens} from "../variables/variables";
import TemplateMainTableView from  "../models/template_main_table";
import TemplateSideButtonView from "../models/template_button_side";

export default class SideButtonsBar extends JetView{
    config(){
        let app = this.app;
        let l_this = this;
        var side_bar = {view: 'toolbar', localId: "sideMenu", borderless: true,
            id: "_sideMenu",
            width: 44,
            rows: [
                {height: 20},
                new TemplateSideButtonView(app, {
                    name: "new_document", 
                    click: function(lt) {
                        (l_this.new_docs.isVisible()) ? l_this.new_docs.hide() : l_this.new_docs.show(lt);
                    }
                }),
                new TemplateSideButtonView(app, {
                    name: "references", 
                    click: function(lt) {
                        (l_this.refs.isVisible()) ? l_this.refs.hide() : l_this.refs.show(lt)
                    }
                }),
                new TemplateSideButtonView(app, {
                    name: "balances", 
                    click: function(lt) {
                        l_this.add_bar(lt, BalanceView, "balances");
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
                {view: "side-menu-separator", hidden: PRODUCTION},
                new TemplateSideButtonView(app, {
                    name: "analitics", 
                    click: function(lt) {
                        // l_this.add_bar(lt, TemplateMainTableView, "analitics");
                        document.message('analitics');
                    }
                }),
                new TemplateSideButtonView(app, {
                    name: "reports", 
                    click: function(lt) {
                        // l_this.add_bar(lt, TemplateMainTableView, "reports");
                        document.message('reports');
                    }
                }),
                new TemplateSideButtonView(app, {
                    name: "options", 
                    click: function(lt) {
                        // l_this.add_bar(lt, TemplateMainTableView, "options");
                        document.message('Настройки интерфейса и т.п.');
                    }
                }),
                new TemplateSideButtonView(app, {
                    name: "users", 
                    click: function(lt) {
                        // l_this.add_bar(lt, TemplateMainTableView, "users");
                        document.message('Права доступа пользователей');
                    }
                }),
                {view: "side-menu-separator", hidden: PRODUCTION},
                new TemplateSideButtonView(app, {
                    name: "movings", 
                    click: function(lt) {
                        // l_this.add_bar(lt, TemplateMainTableView, "movings");
                        document.message('movings');
                    }
                }),
                new TemplateSideButtonView(app, {
                    name: "transfers", 
                    click: function(lt) {
                        // l_this.add_bar(lt, TemplateMainTableView, "transfers");
                        document.message('transfers');
                    }
                }),
                {}
                ]
            };
        return side_bar
        }



    add_bar(parent, view, view_name) {
        let options = (screens[view_name]) ? screens[view_name] : screens.info
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
                $subview: new view(this.app, view_name)
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
        this.new_docs = this.ui(new PopMenuView(this.app, {buttons: "new_docs_menu", name: "docs"}));
        this.app.commonWidgets[this.widget_name] = this;
    }
}
