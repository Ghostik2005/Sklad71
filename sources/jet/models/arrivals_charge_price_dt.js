"use strict";


// import {formatNumber, ref_states} from "../views/common";


export const dtColumns = [
    {in: "row_num", 
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
    {id: "n_product",
        fillspace: 1,
        header: [{text: "Товар"},
        ],
        headermenu:false,
        footer:{text:"всего:", colspan:3}

    },
    {id: "n_amount", width: 80, 
        header: [{text: "Кол-во"},
        ],
        headermenu:false,
    },
    {id: "n_price", width: 80, 
        header: [{text: "Цена"},
        ],
        headermenu:false,
        // editor: "price",
        format: webix.Number.formatNumber,
    },
    {id: "n_total_summ", width: 120, 
        header: [{text: "Общая сумма"},
        ],
        headermenu:false,
        footer:{ content:"totalColumn" },
        format: webix.Number.formatNumber,
    },
    {id: "n_charge", width: 80, 
        header: [{text: "Наценка, %"},
        ],
        headermenu:false,
        editor: "text",
    },    
    {id: "n_price_price", width: 100, 
        header: [{text: "Цена в прайс"},
        ],
        headermenu:false,
        editor: "price",
        format: webix.Number.formatNumber,
    },
    {id: "n_total_price_summ", width: 120, 
        header: [{text: "Сумма в прайс"},
        ],
        headermenu:false,
        footer:{ content:"totalColumn" },
        format: webix.Number.formatNumber,
    },
    {id: "n_prod_id", width: 5, 
        headermenu:false,
        hidden: true
    },

];


