"use strict";

import {names} from "../views/common";

let states = document.app.states;


export const RestsdtColumns = [
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
            // {text: "", },
            {text: "", },
        ],
        filter_type: "none",
        footer: {text:"Всего документов в выборке:", colspan:3}
    },
    {id: "n_state", width: 40,
        sort: false,
        tooltip: function(obj) {
            return states[obj.n_state].value
        },
        template: function (obj) {
            return "<span class='table_icon " + states[obj.n_state].picture + "', style='color: " + states[obj.n_state].color  +"'></span>";
        },
        css: "center_text",
        header: [{text: ""},
        ],
        headermenu:false,
        filter_type: "combo",

    },
    {id: "n_number", width: 100,
        sort: "server",
        header: [{text: names('n_number').value},
        ],
        headermenu:false,
        // editor: "text",
        filter_type: "text"

    },
    {id: "n_dt_invoice", width: 120,
        sort: "server",
        header: [{text: names('n_dt_invoice').value},
            ],
        headermenu:false,
        format: webix.i18n.dateFormatStr,
        filter_type: "date",
        footer:{ content:"totalTable" }
    },
    {id: "n_recipient",
        fillspace: 1,
        sort: "server",
        header: [{text: names('n_recipient').value},
        ],
        headermenu:false,
        filter_type: "multi"
    },
    {id: "n_recipient_id", width: 0,
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
    {id: "n_nds", width: 120,
        sort: "server",
        header: [{text: names('n_nds').value},
        ],
        format: webix.Number.formatNumber,
        headermenu:!false,
        hidden: true,
        filter_type: "text"
    },
    {id: "n_pos_numbers", width: 90,
        sort: "server",
        header: [{text: names('n_pos_numbers').value},
        ],
        headermenu:false,
        filter_type: "text"
    },
    {id: "n_executor", width: 140,
        sort: "server",
        header: [{text: names('n_executor').value},
        ],
        headermenu:false,
        filter_type: "multi"
    },
    {id: "n_base", //width: 180,
        width: 260,
        sort: "server",
        header: [{text: names('n_base').value},
        ],
        headermenu:false,
        filter_type: "text"
    },
    {id: "n_paid", width: 80,
        sort: "server",
        header: [{text: names('n_paid').value},
        ],
        headermenu:!false,
        hidden: true,
        filter_type: "combo"
    },
    {id: "n_dt_change", width: 160,
        sort: "server",
        header: [{text: names('n_dt_change').value},
        ],
        format: webix.Date.dateToStr("%d.%m.%Y %H:%i:%s"),
        headermenu:!false,
        filter_type: "date"
    },

];




