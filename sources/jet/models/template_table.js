"use strict";

import {JetView} from "webix-jet";
import {message} from "../views/common";
import {checkOpened} from "../models/data_processing";

export default class TemplateCenterTable extends JetView{
    
    constructor(app, cfg) {
        super(app);
        this.cfg = cfg;
    }

    config(){
        
        let sprv = {view: "datatable",
            borderless: true,
            name: "__main",
            clipboard: true,
            id: this.cfg.id,
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
                return this.$scope.cfg.loadData(params, this);
            },
            // save: arrivalsSaveData,
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
            leftSplit: 1,
            sorting: this.cfg.sorting,
            onClick: {
                menubtn: function(e, id, html){
                    return this.$scope.cfg.parent.callContext(e, this);
                }
            },
            onContext: {
                webix_ss_center: function(e, id){
                    return this.$scope.cfg.parent.callContext(e, this);
                }
            },
            on: {
                onCheck: function(id, column, state){
                    (state) ? this.select(id, true) : this.unselect(id, true);
                },
                onAfterLoad: function() {
                    this.markSorting(this.config.sorting.id, this.config.sorting.dir)
                },
                onKeyPress: function(code, event) {
                    if (code===13) {
                        let item = this.getSelectedId();
                        this.callEvent('onItemDblClick', [item])
                    }
                },
                onItemDblClick: function(id) {
                    if (id) {
                        let permission = checkOpened(this.getItem(id).n_id);
                        console.log('perm', permission);
                        if (permission) {
                            let focus = webix.UIManager.getFocus();
                            let doc = this.$scope.ui(this.$scope.cfg.docBody);
                            doc.show(this.getItem(id), focus, this.$scope.$$("__table"));
                        } else {
                            message("Этот документ уже открыт", 'debug', 3);
                        }
                    }
                }
            }
        }

        return {
            view: "layout",
            css: 'center_view',
            cols: [
                {width: 1}, 
                {rows: [
                    {height: 1},
                    sprv,
                    {height: 1},
                ]},
                {width: 1},
            ]
        }

    }

}
