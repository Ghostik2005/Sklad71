"use strict";

import {JetView} from "webix-jet";
import {dtColumns} from "../models/balance_centerDt";
import BalanceContextCenterDt from "../models/balance_context_center_dt";
import {balanceGetData} from "../models/data_processing";



export default class BalanceCenterView extends JetView{
    
    constructor(app, view_name) {

        super(app);
        this.view_name = view_name;

    }

    config() {

        let sprv = {view: "datatable",
            borderless: true,
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
                return balanceGetData(params, this);
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
            columns: dtColumns,
            leftSplit: 1,
            sorting: {id: "n_product", dir: "asc"},
            onClick: {
                menubtn: function(e, id, html){
                    return this.$scope.callContext(e, this);
                }
            },
            onContext: {
                webix_ss_center: function(e, id){
                    console.log('e', e);
                    return this.$scope.callContext(e, this);
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
                    // if (id) {
                    //     let focus = webix.UIManager.getFocus();
                    //     let doc = this.$scope.ui(this.$scope.cfg.docBody);
                    //     doc.show(this.getItem(id), focus, this.$scope.$$("__table"));
                    // }
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

    callContext(e, table) {
        let pos = table.locate(e);
        this.contextDt.setContext({obj:webix.$$(e), table:table, position: pos});
        this.contextDt.show(e);
        return webix.html.preventEvent(e);
    }

    getData(){
        this.__table.clearAll(true);
        this.__table.loadNext(0, 0, 0, 0, true).then((data)=> {
            if (data) {
                this.__table.clearAll(true);
                this.__table.parse(data);
                this.__table.showItemByIndex(0);
            }
        })
    }

    getHeaders(){

        let configs = []
        this.__table.eachColumn((colId) => {
            let col = this.__table.getColumnConfig(colId);
            configs.push(col)

        }, true)
        return configs

    }


    ready() {

        this.__table = this.$$("__table");
        this.app.commonWidgets.balance['center_table'] = this;
        
    }

    
    init() {

        this.contextDt = this.ui(BalanceContextCenterDt);

    }
}
