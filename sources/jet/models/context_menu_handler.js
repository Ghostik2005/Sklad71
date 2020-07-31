"use strict";

import {newDocument} from "../models/common_functions";

export function handle_context(cfg) {
    let context = cfg.context;
    let id = cfg.id;
    let local_this = cfg.local_this;
    let th = local_this.$scope;
    let row = cfg.row;
    let doc_type = cfg.doc_type;
    let app = th.app;
    let r_data;

    switch(id) {
        case "1":
            let copied = row[context.position.column];
            if (navigator.clipboard) {
                navigator.clipboard.writeText(copied).then(() => {
                    document.message('Скопировано в буфер');
                })
            } else {
                document.message('Браузер устарел, скопировать в буфер невозможно', 'error', 3);
            };
            break;
        case "2":
            document.message('Загрузить');
            break;
        case "3":
            r_data = app.getService("common").holdDocument(doc_type, row.n_id, row.id);
            //делаем изменения в таблице
            if (r_data.data) {
                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
            }

            break;
        case "4":
            r_data = app.getService("common").unHoldDocument(doc_type, row.n_id, row.id);
            //делаем изменения в таблице
            if (r_data.data) {
                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
            }
            break;
        case "6":
            r_data = app.getService("common").deleteDocument(doc_type, row.n_id, row.id);
            //делаем изменения в таблице
            if (r_data.data) {
                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
            }
            break;
        case "7":
            r_data = app.getService("common").unDeleteDocument(doc_type, row.n_id, row.id);
            //делаем изменения в таблице
            if (r_data.data) {
                context.table.updateItem(r_data.kwargs.filters.intable, r_data.data[0])
            }
            break;
        case "901":
            newDocument.arrival(th);
            break;
        case "902":
            newDocument.shipment(th);
            break;
        // default:
        //     document.message(local_this.getMenuItem(id).value);
        //     break
        }
}
