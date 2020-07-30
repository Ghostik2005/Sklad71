"use strict";

import {message} from "../views/common";
import * as refColumns from "../models/refs_columns_dt";
import {refGetData} from "../models/data_processing";
import RefProductsView from "../models/ref_products";
import RefView from "../models/template_ref_view";
import {newDocument} from "../models/common_functions";



export const menus = {

    docs: [ // кнопки создания новых документов
        {width: 120, label: "Поступление", 
            callback: newDocument.arrival
        }, 
        {width: 120, label: "Отгрузка", 
            callback: newDocument.shipment
        }, 
     ],

     refs: [ // кнопки меню справочников
        {width: 120, label: "Товары", callback: (th) => {
                let v = new RefProductsView($$("sklad_main_ui").$scope.app)
                let s = $$("sklad_main_ui").$scope.ui(v)
                s.show('Справочник товаров')            
            }
        }, 
        {width: 120, label: "Контрагенты", callback: ()=> {
            let cfg = {
                name: "partners",
                sorting: {id: "n_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.partnersColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show('Контрагенты');
            }
        }, 
        {width: 120, label: "Подразделения", callback: ()=> {
            let cfg = {
                name: "points",
                sorting: {id: "n_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.pointsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show('Подразделения');
            }
        }, 
        {width: 120, label: "НДС", callback: ()=> {
            let cfg = {
                name: "vats",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.vatsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show('НДС');
            }
        }, 
        {width: 120, label: "Торговые марки", callback: ()=> {
            let cfg = {
                name: "trademarks",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.trademarksColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Торговые марки");
            }
        }, 
        {width: 120, label: "СПЕ", callback: ()=> {
            let cfg = {
                name: "spes",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.spesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("СПЕ");
            }
        }, 
        {width: 120, label: "Формы выпуска", callback: ()=> {
            let cfg = {
                name: "relforms",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.relformsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Формы выпуска");
            }
        }, 
        {width: 120, label: "Типы контрагентов", callback: ()=> {
            let cfg = {
                name: "ptypes",
                sorting: {id: "n_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.partnerstypesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Типы контрагентов");
            }
        }, 
        {width: 120, label: "Упаковки", callback: ()=> {
            let cfg = {
                name: "packagings",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.packsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Упаковки");
            }
        }, 
        {width: 120, label: "МНН", callback: ()=> {
            let cfg = {
                name: "mnns",
                sorting: {id: "c_rusname", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.mnnsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("МНН");
            }
        }, 
        {width: 120, label: "Мегакатегории", callback: ()=> {
            let cfg = {
                name: "megacategories",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.megasColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Мегакатегории");
            }
        }, 
        {width: 120, label: "Производители", callback: ()=> {
            let cfg = {
                name: "manufacturers",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.mansColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Производители");
            }
        }, 
        {width: 120, label: "Группы", callback: ()=> {
            let cfg = {
                name: "groups",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.groupsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Группы");
            }
        }, 
        {width: 120, label: "Сотрудники", callback: ()=> {
            let cfg = {
                name: "employees",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.employeesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Сотрудники");
            }
        }, 
        {width: 120, label: "Направления", callback: ()=> {
            let cfg = {
                name: "directions",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.dirsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Направления");
            }
        }, 
        {width: 120, label: "Дозировки", callback: ()=> {
            let cfg = {
                name: "dosages",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.dosagesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Дозировки");
            }
        }, 
        {width: 120, label: "Страны", callback: ()=> {
            let cfg = {
                name: "countries",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.countriesColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Страны");
            }
        }, 
        {width: 120, label: "Категории", callback: ()=> {
            let cfg = {
                name: "categories",
                sorting: {id: "c_name", dir: "asc"},
                loadFunction: refGetData,
                columns: refColumns.catsColumns
            };
            let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
            let s = $$("sklad_main_ui").$scope.ui(v);
            s.show("Категории");
            }
        }, 
        {width: 120, label: "Области применения", callback: ()=> {
            let cfg = {
                name: "appareas",
                loadFunction: refGetData,
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
