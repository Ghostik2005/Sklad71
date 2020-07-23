"use strict";

export const pointsColumns = [
    {id: "n_id", hidden: true,
        headermenu: false,
        width: 5,
    },
    {id: "n_name", fillspace: true, 
        sort: "server", 
        header: [{text: "Название"},
        ],
        headermenu:false,
        footer:{ content:"totalTableLong" },
        // editor: "text",
        filter_type: "text"
    },
    {id: "n_parent",
        // sort: "server",
        width: 200,
        header: [{text: "Юр.лицо"},
        ],
        headermenu:false,
        hidden: !true,
        filter_type: "text"
        // filter_type: "combo"
    },
    {id: "n_address",
        // sort: "server",
        width: 250,
        header: [{text: "Адрес"},
        ],
        headermenu:false,
        hidden: !true,
        filter_type: "text"
    },
];


export const partnersColumns = [
    {id: "n_id", hidden: true,
        headermenu: false,
        width: 5,
    },
    {id: "n_name", fillspace: true, 
        sort: "server", 
        header: [{text: "Название"},
        ],
        headermenu:false,
        footer:{ content:"totalTableLong" },
        // editor: "text",
        filter_type: "text"
    },
    {id: "n_inn",
        // sort: "server",
        width: 140,
        header: [{text: "ИНН"},
        ],
        headermenu:!false,
        hidden: !true,
        filter_type: "text"
        // filter_type: "combo"
    },
    {id: "n_type_text",
        // sort: "server",
        width: 140,
        header: [{text: "Тип партнера"},
        ],
        headermenu:false,
        hidden: !true,
        filter_type: "combo"
    },
    {id: "n_points",
        // sort: "server",
        width: 140,
        header: [{text: "Подразделения"},
        ],
        headermenu:!false,
        hidden: true,
        filter_type: "text"
    },
];

export const vatsColumns = [
    {id: "c_id", hidden: true,
        headermenu: false,
        width: 5,
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
    {id: "c_vat",
        // sort: "server",
        width: 100,
        header: [{text: "Ставка, %"},
        ],
        headermenu:!false,
        hidden: !true,
        filter_type: "text"
    },
]

export const trademarksColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
]

export const spesColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
    {id: "c_cat",
        // sort: "server",
        width: 180,
        header: [{text: "Категория"},
        ],
        headermenu:!false,
        hidden: !true,
        filter_type: "combo"
    },
]

export const relformsColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
]

export const partnerstypesColumns = [
    {id: "n_id", hidden: true,
        headermenu: false,
        width: 5,
    },
    {id: "n_name", fillspace: true, 
        sort: "server", 
        header: [{text: "Наименование"},
        ],
        headermenu:false,
        footer:{ content:"totalTableLong" },
        // editor: "text",
        filter_type: "text"
    },

]

export const packsColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
]

export const mnnsColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
    },
    {id: "c_rusname", fillspace: true, 
        sort: "server", 
        header: [{text: "Русское наименование"},
        ],
        headermenu:false,
        footer:{ content:"totalTableLong" },
        // editor: "text",
        filter_type: "text"
    },
    {id: "c_latname",
        // sort: "server",
        width: 140,
        header: [{text: "Латинское наименование"},
        ],
        headermenu:!false,
        hidden: !true,
        filter_type: "text"
    },
    {id: "c_engname",
        // sort: "server",
        width: 140,
        header: [{text: "Английское наименование"},
        ],
        headermenu:!false,
        hidden: !true,
        filter_type: "text"
    },
]

export const megasColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
]

export const mansColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
]

export const groupsColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
    {id: "с_parent",
        width: 160,
        sort: "server", 
        header: [{text: "Родительская группа"},
        ],
        headermenu:false,
        // editor: "text",
        filter_type: "combo"
    },
]

export const employeesColumns = [
    {id: "n_id", hidden: true,
        headermenu: false,
        width: 5,
    },
    {id: "n_name", fillspace: true, 
        sort: "server", 
        header: [{text: "Наименование"},
        ],
        headermenu:false,
        footer:{ content:"totalTableLong" },
        // editor: "text",
        filter_type: "text"
    },
]

export const dirsColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
]

export const dosagesColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
]

export const countriesColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
]

export const catsColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
    {id: "с_dir",
        width: 140,
        sort: "server", 
        header: [{text: "Направление"},
        ],
        headermenu:false,
        // editor: "text",
        filter_type: "combo"
    },
]

export const appareasColumns = [
    {id: "с_id", hidden: true,
        headermenu: false,
        width: 5,
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
    {id: "с_parent",
        width: 180,
        sort: "server", 
        header: [{text: "Родительское направление"},
        ],
        headermenu:false,
        // editor: "text",
        filter_type: "combo"
    },
]

