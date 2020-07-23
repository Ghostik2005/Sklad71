"use strict";

// import {formatNumber, ref_states, ref_translates} from "../views/common";

// import {v_names} from "../views/variables"


// const names = function(method) {
//     let ret = ref_translates.data.getItem(method);
//     ret = ret || v_names[method];
//     return ret    
// }

export const prodSelColumns = [
    {id: "c_id", hidden: true,
        headermenu: false,
        width: 5,
    },
    {id: "c_code", width: 150, 
        // sort: "server", 
        header: [{text: "Код товара"},
            ],
        headermenu:!false,
        hidden: !true
        // filter_type: "date",

    },
    {id: "c_name", fillspace: true, 
        sort: "server", 
        header: [{text: "Наименование"},
        ],
        headermenu:false,
        footer:{ content:"totalTableLong" },
        // editor: "text",
        filter_type: "text"

    },
    {id: "c_namefull", width: 250, 
        sort: "server", 
        header: [{text: "Полное наименование"},
            ],
        headermenu:!false,
        hidden: true
        // filter_type: "date",
        // footer:{ content:"totalTable" }
    },
    {id: "c_vat", hidden: true,
        headermenu: false,
        width: 5,
    },

];




