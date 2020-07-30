"use strict";


export const sipmentsProdSelColumns = [
    {id: "n_id", hidden: true,
        headermenu: false,
        width: 5,
    },
    {id: "n_code", width: 80, 
        // sort: "server", 
        header: [{text: "Код товара"},
            ],
        headermenu:!false,
        hidden: !true
        // filter_type: "date",

    },
    {id: "n_product", fillspace: true, 
        sort: "server", 
        header: [{text: "Наименование"},
        ],
        headermenu:false,
        footer:{ content:"totalTableLong" },
        // editor: "text",
        filter_type: "text"

    },
    {id: "n_quantity",
        sort: "server",
        header: [{text: "Остаток"},
        ],
        headermenu:!false,
        hidden: !true

    },
    {id: "n_price",
        sort: "server",
        header: [{text: "Цена"},
        ],
        headermenu:!false,
        hidden: !true,
        format: webix.Number.formatNumber,

    },

    {id: "n_vat", hidden: true, 
        headermenu: !false,
        header: [{text: "НДС"},
        ],
        width: 50,
        format: webix.Number.formatNumber,
    },

];

