"use strict";

import {newDocument, newReport} from "../models/common_functions";
import TemplateMainTableView from  "../models/template_main_table";
import RefProductsView from "../models/ref_products";
import * as refColumns from "../variables/refs_columns_dt";
import RefView from "../models/template_ref_view";

export const handle_buttom_context = {

    contragents(input_cfg) {
        let id = input_cfg.id;
        let local_this = input_cfg.local_this;
        let th = local_this.$scope;
        let app = th.app;
        let cfg, s, v;
        switch(id) {
            case "16000":
                document.message("Контрагенты");
                cfg = {
                    name: "partners",
                    sorting: {id: "n_name", dir: "asc"},
                    columns: refColumns.partnersColumns
                };
                v = new RefView($$("sklad_main_ui").$scope.app, cfg);
                s = $$("sklad_main_ui").$scope.ui(v);
                s.show('Контрагенты');
                break;
            case "26000":
                document.message("Группы контрагентов");
                break;
            case "36000":
                document.message("Виды контрагентов");
                cfg = {
                    name: "ptypes",
                    sorting: {id: "n_name", dir: "asc"},
                    columns: refColumns.partnerstypesColumns
                };
                v = new RefView($$("sklad_main_ui").$scope.app, cfg);
                s = $$("sklad_main_ui").$scope.ui(v);
                s.show("Виды контрагентов");
                break;
            case "46000":
                document.message("Сегменты контрагентов");
                break;
            case "56000":
                document.message("Подразделения контрагентов");
                cfg = {
                    name: "points",
                    sorting: {id: "n_name", dir: "asc"},
                    columns: refColumns.pointsColumns
                };
                v = new RefView($$("sklad_main_ui").$scope.app, cfg);
                s = $$("sklad_main_ui").$scope.ui(v);
                s.show('Подразделения');
                break;

        }
    },

    classifiers(input_cfg) {
        let id = input_cfg.id;
        let local_this = input_cfg.local_this;
        let th = local_this.$scope;
        let app = th.app;
        let cfg;
        let v;
        let s;
        switch(id) {
            case "15000":
                document.message("Валюты")
                break;
            case "25000":
                document.message("Банки")
                break;
            case "35000":
                cfg = {
                    name: "countries",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.countriesColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Страны");
                break;
            case "45000":
                document.message("Регионы")
                break;
            case "55000":
                cfg = {
                    name: "vats",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.vatsColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show('НДС');
                break;
            case "65000":
                cfg = {
                    name: "trademarks",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.trademarksColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Торговые марки");
                break;
            case "75000":
                cfg = {
                    name: "spes",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.spesColumns
                };
                 v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("СПЕ");
                break;
            case "85000":
                cfg = {
                    name: "relforms",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.relformsColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Формы выпуска");
                break;
            case "95000":
                cfg = {
                    name: "packagings",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.packsColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Упаковки");
                break;
            case "105000":
                cfg = {
                    name: "mnns",
                    sorting: {id: "c_rusname", dir: "asc"},
                    columns: refColumns.mnnsColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("МНН");
                break;
            case "115000":
                cfg = {
                    name: "megacategories",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.megasColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Мегакатегории");
                break;
            case "125000":
                cfg = {
                    name: "manufacturers",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.mansColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Производители");
                break;
            case "135000":
                cfg = {
                    name: "groups",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.groupsColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Группы");
                break;
            case "145000":
                cfg = {
                    name: "directions",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.dirsColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Направления");
                break;
            case "155000":
                cfg = {
                    name: "dosages",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.dosagesColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Дозировки");
                break;
            case "165000":
                cfg = {
                    name: "categories",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.catsColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Категории");
                break;

            case "174000":
                cfg = {
                    name: "appareas",
                    sorting: {id: "c_name", dir: "asc"},
                    columns: refColumns.appareasColumns
                };
                v = new RefView(app, cfg);
                s = th.ui(v);
                s.show("Области применения");
                break;
        }
    },

    products(cfg) {
        let id = cfg.id;
        let local_this = cfg.local_this;
        let th = local_this.$scope;
        let app = th.app;
        switch(id) {
            case "14000":
                app.commonWidgets.sidebar.add_bar(th, TemplateMainTableView, "balances")
                break;
            case "24000":
                document.message("Движение товаров");
                break;
            case "34000":
                let v = new RefProductsView(app)
                let s = th.ui(v)
                s.show('Справочник номенклатуры товаров')
                break;
            case "44000":
                document.message("Группы номенклатуры");
                break;
            case "54000":
                document.message("Бренды");
                break;
            case "64000":
                document.message("Виды номенклатуры");
                break;
            case "74000":
                document.message("Сегменты");
                break;
            case "84000":
                document.message("Штрихкоды");
                break;
        }
    },

    journals(cfg) {
        let id = cfg.id;
        let local_this = cfg.local_this;
        let th = local_this.$scope;
        let app = th.app;
        switch(id) {
            case "13000":
                app.commonWidgets.sidebar.add_bar(th, TemplateMainTableView, "arrivals")
                break;
            case "23000":
                document.message("Оприходывания остатков");
                app.commonWidgets.sidebar.add_bar(th, TemplateMainTableView, "rests")
                break;
            case "33000":
                app.commonWidgets.sidebar.add_bar(th, TemplateMainTableView, "movements")
                document.message("Перемещения");
                break;
            case "43000":
                app.commonWidgets.sidebar.add_bar(th, TemplateMainTableView, "orders")
                break;
            case "53000":
                app.commonWidgets.sidebar.add_bar(th, TemplateMainTableView, "shipments")
                break;
            case "63000":
                document.message("Списания");
                break;
        }
    },

    documents(cfg) {
        let id = cfg.id;
        let local_this = cfg.local_this;
        let th = local_this.$scope;
        let app = th.app;
        switch(id) {
            case "12000":
                newDocument.arrival(th);
                break;
            case "22000":
                newDocument.movement(th);
                break;
            case "32000":
                newDocument.shipment(th);
                break;
            case "42000":
                newDocument.rest(th);
                break;
            case "52000":
                newDocument.writeoff(th);
                break;
        }
    },

    options(cfg) {
        let id = cfg.id;
        let local_this = cfg.local_this;
        let th = local_this.$scope;
        let app = th.app;
        switch(id) {
            case "11000":
                document.message('Пользователи')
                break;
            case "21000":
                document.message('Роли пользователей')
                break;
            case "21000":
                document.message('Интерфейсы')
                break;
            case "41001":
                document.message('Что-то еще 1')
                break;
            case "41002":
                document.message('Что-то еще 2')
                break;
            case "41002":
                document.message('Что-то еще 3')
                break;
        }
    },

    managements(cfg) {
        let context = cfg.context;
        let id = cfg.id;
        let local_this = cfg.local_this;
        let th = local_this.$scope;
        let app = th.app;
        switch(id) {
            case "10001":
                document.message('Организации')
                break;
            case "10002":
                document.message('Склады')
                break;
            case "10003":
                document.message('Подразделения')
                break;
            case "20001":
                document.message('Физические лица')
                break;
            case "20002":
                document.message('Сотрудники')
                break;
            case "20003":
                document.message('Должности')
                break;
            case "20004":
                document.message('Графики');
                break;
            case "30001":
                document.message('Типы цен')
                break;
            case "30002":
                document.message('Типы скидок')
                break;
            case "30003":
                document.message('Ценовые группы')
                break;
            case "40001":
                document.message('Типы мероприятий')
                break;
            case "40002":
                document.message('Партнеры')
                break;
            case "40003":
                document.message('Категории подразделений')
                break;
        }
    },
}

export function handle_context(cfg) {
    let context = cfg.context;
    let id = cfg.id;
    let local_this = cfg.local_this;
    let th = local_this.$scope;
    let row = cfg.row;
    let doc_type = cfg.doc_type;
    let app = th.app;
    let r_data;
    var gr;

    switch(id) {
        case "1":
            let copied = row[context.position.column];
            if (navigator.clipboard) {
                navigator.clipboard.writeText(copied).then(() => {
                    document.message('Скопировано в буфер');
                })
            } else {
                document.message('Браузер устарел, скопировать в буфер невозможно', 'error', 3);
            };
            break;
        case "2":
            document.message('Загрузить');
            break;
        case "3":
            r_data = app.getService("common").holdDocument(doc_type, row.n_id, row.id);
            //делаем изменения в таблице
            if (r_data.data) {
                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
            }

            break;
        case "4":
            r_data = app.getService("common").unHoldDocument(doc_type, row.n_id, row.id);
            //делаем изменения в таблице
            if (r_data.data) {
                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
            }
            break;
        case "6":
            r_data = app.getService("common").deleteDocument(doc_type, row.n_id, row.id);
            //делаем изменения в таблице
            if (r_data.data) {
                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
            }
            break;
        case "7":
            r_data = app.getService("common").unDeleteDocument(doc_type, row.n_id, row.id);
            //делаем изменения в таблице
            if (r_data.data) {
                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
            }
            break;
        case "201":
            gr = context.table.getItem(context.position.row);
            newDocument.movement(th, gr);
            break
        case "204":
            gr = context.table.getItem(context.position.row);
            newDocument.shipment(th, gr);
            break
        case "901":
            newDocument.arrival(th);
            break;
        case "902":
            newDocument.shipment(th);
            break;
        case "907":
            newDocument.rest(th);
            break;
        case "301":
            document.message('PPPPrint')
            newReport.document(th, doc_type, row);
            break

        // default:
        //     document.message(local_this.getMenuItem(id).value);
        //     break
        }
}
