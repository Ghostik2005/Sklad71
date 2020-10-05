"use strict";

import {formatNumber, names} from "../views/common";


export const BaldtColumns = [
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
        // footer: {text:"Всего документов в выборке:", colspan:3}
    },
    {id: "n_product_id", width: 40,
        header: [{text: names('n_product_id').value},
        ],
        headermenu:false,
        hidden: true
    },
    {id: "n_code",
        width: 180,
        sort: "server",
        header: [{text: names('n_code').value},
        ],
        headermenu:false,
        // editor: "text",
        filter_type: "text"
    },
    {id: "n_product",
        fillspace: 1,
        sort: "server",
        header: [{text: names('n_product').value},
        ],
        headermenu:false,
        // editor: "text",
        filter_type: "text"
    },
    {id: "n_consignment",
        width: 180,
        sort: "server",
        header: [{text: names('n_consignment').value},
        ],
        headermenu:!false,
        filter_type: "text"
    },
    {id: "n_dt", width: 120,
        sort: "server",
        header: [{text: names('n_dt').value},
            ],
        headermenu:false,
        format: webix.i18n.dateFormatStr,
        filter_type: "date",
        // footer:{ content:"totalTable" }
    },
    {id: "n_warehouse", width: 160,
        sort: "server",
        header: [{text: names('n_warehouse').value},
        ],
        headermenu:!false,
        hidden: true,
        filter_type: "combo"
    },
    {id: "n_quantity", width: 160,
        sort: "server",
        header: [{text: names('n_quantity').value},
        ],
        headermenu:false,
        filter_type: "text"
    },
    {id: "n_price", width: 140,
        sort: "server",
        header: [{text: names('n_price').value},
        ],
        format: webix.Number.formatNumber,
        headermenu:!false,
        hidden: true,
        filter_type: "text"
    },
    {id: "n_vat", width: 120,
        sort: "server",
        header: [{text: names('n_vat').value},
        ],
        format: webix.Number.formatNumber,
        headermenu:!false,
        hidden: true,
        filter_type: "text"
    },
    {id: "n_price_price", width: 140,
        sort: "server",
        header: [{text: names('n_price_price').value},
        ],
        format: webix.Number.formatNumber,
        headermenu:false,
        filter_type: "text"
    },
    {id: "n_vat_included", width: 90,
        // sort: "server",
        header: [{text: names('n_vat_included').value},
        ],
        headermenu:!false,
        hidden: true,
        // footer:{ content:"summColumn" },
        filter_type: "combo"
    },

];




