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
    {id: "n_code", width: 80, 
        header: [{text: "Код"},
            ],
        headermenu:false,
    },
    {id: "n_consignment", width: 100, 
        header: [{text: "Партия"},
            ],
        headermenu:false,
        editor: "text"
    },
    {id: "n_unit", width: 160, 
        hidden: true,
        header: [{text: "Единица измерения"},
        ],
        headermenu:!false,
    },
    {id: "n_okei_code", width: 160,
        header: [{text: "Код по ОКЕИ"},
        ],
        hidden: true,
        headermenu:!false,
        editor: "text"
    },
    {id: "n_type_package", width: 140, 
        header: [{text: "Вид упак."},
        ],
        hidden: true,
        headermenu:!false,
    },
    {id: "n_amount_mass", width: 120, 
        header: [{text: "Кол-во(масса) в одном месте"},
        ],
        hidden: true,
        headermenu:!false,
    },
    {id: "n_amount_b", width: 90, 
        header: [{text: "Мест, шт."},
        ],
        headermenu:!false,
        hidden: true,
    },
    {id: "n_gross_weight", width: 100, 
        header: [{text: "Масса (брутто)"},
        ],
        hidden: true,
        headermenu:!false,
    },
    {id: "n_amount", width: 150, 
        header: [{text: "Кол-во"},
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
    {id: "n_novats_summ", width: 160, 
        header: [{text: "Сумма без НДС"},
        ],
        headermenu:false,
        footer:{ content:"totalColumn" },
        format: webix.Number.formatNumber,
    },
    {id: "n_vats_base", width: 160, 
        header: [{text: "НДС, ставка"},
        ],
        //прописать редактор для изменения ндс
        headermenu:false,
        editor: "select", options: ["НДС 0%", "НДС 10%", "НДС 20%"]
    },
    {id: "n_vats_summ", width: 160, 
        header: [{text: "НДС, сумма"},
        ],
        headermenu:false,
        footer:{ content:"totalColumn" },
        format: webix.Number.formatNumber,
    },
    {id: "n_total_summ", width: 160, 
        header: [{text: "Сумма с НДС"},
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




