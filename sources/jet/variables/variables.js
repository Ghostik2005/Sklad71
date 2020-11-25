"use strict";

export const emptyWidth = 7; //ширина пустых элементов

export const bSpace = 4; //высота пустых элементов в выпадающих меню

export const tables_excludeColumns = [ //столбцы, к которым не будет подписей в шапке
    "n_state",
    "_checked"
]

export const screens = { //названия, id и параметры всех вкладок основного экрана
    arrivals: {name: "Приходы", id: "_arrivals", width: 140},
    movings: {name: "Перемещения", id: "_movings", width: 120},
    transfers: {name: "В розницу", id: "_transfers", width: 120},
    shipments: {name: "Продажи", id: "_shipments", width: 120},
    movements: {name: "Перемещения", id: "_movements", width: 140},
    info: {id: "_mView", width: 120, name: undefined},
    balances: {id: "_balances", name: "Остатки", width: 100},
    orders: {name: "Заказы", id: "_orders", width: 120},
    rests: {name: "Оприходывания", id: "_rests", width: 200}
}

export const button_menu_options = {

    contragents: [
        {id: 16000, value: "Контрагенты"},
        // {id: 26000, value: "Группы контрагентов"},
        {id: 36000, value: "Виды контрагентов"},
        // {id: 46000, value: "Сегменты контрагентов"},
        {id: 56000, value: "Подразделения контрагентов"},
    ],

    classifiers: [
        // {id: 15000, value: "Валюты"},
        // {id: 25000, value: "Банки"},
        {id: 35000, value: "Страны"},
        {id: 45000, value: "Регионы"},
        {id: 55000, value: "НДС"},
        {id: 65000, value: "Торговые марки"},
        {id: 75000, value: "СПЕ"},
        {id: 85000, value: "Формы выпуска"},
        {id: 95000, value: "Упаковки"},
        {id: 105000, value: "МНН"},
        {id: 115000, value: "Мегакатегории"},
        {id: 125000, value: "Производители"},
        {id: 135000, value: "Группы"},
        {id: 145000, value: "Направления"},
        {id: 155000, value: "Дозировки"},
        {id: 165000, value: "Категории"},
        {id: 175000, value: "Области применения"},
    ],

    products: [
        {id: 14000, value: "Остатки"},
        {id: 24000, value: "Движение товаров"},
        {id: 34000, value: "Номенклатура"},
        {id: 44000, value: "Группы номенклатуры"},
        // {id: 54000, value: "Бренды"},
        // {id: 64000, value: "Виды номенклатуры"},
        // {id: 74000, value: "Сегменты номенклатуры"},
        // {id: 84000, value: "Штрихкоды"},
    ],

    journals: [
        {id: 13000, value: "Приходы"},
        {id: 23000, value: "Оприходывания остатков"},
        {id: 33000, value: "Перемещения"},
        {id: 43000, value: "Заказы"},
        {id: 53000, value: "Продажи"},
        // {id: 63000, value: "Списания"},
    ],

    documents: [
        {id: 12000, value: "Приход"},
        {id: 22000, value: "Перемещение"},
        {id: 32000, value: "Продажа"},
        {id: 42000, value: "Ввод остатков"},
        // {id: 52000, value: "Списание"},

    ],
    options: [
        {id: 11000, value: "Пользователи"},
        {id: 21000, value: "Роли пользователей"},
        {id: 31000, value: "Интерфейсы"},
        {id: 41000, value: "Что-то еще", submenu: [
            {id: 41001, value: "Что-то еще 1"},
            {id: 41002, value: "Что-то еще 2"},
            {id: 41003, value: "Что-то еще 3"},
        ]},
    ],

    managements: [
        {id: 10000, value: "Предприятие", submenu: [
            {id: 10001, value: "Организации"},
            {id: 10002, value: "Склады"},
            {id: 10003, value: "Подразделения"},
        ]},
        {id: 20000, value: "Персонал", submenu: [
            {id: 20001, value: "Физические лица"},
            {id: 20002, value: "Сотрудники"},
            {id: 20003, value: "Должности"},
            {id: 20004, value: "Графики"},
        ]},
        {id: 30000, value: "Ценообразование", submenu: [
            {id: 30001, value: "Типы цен"},
            {id: 30002, value: "Типы скидок"},
            {id: 30003, value: "Ценовые группы"},
        ]},
        {id: 40000, value: "Маркетинг", submenu: [
            {id: 40001, value: "Типы мероприятий"},
            {id: 40002, value: "Партнеры"},
            {id: 40003, value: "Категории подразделений"},
        ]},
    ]
}


export const menu_options = [ //все возможные пункты контекстного меню
    {id: 1, value: "Скопировать поле"},
    {id: 1000, $template:"Separator" },
    {id: 9, value: "Создать новый документ", submenu: [
        {id: 901, value: "Приходный документ"},
        {id: 902, value: "Отгрузка"},
        {id: 903, value: "Возврат"},
        {id: 904, value: "Вывод из оборота"},
        {id: 905, value: "В розницу"},
        {id: 906, value: "Перемещение"},
        {id: 907, value: "Ввод остатков"},
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
    {id: 200, value:"На основании", submenu: [
        {id: 201, value:"Перемещение"},
        {id: 204, value:"Продажа"},
        {id: 202, value:"Возврат"},
        {id: 203, value:"Вывод из оборота"},
    ]},
    {id: 1003,  $template:"Separator" },
    {id: 300, value:"Документ", submenu: [
        {id: 301, value:"Печатная форма"},
        // {id: 302, value:"Печатная форма 1"},
        // {id: 303, value:"Печатная форма 2"},
    ]},
    {id: 1004,  $template:"Separator" },
    {id: 10, value: "Подчиненные документы"},

]


export const context_menu_excludes = {

    arrivals: [ //исключения для меню поступлений
        902, 903, 904, 905, 906, 2, 5, 1002, 100, 101, 102, 200, 201, 202, 203, 1004, 10
    ],
    balances: [ //инсключения для меню остатков
        902, 903, 904, 905, 906, 2, 1001, 3, 4, 5, 6, 7, 1002, 100, 101, 102, 200, 201, 202, 203, 1004, 10
    ],
    orders: [ //исключения для меню заказов
        902, 903, 904, 905, 906, 2, 1001, 3, 4, 5, 6, 7, 100, 101, 202, 203
    ],
    shipments: [ // исключения для меню отгрузок
        902, 903, 904, 905, 906, 2, 5, 1002, 100, 101, 102, 200, 201, 202, 203, 1004, 10
    ],
    movements: [ // исключения для меню перемещений
        902, 903, 904, 905, 906, 2, 5, 1002, 100, 101, 102, 200, 201, 202, 203, 1004, 10
    ],
    rests: [ //исключения для ввода остатков
        902, 903, 904, 905, 906, 2, 5, 1002, 100, 101, 102, 200, 201, 202, 203, 1004, 10
    ]
}

// export const names_translates = { // названия всех колонок и меток в зависимости от id
//     'n_number': {'id': 'n_number', 'value': 'Номер докум.'},
//     'n_dt_invoice': {'id': 'n_dt_invoice', 'value': 'Дата докум.'},
//     'n_supplier': {'id': 'n_supplier', 'value': 'Поставщик'},
//     'n_recipient': {'id': 'n_recipient', 'value': 'Получатель'},
//     'n_summ': {'id': 'n_summ', 'value': 'Сумма докум.'},
//     'n_nds': {'id': 'n_nds', 'value': 'Сумма НДС'},
//     'n_pos_numbers': {'id': 'n_pos_numbers', 'value': 'Кол.позиций'},
//     'n_executor': {'id': 'n_executor', 'value': 'Исполнитель'},
//     'n_base': {'id': 'n_base', 'value': 'Основание'},
//     'n_paid': {'id': 'n_paid', 'value': 'Оплата'},
//     'n_dt_change': {'id': 'n_dt_change', 'value': 'Дата изм.'},
//     'n_state': {'id': 'n_state', 'value': 'Статус'},
//     'n_charge': {'id': 'n_charge', 'value': 'Наценка'},
//     'n_filename': {'id': 'n_filename', 'value': 'Имя файла'},
//     'n_id_field': {'id': 'n_id_field', 'value': 'ИД'},
//     'n_name': {'id': 'n_name', 'value': 'Юр.лицо'},
//     'n_p_id': {'id': 'n_p_id', 'value': 'id получателя'},
//     'n_code': {'id': 'n_code', 'value': 'Код товара'},
//     'n_inn': {'id': 'n_inn', 'value': 'ИНН'},
//     'n_dt_price': {'id': 'n_dt_price', 'value': 'Дата прайса'},
//     'n_dt_send': {'id': 'n_dt_send', 'value': 'Дата отправки'},
//     'n_recipient_id': {'id': 'n_recipient_id', 'value': 'id подразделения'},
//     'n_dt_recieved': {'id': 'n_dt_recieved', 'value': 'Дата получения'},
//     'n_comment': {'id': 'n_comment', 'value': 'Комментарий'},
//     'n_product_id': {'id': 'n_product_id', 'value': 'id товара'},
//     'n_product': {'id': 'n_product', 'value': 'Товар'},
//     'n_consignment': {'id': 'n_consignment', 'value': 'Партия'},
//     'n_dt': {'id': 'n_dt', 'value': 'Остаток на дату'},
//     'n_warehouse': {'id': 'n_warehouse', 'value': 'Склад'},
//     'n_quantity': {'id': 'n_quantity', 'value': 'Кол-во'},
//     'n_price': {'id': 'n_price', 'value': 'Цена'},
//     'n_price_price': {'id': 'n_price_price', 'value': 'Цена в прайсе'},
//     'n_vat': {'id': 'n_vat', 'value': 'сумма НДС'},
//     'n_vat_included': {'id': 'n_vat_included', 'value': 'НДС включен'},
//     'c_code': {'id': 'c_code', 'value': 'Код товара'},
//     'c_vat': {'id': 'c_vat', 'value': 'НДС'},
//     'c_name': {'id': 'c_name', 'value': 'Наименование'},
//     'c_namefull': {'id': 'c_namefull', 'value': 'Полное наименование'},
// }


//параметры статусов документов
// export const v_states = {1: {'id': 1, 'value': 'Новый', 'picture': 'mdi-file-outline', 'color': 'inherit'},
//     2: {'id': 2, 'value': 'Проведен', 'picture': 'mdi-file-check-outline', 'color': 'green'},
//     3: {'id': 3, 'value': 'Удален', 'picture': 'mdi-file-cancel-outline', 'color': 'red'}};

