"use strict";


export const side_buttons_cfg = {

    new_document: {
        longPress: false,
        hidden: false,
        img: './library/img/new-document.svg',
        title: 'Новый документ',
        css_class: 'side_menu_button'
    },

    references: {
        longPress: false,
        hidden: false,
        img: './library/img/references.svg',
        title: 'Справочники',
        css_class: 'side_menu_button'
    },

    balances: {
        longPress: false,
        hidden: false,
        img: './library/img/stocks.svg',
        title: 'Остатки',
        css_class: 'side_menu_button'
    },

    arrivals: {
        longPress: false,
        hidden: false,
        img: './library/img/purchase_30x30.svg',
        title: 'Поступления',
        css_class: 'side_menu_button'
    },

    shipments: {
        longPress: false,
        hidden: false,
        img: './library/img/shipment.svg',
        title: 'Отгрузки',
        css_class: 'side_menu_button'
    },

    orders: {
        longPress: false,
        hidden: false,
        img: './library/img/orders.svg',
        title: 'Заказы',
        css_class: 'side_menu_button'
    },

    movings: {
        longPress: false,
        hidden: !false,
        img: './library/img/movings.svg',
        title: 'Перемещения',
        css_class: 'side_menu_button'
    },

    transfers: {
        longPress: false,
        hidden: !false,
        img: './library/img/transfers.svg',
        title: 'Передачи в розницу',
        css_class: 'side_menu_button'
    },

    analitics: {
        longPress: false,
        hidden: !false,
        img: './library/img/statistics_30x30.svg',
        title: 'Аналитика',
        css_class: 'side_menu_button'
    },

    reports: {
        longPress: false,
        hidden: !false,
        img: './library/img/report.svg',
        title: 'Отчеты',
        css_class: 'side_menu_button'
    },

    options: {
        longPress: false,
        hidden: !false,
        img: './library/img/settings.svg',
        title: 'Настройки',
        css_class: 'side_menu_button'
    },

    users: {
        longPress: false,
        hidden: !false,
        img: './library/img/users.svg',
        title: 'Пользователи',
        css_class: 'side_menu_button'
    },
}

export const icon_buttons_cfg = {

    documents: {
        width: 135,
        longPress: false,
        hidden: false,
        title: 'Новый документ',
        label: "документ",
        icon: '<path fill="currentColor" d="M17,14H19V17H22V19H19V22H17V19H14V17H17V14M5,3H19C20.11,3 21,3.89 21,5V12.8C20.39,12.45 19.72,12.2 19,12.08V5H5V19H12.08C12.2,19.72 12.45,20.39 12.8,21H5C3.89,21 3,20.11 3,19V5C3,3.89 3.89,3 5,3M7,7H17V9H7V7M7,11H17V12.08C16.15,12.22 15.37,12.54 14.68,13H7V11M7,15H12V17H7V15Z" />',
    },

    contragents: {
        width: 165,
        longPress: false,
        hidden: false,
        title: 'Контрагенты',
        label: "Контрагенты",
        icon: '<path fill="currentColor" d="M12,5A3.5,3.5 0 0,0 8.5,8.5A3.5,3.5 0 0,0 12,12A3.5,3.5 0 0,0 15.5,8.5A3.5,3.5 0 0,0 12,5M12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7M5.5,8A2.5,2.5 0 0,0 3,10.5C3,11.44 3.53,12.25 4.29,12.68C4.65,12.88 5.06,13 5.5,13C5.94,13 6.35,12.88 6.71,12.68C7.08,12.47 7.39,12.17 7.62,11.81C6.89,10.86 6.5,9.7 6.5,8.5C6.5,8.41 6.5,8.31 6.5,8.22C6.2,8.08 5.86,8 5.5,8M18.5,8C18.14,8 17.8,8.08 17.5,8.22C17.5,8.31 17.5,8.41 17.5,8.5C17.5,9.7 17.11,10.86 16.38,11.81C16.5,12 16.63,12.15 16.78,12.3C16.94,12.45 17.1,12.58 17.29,12.68C17.65,12.88 18.06,13 18.5,13C18.94,13 19.35,12.88 19.71,12.68C20.47,12.25 21,11.44 21,10.5A2.5,2.5 0 0,0 18.5,8M12,14C9.66,14 5,15.17 5,17.5V19H19V17.5C19,15.17 14.34,14 12,14M4.71,14.55C2.78,14.78 0,15.76 0,17.5V19H3V17.07C3,16.06 3.69,15.22 4.71,14.55M19.29,14.55C20.31,15.22 21,16.06 21,17.07V19H24V17.5C24,15.76 21.22,14.78 19.29,14.55M12,16C13.53,16 15.24,16.5 16.23,17H7.77C8.76,16.5 10.47,16 12,16Z" />'
    },

    journals: {
        width: 135,
        longPress: false,
        hidden: false,
        title: 'Журналы',
        label: "Журналы",
        icon: '<path fill="currentColor" d="M4 4C2.89 4 2 4.89 2 6V18A2 2 0 0 0 4 20H20A2 2 0 0 0 22 18V8C22 6.89 21.1 6 20 6H12L10 4H4M4 8H20V18H4V8M12 9V11H15V9H12M16 9V11H19V9H16M12 12V14H15V12H12M16 12V14H19V12H16M12 15V17H15V15H12M16 15V17H19V15H16Z" />'
    },

    products: {
        width: 115,
        longPress: false,
        hidden: false,
        title: 'Товары',
        label: "Товары",
        icon: ' <path fill="currentColor" d="M16,4L9,8.04V15.96L16,20L23,15.96V8.04M16,6.31L19.8,8.5L16,10.69L12.21,8.5M0,7V9H7V7M11,10.11L15,12.42V17.11L11,14.81M21,10.11V14.81L17,17.11V12.42M2,11V13H7V11M4,15V17H7V15" />'
    },

    classifiers: {
        width: 205,
        longPress: false,
        hidden: false,
        title: 'Классификаторы',
        label: "Классификаторы",
        icon: '<path fill="currentColor" d="M9,1H19A2,2 0 0,1 21,3V19L19,18.13V3H7A2,2 0 0,1 9,1M15,20V7H5V20L10,17.82L15,20M15,5C16.11,5 17,5.9 17,7V23L10,20L3,23V7A2,2 0 0,1 5,5H15Z" />'
    },

    reports: {
        width: 115,
        longPress: false,
        hidden: false,
        title: 'Отчеты',
        label: "Отчеты",
        icon: '<path fill="currentColor" d="M16 0H8C6.9 0 6 .9 6 2V18C6 19.1 6.9 20 8 20H20C21.1 20 22 19.1 22 18V6L16 0M20 18H8V2H15V7H20V18M4 4V22H20V24H4C2.9 24 2 23.1 2 22V4H4M10 10V12H18V10H10M10 14V16H15V14H10Z" />'
    },

    analitics: {
        width: 145,
        longPress: false,
        hidden: false,
        title: 'Аналитика',
        label: "Аналитика",
        icon: '<path fill="currentColor" d="M21 8C19.5 8 18.7 9.4 19.1 10.5L15.5 14.1C15.2 14 14.8 14 14.5 14.1L11.9 11.5C12.3 10.4 11.5 9 10 9C8.6 9 7.7 10.4 8.1 11.5L3.5 16C2.4 15.7 1 16.5 1 18C1 19.1 1.9 20 3 20C4.4 20 5.3 18.6 4.9 17.5L9.4 12.9C9.7 13 10.1 13 10.4 12.9L13 15.5C12.7 16.5 13.5 18 15 18C16.5 18 17.3 16.6 16.9 15.5L20.5 11.9C21.6 12.2 23 11.4 23 10C23 8.9 22.1 8 21 8M15 9L15.9 6.9L18 6L15.9 5.1L15 3L14.1 5.1L12 6L14.1 6.9L15 9M3.5 11L4 9L6 8.5L4 8L3.5 6L3 8L1 8.5L3 9L3.5 11Z" />'
    },

    managements: {
        width: 155,
        longPress: false,
        hidden: false,
        title: 'Управление',
        label: "Управление",
        icon: '<path fill="currentColor" d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z" />'
    },

    options: {
        width: 150,
        longPress: false,
        hidden: false,
        title: 'Настройки',
        label: "Настройки",
        icon: '<path fill="currentColor" d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z" />'
    },

    logout: {
        width: 95,
        longPress: false,
        hidden: false,
        title: 'Выйти',
        label: "выйти",
        icon: '<path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />'
    },

}
