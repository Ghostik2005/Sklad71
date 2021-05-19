"use strict";

import {JetView} from "webix-jet";
import {reference, isEmpty} from "../models/data_processing";


export default class TemplateProductsRepView extends JetView{

    constructor(app, cfg) {
        super(app);
        this.cfg = cfg;
    }

    config(){
        let l_this = this;
        let table = {view: "datatable",
            // summs: undefined,
            id: this.cfg.id,
            borderless: true,
            name: this.cfg.name || "_table_",
            clipboard: true,
            localId: "__table",
            navigation: "row",
            select: "row",
            // multiselect: true, //если решим делать групповые действия
            datafetch: 30, //количество записей для подгрузки
            datathrottle: 10, //время для следующей загрузки
            loadahead: 40, //количество записей для предзагрузки
            resizeColumn:true,
            fixedRowHeight:false,
            rowLineHeight:28,
            rowHeight:28,
            editable: !false,
            footer: true,
            url: function(params) {
                return this.$scope.cfg.loadFunction(params, this);
            },
            headermenu:{
                autowidth: true,
                scroll: true,
                autoheight:false,
                spans: true,
                yCount: 4
                },
            css:"webix_header_border center_dt",
            scroll: 'xy',
            tooltip: true,
            columns: this.cfg.columns,
            // leftSplit: 1,
            sorting: this.cfg.sorting,
            onClick: {
                // menubtn:function(e, id, html){
                //     return this.$scope.callContext(e, this);
                // }
            },
            onContext: {
                // webix_ss_center: function(e, id){
                //     return this.$scope.callContext(e, this);
                // }
            },
            on: {
                onCheck: function(row_id, col_name, value) {
                    let item = this.getItem(row_id);
                    let table_name = this.$scope.cfg.name;
                    let params = {"table": table_name, "item_id": item.c_id,
                        "item_code": item.c_code,
                        "value": value, "field": col_name
                    }
                    let res = reference.checkmark(params);
                    if (isEmpty(res)) {
                        this.blockEvent()
                        item[col_name] = !value;
                        this.updateItem(row_id, item);
                        this.unblockEvent()
                    }
                },

                onAfterSelect: function() {
                    let i = this.getSelectedId()
                    if (i) {
                        this.$scope.cfg.topParent.$$("__create").show()
                    } else {
                        this.$scope.cfg.topParent.$$("__create").hide()
                    }
                },
                onAfterLoad: function() {
                    // this.blockEvent();
                    this.markSorting(this.config.sorting.id, this.config.sorting.dir);
                    // this.unblockEvent();
                },
                onDataUpdate: function(row_id, new_val, old_val) {
                    l_this.cfg.setChange(row_id, new_val, old_val, l_this);
                },
                onKeyPress: function(code, event) {
                    return
                    if (code===13) {
                        let item = this.getSelectedId();
                        this.callEvent('onItemDblClick', [item])
                    }
                },
                onItemDblClick: function(item) {
                    return l_this.cfg.dblClick(item, this)
                },
            }
        }
    return table

    }


}