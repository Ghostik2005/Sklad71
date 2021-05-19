"use strict";

import * as refColumns from "../variables/refs_columns_dt";
import RefProductsView from "../models/ref_products";
import RefView from "../models/template_ref_view";
import {newDocument} from "../models/common_functions";
import TemplateMainTableView from  "../models/template_main_table";



export const menus = {

    docs: [ // кнопки создания новых документов
        {width: 160, label: "Приход",
            callback: newDocument.arrival
        },
        {width: 160, label: "Перемещение",
            callback: newDocument.movement
        },
        {width: 160, label: "Продажа",
            callback: newDocument.shipment
        },
        {width: 160, label: "Ввод остатков",
            callback: newDocument.rest
        },
        {width: 160, label: "Списание",
            callback: newDocument.writeoff
        },
     ],



     contragents: [ // кнопки контрагентов
        {width: 160, label: "Контрагенты",
            callback: (th) => {
                document.message("Контрагенты---");
            }
        },
        {width: 160, label: "Группы контрагентов",
            callback: (th) => {
                document.message("Группы контрагентов");
            }
        },
        {width: 160, label: "Виды контрагентов",
            callback: (th) => {
                // document.message("Виды контрагентов");
            }
        },
        {width: 160, label: "Сегменты контрагентов",
            callback: (th) => {
                document.message("Сегменты контрагентов");
            }
        },
        {width: 160, label: "Подразделения контрагентов",
            callback: (th) => {
                document.message("Подразделения контрагентов");
            }
        },
     ],

    products: [ //кнопки товаров
        {width: 160, label: "Остатки", callback: (th) => {
                let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                cw.sidebar.add_bar(th, TemplateMainTableView, "balances")
            }
        },
        {width: 160, label: "Движение товаров", callback: (th) => {
                document.message("Движение товаров");
                // let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                // cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },
        {width: 160, label: "Номенклатура", callback: (th) => {
                let v = new RefProductsView($$("sklad_main_ui").$scope.app)
                let s = $$("sklad_main_ui").$scope.ui(v)
                s.show('Справочник номенклатуры товаров')
            }
        },
        {width: 160, label: "Группы номенклатуры", callback: (th) => {
                document.message("Группы номенклатуры");
                // не используется файл?????????????
                // let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                // cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },
        {width: 160, label: "Бренды", callback: (th) => {
                document.message("Бренды");
                // let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                // cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },
        {width: 160, label: "Виды номенклатуры", callback: (th) => {
                document.message("Виды номенклатуры");
                // let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                // cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },
        {width: 160, label: "Сегменты номенклатуры", callback: (th) => {
                document.message("Сегменты");
                // let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                // cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },
        {width: 160, label: "Штрихкоды", callback: (th) => {
                document.message("Штрихкоды");
                // let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                // cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },

    ],

    reports: [
        {width: 160, label: "Движение товаров", callback: (th) => {
                let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                document.message("Движ1");
                // cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },
    ],

    journals: [ //кнопки журналов
        {width: 160, label: "Приходы", callback: (th) => {
                let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },
        {width: 160, label: "Оприходывания остатков", callback: (th) => {
                document.message("--Оприходывания остатков");
                // let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                // cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },
        {width: 160, label: "Перемещения", callback: (th) => {
                document.message("Перемещения");
                // let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                // cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },
        {width: 160, label: "Заказы", callback: (th) => {
                document.message("Заказы");
                let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                cw.sidebar.add_bar(th, TemplateMainTableView, "orders")
            }
        },
        {width: 160, label: "Продажи", callback: (th) => {
                document.message("Продажи");
                let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                cw.sidebar.add_bar(th, TemplateMainTableView, "shipments")
            }
        },
        {width: 160, label: "Списания", callback: (th) => {
                document.message("Списания");
                // let cw = $$("sklad_main_ui").$scope.app.commonWidgets;
                // cw.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
            }
        },
    ],

    classifiers: [//классификаторы
        {width: 160, label: "Валюты", callback: ()=> {
            document.message("Валюты")
            }
        },
        {width: 160, label: "Банки", callback: ()=> {
            document.message("Банки")
            }
        },
        {width: 160, label: "Регионы", callback: ()=> {
            document.message("Регионы")
            }
        },
        {width: 160, label: "НДС", callback: ()=> {
            let cfg = {
                name: "vats",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.vatsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show('НДС');
            }
        },
        {width: 160, label: "Торговые марки", callback: ()=> {
            let cfg = {
                name: "trademarks",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.trademarksColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Торговые марки");
            }
        },
        {width: 160, label: "СПЕ", callback: ()=> {
            let cfg = {
                name: "spes",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.spesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("СПЕ");
            }
        },
        {width: 160, label: "Формы выпуска", callback: ()=> {
            let cfg = {
                name: "relforms",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.relformsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Формы выпуска");
            }
        },

        {width: 160, label: "Упаковки", callback: ()=> {
            let cfg = {
                name: "packagings",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.packsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Упаковки");
            }
        },
        {width: 160, label: "МНН", callback: ()=> {
            let cfg = {
                name: "mnns",
                sorting: {id: "c_rusname", dir: "asc"},
                columns: refColumns.mnnsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("МНН");
            }
        },
        {width: 160, label: "Мегакатегории", callback: ()=> {
            let cfg = {
                name: "megacategories",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.megasColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Мегакатегории");
            }
        },
        {width: 160, label: "Производители", callback: ()=> {
            let cfg = {
                name: "manufacturers",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.mansColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Производители");
            }
        },
        {width: 160, label: "Группы", callback: ()=> {
            let cfg = {
                name: "groups",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.groupsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Группы");
            }
        },
        {width: 160, label: "Направления", callback: ()=> {
            let cfg = {
                name: "directions",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.dirsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Направления");
            }
        },
        {width: 160, label: "Дозировки", callback: ()=> {
            let cfg = {
                name: "dosages",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.dosagesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Дозировки");
            }
        },
        {width: 160, label: "Страны", callback: ()=> {
            let cfg = {
                name: "countries",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.countriesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Страны");
            }
        },
        {width: 160, label: "Категории", callback: ()=> {
            let cfg = {
                name: "categories",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.catsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Категории");
            }
        },
        {width: 160, label: "Области применения", callback: ()=> {
            let cfg = {
                name: "appareas",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.appareasColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Области применения");
            }
        },
    ],

     refs: [ // кнопки меню справочников
        {width: 160, label: "Товары", callback: (th) => {
                let v = new RefProductsView($$("sklad_main_ui").$scope.app)
                let s = $$("sklad_main_ui").$scope.ui(v)
                s.show('Справочник товаров')
            }
        },
        {width: 160, label: "Контрагенты", callback: ()=> {
            let cfg = {
                name: "partners",
                sorting: {id: "n_name", dir: "asc"},
                columns: refColumns.partnersColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show('Контрагенты');
            }
        },
        {width: 160, label: "Подразделения", callback: ()=> {
            let cfg = {
                name: "points",
                sorting: {id: "n_name", dir: "asc"},
                columns: refColumns.pointsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show('Подразделения');
            }
        },
        {width: 160, label: "НДС", callback: ()=> {
            let cfg = {
                name: "vats",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.vatsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show('НДС');
            }
        },
        {width: 160, label: "Торговые марки", callback: ()=> {
            let cfg = {
                name: "trademarks",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.trademarksColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Торговые марки");
            }
        },
        {width: 160, label: "СПЕ", callback: ()=> {
            let cfg = {
                name: "spes",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.spesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("СПЕ");
            }
        },
        {width: 160, label: "Формы выпуска", callback: ()=> {
            let cfg = {
                name: "relforms",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.relformsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Формы выпуска");
            }
        },
        {width: 160, label: "Типы контрагентов", callback: ()=> {
            let cfg = {
                name: "ptypes",
                sorting: {id: "n_name", dir: "asc"},
                columns: refColumns.partnerstypesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Типы контрагентов");
            }
        },
        {width: 160, label: "Упаковки", callback: ()=> {
            let cfg = {
                name: "packagings",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.packsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Упаковки");
            }
        },
        {width: 160, label: "МНН", callback: ()=> {
            let cfg = {
                name: "mnns",
                sorting: {id: "c_rusname", dir: "asc"},
                columns: refColumns.mnnsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("МНН");
            }
        },
        {width: 160, label: "Мегакатегории", callback: ()=> {
            let cfg = {
                name: "megacategories",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.megasColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Мегакатегории");
            }
        },
        {width: 160, label: "Производители", callback: ()=> {
            let cfg = {
                name: "manufacturers",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.mansColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Производители");
            }
        },
        {width: 160, label: "Группы", callback: ()=> {
            let cfg = {
                name: "groups",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.groupsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Группы");
            }
        },
        {width: 160, label: "Сотрудники", callback: ()=> {
            let cfg = {
                name: "employees",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.employeesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Сотрудники");
            }
        },
        {width: 160, label: "Направления", callback: ()=> {
            let cfg = {
                name: "directions",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.dirsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Направления");
            }
        },
        {width: 160, label: "Дозировки", callback: ()=> {
            let cfg = {
                name: "dosages",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.dosagesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Дозировки");
            }
        },
        {width: 160, label: "Страны", callback: ()=> {
            let cfg = {
                name: "countries",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.countriesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Страны");
            }
        },
        {width: 160, label: "Категории", callback: ()=> {
            let cfg = {
                name: "categories",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.catsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Категории");
            }
        },
        {width: 160, label: "Области применения", callback: ()=> {
            let cfg = {
                name: "appareas",
                sorting: {id: "c_name", dir: "asc"},
                columns: refColumns.appareasColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Области применения");
            }
        },
    ]
}
