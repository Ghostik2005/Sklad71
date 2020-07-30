"use strict";

import {JetView} from "webix-jet";

import {message} from "../views/common";

import ArrivalsView from "../views/arrivals";
import OrdersView from "../views/orders";
import ShipmentsView from "../views/shipments";
import BalanceView from "../views/balance";
import PopMenuView from "../models/template_pop_menu";
import {screens} from "../views/variables";


export default class SideButtonsBar extends JetView{
    config(){
        let app = this.app;
        var side_bar = {view: 'toolbar', localId: "sideMenu", borderless: true,
            id: "_sideMenu",
            width: 44,
            rows: [
                {height: 20},
                {view:"button", 
                    hidden: !true,
                    id: "__button__new_document",
                    type: 'htmlbutton',
                    longPress: !true,
                    width: 40,
                    height: 40, 
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/new-document.svg', 'Новый документ', 'side_menu_button')
                    },
                    on: {
                        onItemClick:  function(id, e) {
                            (this.$scope.new_docs.isVisible()) ? this.$scope.new_docs.hide() : this.$scope.new_docs.show(this);
                        },
                    }
                },
                {view:"button", type: 'htmlbutton',
                    hidden: !true,
                    id: "__button__references",
                    longPress: false,
                    height: 40,
                    width: 40,
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/references.svg', 'Справочники', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function() {
                            (this.$scope.refs.isVisible()) ? this.$scope.refs.hide() : this.$scope.refs.show(this);
                        }
                    }
                },
                {view:"button", type: 'htmlbutton',
                    hidden: !true,
                    longPress: true,
                    id: "__button__balances",
                    width: 40,
                    height: 40, 
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/stocks.svg', 'Остатки', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function () {
                            this.$scope.add_bar(this, BalanceView);
                            // webix.message('Остатки/Движение товаров')
                        },
                    }
                },
                {view:"button", type: 'htmlbutton',
                    width: 40,
                    height: 40, 
                    longPress: false,
                    id: "__button__arrivals",
                    label: "",
                    localId: "__arrivals",
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/purchase_30x30.svg', 'Поступления', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function (id, event) {
                            this.$scope.add_bar(this, ArrivalsView);
                        },
                    }
                },
                {view:"button", type: 'htmlbutton',
                    width: 40,
                    height: 40, 
                    longPress: false,
                    label: "",
                    id: "__button__orders",
                    localId: "__orders",
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/orders.svg', 'Заказы', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function (id, event) {
                            this.$scope.add_bar(this, OrdersView);
                        },
                    }
                },
                {view:"button", type: 'htmlbutton',
                    width: 40,
                    height: 40, 
                    longPress: false,
                    label: "",
                    id: "__button__shipments",
                    localId: "__shipments",
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/shipment.svg', 'Отгрузки', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function (id, event) {
                            this.$scope.add_bar(this, ShipmentsView);
                        },
                    }
                },

                {view:"button", type: 'htmlbutton',
                    hidden: true,
                    width: 40,
                    height: 40, 
                    id: "__button__movements",
                    longPress: false,
                    label: "", 
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/movings.svg', 'Перемещения', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function (id, event) {
                            // this.$scope.add_bar(this, MovingsView);
                        },
                    }
                },
                {view:"button", type: 'htmlbutton',
                    hidden: true,
                    width: 40,
                    height: 40, 
                    longPress: false,
                    id: "__button__transfers",
                    label: "", 
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/transfers.svg', 'Передачи в розницу', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function (id, event) {
                            // this.$scope.add_bar(this, TransfersView);
                        },
                    }
                },
                {view:"button", type: 'htmlbutton',
                    hidden: true,
                    longPress: false,
                    id: "__button__analitics",
                    height: 40,
                    width: 40,
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/statistics_30x30.svg', 'Аналитика', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function () {
                            webix.message('Аналитика')
                            // this.$scope.add_bar(this, analiticView);
                            // this.$scope.add_bar(this);
                        }
                    }
                },
                {view:"button", type: 'htmlbutton',
                    hidden: true,
                    id: "__button__reports",
                    longPress: true,
                    width: 40,
                    height: 40, 
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/report.svg', 'Отчеты', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function () {
                            webix.message('Отчеты')
                        },
                    }
                },
                {view:"button", type: 'htmlbutton',
                    hidden: true,
                    id: "__button__options",
                    longPress: true,
                    width: 40,
                    height: 40, 
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/settings.svg', 'Настройки', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function () {
                            // this.$scope.add_bar(this, sView);
                            webix.message('Настройки интерфейса и т.п.')
                            // this.$scope.add_bar(this);
                        },
                    }
                },
                {view:"button", type: 'htmlbutton',
                    hidden: true,
                    id: "__button__users",
                    longPress: true,
                    width: 40,
                    height: 40,
                    disabled: !(app.config.role != 9),
                    template: () => {
                        return app.getService("common").html_button_template('./library/img/users.svg', 'Пользователи', 'side_menu_button')
                    },
                    on: {
                        onItemClick: function () {
                            webix.message('Права доступа пользователей')
                            // this.$scope.add_bar(this, uView);
                            // this.$scope.add_bar(this);
                        },
                    }
                },
                {}
                ]
            };
        return side_bar
        }



    add_bar(parent, view) {
        let options = (view === ArrivalsView) ? screens.arrivals :
                    (view === ShipmentsView) ? screens.shipments:
                    (view === BalanceView) ? screens.balance:
                    (view === OrdersView) ? screens.orders:
                    screens.info
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
                $subview: new view(this.app)
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
