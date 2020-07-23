"use strict";

import {formatNumber, ref_states, ref_translates} from "../views/common";

import {v_names_orders} from "../views/variables"


const names = function(method) {
    let ret = v_names_orders[method];
    return ret    
}

export const dtColumns = [
    {id: "n_id", hidden: true,
        headermenu: false,
        width: 50,
        filter_type: "none"

    },
    { id: "_checked", sort: "server",
        sort: false,
        css: "center_text",
        hidden: !true,
        tooltip: false,
        headermenu: false,
        width: 50,
        // template: "{common.checkbox()}   <span class='menubtn mdi-settings'></span>", //если решим делать групповые действия
        template: "<span class='menubtn mdi-settings'></span>",
        header: [
            {text: "", },
            {text: "", },
        ],
        filter_type: "none",
        
    },
    {id: "n_state", width: 40, 
        sort: false,
        tooltip: function(obj) {
            return ref_states.data.getItem(obj.n_state).value
        },
        template: function (obj) {
            return "<span class='table_icon " + ref_states.data.getItem(obj.n_state).picture + "', style='color: " + ref_states.data.getItem(obj.n_state).color  +"'></span>";
        },
        css: "center_text",
        header: [{text: ""},
        ],
        headermenu:false,
        filter_type: "combo",
        
    },
    {id: "n_supplier", width: 1, 
        // sort: "server", 
        header: [{text: names('n_supplier').value},
        ],
        headermenu:false,
        hidden: true,
    },
    {id: "n_filename", width: 1, 
        // sort: "server", 
        header: [{text: names('n_filename').value},
        ],
        headermenu:false,
        hidden: true,
    },
    {id: "n_id_field", width: 100, 
        sort: "server", 
        header: [{text: names('n_id_field').value},
        ],
        headermenu:!false,
        hidden: true,
        // editor: "text",
        filter_type: "text"
    },    
    {id: "n_name", width: 240, 
        sort: "server", 
        header: [{text: names('n_name').value},
        ],
        headermenu:!false,
        hidden :true,
        // editor: "text",
        filter_type: "multi",
    },
    {id: "n_recipient", fillspace: 1,
        sort: "server", 
        header: [{text: names('n_recipient').value},
        ],
        headermenu:false,
        filter_type: "multi",
        footer: {text:"Всего документов в выборке:", colspan:1}
    },
    {id: "n_p_id", width: 1, 
        sort: "server", 
        header: [{text: names('n_p_id').value},
        ],
        headermenu:false,
        hidden: true
    },
    {id: "n_inn", width: 100, 
        sort: "server", 
        header: [{text: names('n_inn').value},
        ],
        headermenu:false,
        hidden: !true,
        filter_type: "text",
        footer:{ content:"totalTable" }
    },
    {id: "n_code", width: 100, 
        sort: "server", 
        header: [{text: names('n_code').value},
        ],
        headermenu:!false,
        hidden: true,
        filter_type: "text"
    },
    {id: "n_dt_price", width: 120, 
        sort: "server", 
        header: [{text: names('n_dt_price').value},
            ],
        headermenu:!false,
        hidden: true,
        format: webix.i18n.dateFormatStr,
        filter_type: "date",
    },
    {id: "n_dt_invoice", width: 120, 
        sort: "server", 
        header: [{text: names('n_dt_invoice').value},
            ],
        headermenu:false,
        format: webix.i18n.dateFormatStr,
        filter_type: "date",

    },
    {id: "n_number", width: 100, 
        sort: "server", 
        header: [{text: names('n_number').value},
        ],
        headermenu:!false,
        // editor: "text",
        filter_type: "text"
    },
    {id: "n_dt_send", width: 120, 
        sort: "server", 
        header: [{text: names('n_dt_send').value},
            ],
        headermenu:!false,
        format: webix.i18n.dateFormatStr,
        filter_type: "date",
    },

    {id: "n_recipient_id", width: 1, 
        hidden: true,
        headermenu:false,
    },

    {id: "n_summ", width: 140, 
        sort: "server", 
        header: [{text: names('n_summ').value},
        ],
        format: webix.Number.formatNumber,
        headermenu:false,
        filter_type: "text"
    },
    {id: "n_pos_numbers", width: 90, 
        sort: "server", 
        header: [{text: names('n_pos_numbers').value},
        ],
        headermenu:false,
        filter_type: "text"
    },
    {id: "n_dt_recieved", width: 120, 
        sort: "server", 
        header: [{text: names('n_dt_recieved').value},
        ],
        format: webix.Date.dateToStr("%d.%m.%Y %H:%i:%s"),
        headermenu:false,
        filter_type: "date"
    },
    {id: "n_comment", width: 120, 
        // sort: "server", 
        header: [{text: names('n_comment').value},
        ],
        headermenu:!false,
        hidden: true,
        // filter_type: "date"
    },

];



