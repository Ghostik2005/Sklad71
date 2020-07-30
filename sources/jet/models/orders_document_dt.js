"use strict";


export const dtColumns = [
    {in: "row_num", 
        hidden: true,
        headermenu: false,
        width: 50,
        template: function(obj, i, ii, iii) {
            if (!isNaN(obj.row_num)) return obj.row_num + 1
            return ""
        }
    },


    {id: "n_id", hidden: true,
        headermenu: false,
        width: 0,
    },
    {id: "n_doc_id", hidden: true,
        headermenu: false,
        width: 0,
    },
    {id: "n_product",
        fillspace: 1,
        header: [{text: "Товар"},
        ],
        headermenu:false,
        footer:{text:"всего:", colspan:3}

    },
    {id: "n_product_order",
        width: 250,
        header: [{text: "Товар в заказе"},
        ],
        headermenu:!false,
        hidden: true,
    },
    {id: "n_man",
        width: 200,
        header: [{text: "Производитель"},
        ],
        headermenu:!false,
    },
    {id: "n_code", width: 80, 
        header: [{text: "Код"},
            ],
        headermenu:false,
    },
    {id: "n_amount", width: 150, 
        header: [{text: "Кол-во в заказе"},
        ],
        headermenu:false,
        editor: "text",
        footer:{ content:"summColumn" },

    },
    {id: "n_balance_qty", width: 150, 
        header: [{text: "Кол-во на складе"},
        ],
        headermenu:false,
        editor: "text",
        footer:{ content:"summColumn" },

    },
    {id: "n_price", width: 80, 
        header: [{text: "Цена, руб."},
        ],
        headermenu:false,
        editor: "price",
        format: webix.Number.formatNumber,
    },
    {id: "n_total_summ", width: 160, 
        header: [{text: "Сумма с НДС"},
        ],
        headermenu:false,
        footer:{ content:"totalColumn" },
        format: webix.Number.formatNumber,
    },

    {id: "n_comment",
        width: 250,
        header: [{text: "Комментарий к позиции"},
        ],
        headermenu:!false,
    },

    {id: "n_prod_id", hidden: true,
        headermenu: false,
        width: 0,
    },
    {id: "n_balance_id", hidden: true,
        headermenu: false,
        width: 0,
    }

];




