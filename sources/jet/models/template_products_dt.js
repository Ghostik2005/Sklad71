"use strict";

import {JetView} from "webix-jet";


export default class TemplateProductsView extends JetView{

    constructor(app, cfg) {
        super(app);
        this.cfg = cfg;
    }

    config(){

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
            url: (params) => {
                return this.cfg.loadFunction(params, this);
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
                onAfterSelect: function() {
                    let i = this.getSelectedId()
                    if (i) {
                        this.$scope.cfg.topParent.$$("__edit").show()
                        // this.$scope.cfg.buttons.edit.show()
                    } else {
                        this.$scope.cfg.topParent.$$("__edit").hide()
                        // this.$scope.cfg.buttons.edit.hide()
                    }
                },
                onAfterLoad: function() {
                    this.blockEvent();
                    this.markSorting(this.config.sorting.id, this.config.sorting.dir);
                    this.unblockEvent();
                },
                onKeyPress: function(code, event) {
                    if (code===13) {
                        let item = this.getSelectedId();
                        this.callEvent('onItemDblClick', [item])
                    }
                },
                onItemDblClick: this.cfg.dblClick,
            }
        }
    return table

    }

}