"use strict";

import {newDocument, message} from "../views/common";
import * as refColumns from "../models/refs_columns_dt";
import {refGetData} from "../models/data_processing";
import RefProductsView from "../models/ref_products";
import RefView from "../models/template_ref_view";

export const emptyWidth = 7; //ширина пустых элементов

export const bSpace = 4; //высота пустых элементов в выпадающих меню

export const balance_excludeColumns = [
    "n_state",
    "_checked"
]

export const arrivals_excludeColumns = [
    "n_state",
    "_checked"
]

export const orders_excludeColumns = [
    "n_state",
    "_checked"
]

export const shipments_excludeColumns = [
    "n_state",
    "_checked"
]

export const screens = {
    arrivals: {name: "Поступления", id: "_arrivals", width: 120},
    movings: {name: "Перемещения", id: "_movings", width: 120},
    transfers: {name: "В розницу", id: "_transfers", width: 120},
    shipments: {name: "Отгрузки", id: "_shipments", width: 120},
    info: {id: "_mView", width: 120, name: undefined},
    balance: {id: "_balance", name: "Остатки", width: 100},
    orders: {name: "Заказы", id: "_orders", width: 120},
}

export const transfers_excludeColumns = [
    "n_state",
    "_checked"
]

export const transfers_context_center_dt_optoins = [ //наверное тоже будем загружать с сервера
        {id: 1, value: "Скопировать поле"},
        {id: 1000, $template:"Separator" },
        {id: 9, value: "Создать новый документ", submenu: [
            {id: 901, value: "Приходный документ"},
            {id: 902, value: "Отгрузка"},
            {id: 903, value: "Возврат"},
            {id: 904, value: "Вывод из оборота"},
            {id: 905, value: "В розницу"},
            {id: 906, value: "Перемещение"},
        ]},
        {id: 2, value: "Загрузить документ"},
        {id: 1001, $template:"Separator" },
        {id: 3, value:"Провести"},
        {id: 4, value:"Отменить"},
        {id: 5, value: "Корректировка"},
        {id: 6, value: "Удалить"},
        {id: 7, value: "Отменить удаление"},
        {id: 1002, $template:"Separator" },
        {id: 100, value:"Внутренние", submenu: [
            {id: 101, value:"В розницу"},
            {id: 102, value:"Перемещение"},
        ]},
        {id: 200, value:"Внешние", submenu: [
            {id: 201, value:"Отгрузка"},
            {id: 202, value:"Возврат"},
            {id: 203, value:"Вывод из оборота"},
        ]},
        {id: 1003,  $template:"Separator" },
        {id: 300, value:"Документ", submenu: [
            {id: 301, value:"Печатная форма"},
            {id: 302, value:"Печатная форма 1"},
            {id: 303, value:"Печатная форма 2"},
        ]},
        {id: 1004,  $template:"Separator" },
        {id: 10, value: "Подчиненные документы"},
    ]

export const movings_excludeColumns = [
    "n_state",
    "_checked"
]

export const movings_context_center_dt_optoins = [ //наверное тоже будем загружать с сервера
        {id: 1, value: "Скопировать поле"},
        {id: 1000, $template:"Separator" },
        {id: 9, value: "Создать новый документ", submenu: [
            {id: 901, value: "Приходный документ"},
            {id: 902, value: "Отгрузка"},
            {id: 903, value: "Возврат"},
            {id: 904, value: "Вывод из оборота"},
            {id: 905, value: "В розницу"},
            {id: 906, value: "Перемещение"},
        ]},
        {id: 2, value: "Загрузить документ"},
        {id: 1001, $template:"Separator" },
        {id: 3, value:"Провести"},
        {id: 4, value:"Отменить"},
        {id: 5, value: "Корректировка"},
        {id: 6, value: "Удалить"},
        {id: 7, value: "Отменить удаление"},
        // {id: 1002, $template:"Separator" },
        // {id: 100, value:"Внутренние", submenu: [
            // {id: 101, value:"В розницу"},
            // {id: 102, value:"Перемещение"},
        // ]},
        // {id: 200, value:"Внешние", submenu: [
            // {id: 201, value:"Отгрузка"},
            // {id: 202, value:"Возврат"},
            // {id: 203, value:"Вывод из оборота"},
        // ]},
        {id: 1003,  $template:"Separator" },
        {id: 300, value:"Документ", submenu: [
            {id: 301, value:"Печатная форма"},
            {id: 302, value:"Печатная форма 1"},
            {id: 303, value:"Печатная форма 2"},
        ]},
        // {id: 1004,  $template:"Separator" },
        // {id: 10, value: "Подчиненные документы"},
    ]

    export const balance_context_center_dt_optoins = [ //наверное тоже будем загружать с сервера
        {id: 1, value: "Скопировать поле"},
        {id: 1000, $template:"Separator" },
        {id: 9, value: "Создать новый документ", submenu: [
            {id: 901, value: "Приходный документ"},
            {id: 902, value: "Отгрузка"},
            // {id: 903, value: "Возврат"},
            // {id: 904, value: "Вывод из оборота"},
            // {id: 905, value: "В розницу"},
            // {id: 906, value: "Перемещение"},
        ]},
        {id: 2, value: "Загрузить документ"},
        {id: 1003,  $template:"Separator" },
        {id: 300, value:"Документ", submenu: [
            {id: 301, value:"Печатная форма"},
            {id: 302, value:"Печатная форма 1"},
            {id: 303, value:"Печатная форма 2"},
        ]},
        {id: 1004,  $template:"Separator" },
        {id: 11, value: "Движение товара"},
    ]

export const arrivals_context_center_dt_optoins = [ //наверное тоже будем загружать с сервера
    {id: 1, value: "Скопировать поле"},
    {id: 1000, $template:"Separator" },
    {id: 9, value: "Создать новый документ", submenu: [
        {id: 901, value: "Приходный документ"},
        {id: 902, value: "Отгрузка"},
        // {id: 903, value: "Возврат"},
        // {id: 904, value: "Вывод из оборота"},
        // {id: 905, value: "В розницу"},
        // {id: 906, value: "Перемещение"},
    ]},
    {id: 2, value: "Загрузить документ"},
    {id: 1001, $template:"Separator" },
    // {id: 3, value:"Провести"},
    {id: 4, value:"Отменить"},
    {id: 5, value: "Корректировка"},
    {id: 6, value: "Удалить"},
    {id: 7, value: "Отменить удаление"},
    // {id: 1002, $template:"Separator" },
    // {id: 100, value:"Внутренние", submenu: [
        // {id: 101, value:"В розницу"},
        // {id: 102, value:"Перемещение"},
    // ]},
    // {id: 200, value:"Внешние", submenu: [
        // {id: 201, value:"Отгрузка"},
        // {id: 202, value:"Возврат"},
        // {id: 203, value:"Вывод из оборота"},
    // ]},
    {id: 1003,  $template:"Separator" },
    {id: 300, value:"Документ", submenu: [
        {id: 301, value:"Печатная форма"},
        {id: 302, value:"Печатная форма 1"},
        {id: 303, value:"Печатная форма 2"},
    ]},
    {id: 1004,  $template:"Separator" },
    // {id: 10, value: "Подчиненные документы"},
]

export const orders_context_center_dt_optoins = [ //наверное тоже будем загружать с сервера
    {id: 1, value: "Скопировать поле"},
    {$template:"Separator" },
    {id: 9, value: "Создать новый документ", submenu: [
        {id: 901, value: "Приходный документ"},
        {id: 902, value: "Отгрузка"},
        // {id: 903, value: "Возврат"},
        // {id: 904, value: "Вывод из оборота"},
        // {id: 905, value: "В розницу"},
        // {id: 906, value: "Перемещение"},
    ]},
    // {id: 2, value: "Загрузить документ"},
    // {id: 1001, $template:"Separator" },
    // {id: 3, value:"Сделать отгрузку"},
    // {id: 4, value:"Отменить"},
    // {id: 5, value: "Корректировка"},
    // {id: 6, value: "Удалить"},
    // {id: 7, value: "Отменить удаление"},
    {$template:"Separator" },
    // {id: 100, value:"Внутренние", submenu: [
        // {id: 101, value:"В розницу"},
        // {id: 102, value:"Перемещение"},
    // ]},
    {id: 200, value:"Внешние", submenu: [
        {id: 201, value:"Отгрузка на основании"},
        // {id: 202, value:"Возврат"},
        // {id: 203, value:"Вывод из оборота"},
    ]},
    {$template:"Separator" },
    {id: 300, value:"Документ", submenu: [
        {id: 301, value:"Печатная форма"},
        {id: 302, value:"Печатная форма 1"},
        {id: 303, value:"Печатная форма 2"},
    ]},
    {$template:"Separator" },
    {id: 10, value: "Подчиненные документы"},
]

export const shipments_context_center_dt_optoins = [ //наверное тоже будем загружать с сервера
    {id: 1, value: "Скопировать поле"},
    {id: 1000, $template:"Separator" },
    {id: 9, value: "Создать новый документ", submenu: [
        {id: 901, value: "Приходный документ"},
        {id: 902, value: "Отгрузка"},
        // {id: 903, value: "Возврат"},
        // {id: 904, value: "Вывод из оборота"},
        // {id: 905, value: "В розницу"},
        // {id: 906, value: "Перемещение"},
    ]},
    {id: 2, value: "Загрузить документ"},
    {id: 1001, $template:"Separator" },
    {id: 3, value:"Провести"},
    {id: 4, value:"Отменить"},
    {id: 5, value: "Корректировка"},
    {id: 6, value: "Удалить"},
    {id: 7, value: "Отменить удаление"},
    // {id: 1002, $template:"Separator" },
    // {id: 100, value:"Внутренние", submenu: [
        // {id: 101, value:"В розницу"},
        // {id: 102, value:"Перемещение"},
    // ]},
    // {id: 200, value:"Внешние", submenu: [
        // {id: 201, value:"Отгрузка"},
        // {id: 202, value:"Возврат"},
        // {id: 203, value:"Вывод из оборота"},
    // ]},
    {id: 1003,  $template:"Separator" },
    {id: 300, value:"Документ", submenu: [
        {id: 301, value:"Печатная форма"},
        {id: 302, value:"Печатная форма 1"},
        {id: 303, value:"Печатная форма 2"},
    ]},
    {id: 1004,  $template:"Separator" },
    {id: 10, value: "Подчиненные документы"},
]

export const new_docs_menu = [
    {width: 120, label: "Поступление", callback: ()=> {
        newDocument.arrival($$("sklad_main_ui").$scope);
        }
    }, 
    {width: 120, label: "Отгрузка", callback: ()=> {
        newDocument.shipment($$("sklad_main_ui").$scope);
        }
    }, 
]

export const refs_menu = [
    {width: 120, label: "Товары", callback: (th) => {
        let v = new RefProductsView($$("sklad_main_ui").$scope.app)
        let s = $$("sklad_main_ui").$scope.ui(v)
        s.show('Справочник товаров')
        }
    }, 
    {width: 120, label: "Партнеры", callback: ()=> {
        let cfg = {
            name: "partners",
            sorting: {id: "n_name", dir: "asc"},
            loadFunction: refGetData,
            columns: refColumns.partnersColumns
        };
        let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
        let s = $$("sklad_main_ui").$scope.ui(v);
        s.show('Партнеры');
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
    {width: 120, label: "Типы партнеров", callback: ()=> {
        let cfg = {
            name: "ptypes",
            sorting: {id: "n_name", dir: "asc"},
            loadFunction: refGetData,
            columns: refColumns.partnerstypesColumns
        };
        let v = new RefView($$("sklad_main_ui").$scope.app, cfg);
        let s = $$("sklad_main_ui").$scope.ui(v);
        s.show("Типы партнеров");
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

export const new_doc_context_center_dt_optoins = [ //наверное тоже будем загружать с сервера
    {id: 901, value: "Приходный документ"},
    {id: 902, value: "Отгрузка"},
]


export const v_names = {'n_number': {'id': 'n_number', 'value': 'Номер накл.'},
    'n_dt_invoice': {'id': 'n_dt_invoice', 'value': 'Дата накл.'},
    'n_supplier': {'id': 'n_supplier', 'value': 'Поставщик'}, 
    'n_recipient': {'id': 'n_recipient', 'value': 'Получатель'},
    'n_summ': {'id': 'n_summ', 'value': 'Сумма накл.'}, 
    'n_nds': {'id': 'n_nds', 'value': 'Сумма НДС'}, 
    'n_pos_numbers': {'id': 'n_pos_numbers', 'value': 'Кол.позиций'}, 
    'n_executor': {'id': 'n_executor', 'value': 'Исполнитель'}, 
    'n_base': {'id': 'n_base', 'value': 'Основание'}, 
    'n_paid': {'id': 'n_paid', 'value': 'Оплата'}, 
    'n_dt_change': {'id': 'n_dt_change', 'value': 'Дата изм.'}, 
    'n_state': {'id': 'n_state', 'value': 'Статус'}}

export const v_names_orders = {
    'n_state': {'id': 'n_state', 'value': 'Статус'},
    'n_supplier': {'id': 'n_supplier', 'value': 'Поставщик'},
    'n_filename': {'id': 'n_filename', 'value': 'Имя файла'},
    'n_id_field': {'id': 'n_id_field', 'value': 'ИД'},
    'n_name': {'id': 'n_name', 'value': 'Юр.лицо'},
    'n_p_id': {'id': 'n_p_id', 'value': 'id получателя'},
    'n_code': {'id': 'n_code', 'value': 'Код'},
    'n_inn': {'id': 'n_inn', 'value': 'ИНН'},
    'n_dt_price': {'id': 'n_dt_price', 'value': 'Дата прайса'},
    'n_dt_invoice': {'id': 'n_dt_invoice', 'value': 'Дата создания'},
    'n_number': {'id': 'n_number', 'value': 'Номер заявки'}, 
    'n_dt_send': {'id': 'n_dt_send', 'value': 'Дата отправки'},
    'n_recipient': {'id': 'n_recipient', 'value': 'Точка получения'},
    'n_recipient_id': {'id': 'n_recipient_id', 'value': 'id подразделения'},
    'n_summ': {'id': 'n_summ', 'value': 'Сумма накл.'}, 
    'n_pos_numbers': {'id': 'n_pos_numbers', 'value': 'Кол.позиций'}, 
    'n_dt_recieved': {'id': 'n_dt_recieved', 'value': 'Дата получения'}, 
    'n_comment': {'id': 'n_comment', 'value': 'Комментарий'},}

export const v_names_balance = {
    'n_product_id': {'id': 'n_product_id', 'value': 'id товара'},
    'n_product': {'id': 'n_product', 'value': 'Товар'},
    'n_code': {'id': 'n_code', 'value': 'Код товара'},
    'n_consignment': {'id': 'n_consignment', 'value': 'Партия'},
    'n_dt': {'id': 'n_dt', 'value': 'Остаток на дату'},
    'n_warehouse': {'id': 'n_warehouse', 'value': 'Склад'},
    'n_quantity': {'id': 'n_quantity', 'value': 'Кол-во'},
    'n_price': {'id': 'n_price', 'value': 'Цена'},
    'n_price_price': {'id': 'n_price_price', 'value': 'Цена в прайсе'},
    'n_vat': {'id': 'n_vat', 'value': 'сумма НДС'},
    'n_vat_included': {'id': 'n_vat_included', 'value': 'НДС включен'}
}    
    
export const v_names_shipm = {'n_number': {'id': 'n_number', 'value': 'Номер накл.'}, 
    'n_dt_invoice': {'id': 'n_dt_invoice', 'value': 'Дата накл.'},
    'n_supplier': {'id': 'n_supplier', 'value': 'Поставщик'}, 
    'n_recipient': {'id': 'n_recipient', 'value': 'Получатель'},
    'n_summ': {'id': 'n_summ', 'value': 'Сумма накл.'}, 
    'n_nds': {'id': 'n_nds', 'value': 'Сумма НДС'}, 
    'n_pos_numbers': {'id': 'n_pos_numbers', 'value': 'Кол.позиций'}, 
    'n_executor': {'id': 'n_executor', 'value': 'Исполнитель'}, 
    'n_base': {'id': 'n_base', 'value': 'Основание'}, 
    'n_paid': {'id': 'n_paid', 'value': 'Оплата'}, 
    'n_dt_change': {'id': 'n_dt_change', 'value': 'Дата изм.'}, 
    'n_charge': {'id': 'n_charge', 'value': 'Наценка'}, 
    'n_state': {'id': 'n_state', 'value': 'Статус'}}


export const v_states = {1: {'id': 1, 'value': 'Новый', 'picture': 'mdi-file-outline', 'color': 'inherit'}, 
    2: {'id': 2, 'value': 'Проведен', 'picture': 'mdi-file-check-outline', 'color': 'green'},
    3: {'id': 3, 'value': 'Удален', 'picture': 'mdi-file-cancel-outline', 'color': 'red'}};