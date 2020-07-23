"use strict";

import {JetView} from "webix-jet";

import {message} from "../views/common";
import {screens, new_docs_menu, refs_menu} from "../views/variables";
import ArrivalsView from "../views/arrivals";
import OrdersView from "../views/orders";
import ShipmentsView from "../views/shipments";
import BalanceView from "../views/balance";
import PopMenuView from "../models/template_pop_menu";
import NewDocContextCenterDt from "../models/new_doc_context_center_dt";


// import MovingsView from "../models/movings";
// import TransfersView from "../models/transfers";
// import analiticView from "../views/analitics";
// import sView from "../views/setting-view";
// import uView from "../views/users-view";
import {button_template} from "../views/common";

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
                    type: 'htmlbutton',
                    longPress: !true,
                    width: 40,
                    height: 40, 
                    template: () => {
                        return button_template('./library/img/new-document.svg', 'Новый документ')
                    },
                    on: {
                        onItemClick:  function(id, e) {
                            (this.$scope.new_docs.isVisible()) ? this.$scope.new_docs.hide() : this.$scope.new_docs.show(this);
                        },
                    }
                },
                {view:"button", type: 'htmlbutton',
                    hidden: !true,
                    longPress: false,
                    height: 40,
                    width: 40,
                    template: () => {
                        return button_template('./library/img/references.svg', 'Справочники')
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
                    width: 40,
                    height: 40, 
                    template: () => {
                        return button_template('./library/img/stocks.svg', 'Остатки')
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
                    label: "",
                    localId: "__arrivals",
                    template: () => {
                        return button_template('./library/img/purchase_30x30.svg', 'Поступления')
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
                    localId: "__orders",
                    template: () => {
                        return button_template('./library/img/orders.svg', 'Заказы')
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
                    localId: "__shipments",
                    template: () => {
                        return button_template('./library/img/shipment.svg', 'Отгрузки')
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
                    longPress: false,
                    label: "", 
                    template: () => {
                        return button_template('./library/img/movings.svg', 'Перемещения')
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
                    label: "", 
                    template: () => {
                        return button_template('./library/img/transfers.svg', 'Передачи в розницу')
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
                    height: 40,
                    width: 40,
                    template: () => {
                        return button_template('./library/img/statistics_30x30.svg', 'Аналитика')
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
                    longPress: true,
                    width: 40,
                    height: 40, 
                    template: () => {
                        return button_template('./library/img/report.svg', 'Отчеты')
                    },
                    on: {
                        onItemClick: function () {
                            webix.message('Отчеты')
                        },
                    }
                },
                {view:"button", 
                    hidden: true,
                    type: 'htmlbutton',
                    longPress: true,
                    width: 40,
                    height: 40, 
                    template: () => {
                        return button_template('./library/img/settings.svg', 'Настройки')
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
                    longPress: true,
                    width: 40,
                    height: 40,
                    disabled: !(app.config.role != 9),
                    template: () => {
                        return button_template('./library/img/users.svg', 'Пользователи')
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
        let uid = options.id
        if (!this.screens[uid]) {
            let header = options.name
            if (!header) return false;
            var tabConfig = {
                id: uid,
                value: header, width: options.width,
                close: !true
                };
            let formConfig = {
                $scope: parent.$scope,
                id: uid,
                $subview: view
                };
            // console.log("formConfig", formConfig);
            // console.log("tabConfig", tabConfig);
            $$("__multiview").addView(formConfig);
            $$("__tabbar").addOption(tabConfig, true);
            this.screens[uid] = true;
        } else {
            $$("__tabbar").setValue(uid);
        }
    }

    clickButton(name) {
        if (name === 'arrivals') {
            this.$$("__arrivals").callEvent('onItemClick')
        } else if (name === 'shipments') {
            this.$$("__shipments").callEvent('onItemClick')
        }

    }

    ready() {
        this.screens = {"_mView": true}
        this.app.commonWidgets.sidebar = this;
    }

    init() {
        this.contextDt = this.ui(NewDocContextCenterDt);
        this.refs = this.ui(new PopMenuView(this.app, {buttons: refs_menu}))
        this.new_docs = this.ui(new PopMenuView(this.app, {buttons: new_docs_menu}))
    }
}
