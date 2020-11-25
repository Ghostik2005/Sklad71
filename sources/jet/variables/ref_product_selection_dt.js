"use strict";

import {names} from "../views/common";

export const refProdSelColumns = [
    {id: "c_id", hidden: true,
        headermenu: false,
        width: 5,
    },
    {id: "c_code", width: 150,
        // sort: "server",
        header: [{text: names('c_code').value}
            ],
        headermenu:!false,
        hidden: !true
        // filter_type: "date",

    },
    {id: "c_inprice", width: 120,
        // sort: "server",
        css: "center_text",
        header: {text: names('n_inprice').value,
            autoheight:true,
            css: "multiline_header"
        },
        template: "{common.checkbox()}",
        headermenu:false,
        // editor: "text",
        filter_type: undefined
    },
    {id: "c_limit_excl", width: 120,
        // sort: "server",
        css: "center_text",
        template: "{common.checkbox()}",
        header: {text: names('n_limits_exclude').value,
            autoheight:true,
            css: "multiline_header"
        },
        headermenu: !false,
        hidden: true,
        // editor: "text",
        filter_type: undefined
    },
    {id: "c_name", fillspace: true,
        sort: "server",
        header: [{text: names('c_name').value},
        ],
        headermenu:false,
        footer:{ content:"totalTableLong" },
        // editor: "text",
        filter_type: "text"

    },
    {id: "c_namefull", width: 250,
        sort: "server",
        header: [{text: names('c_namefull').value},
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




