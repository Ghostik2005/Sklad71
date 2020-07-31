"use strict";

import {JetView} from "webix-jet";
import TemplateRefreshButton from "../models/template_refresh_button";


export default class TemplateQuickFilters extends JetView{
    constructor(app, parent_name) {
        super(app);
        this.parent_name = parent_name;
    }

    config(){
        
        let local_this = this;
        let app = this.app;

        let filters = {
            borderless: true,
            cols: [
                {view: "label", 
                    localId: "__1",
                    label: app.getService("common").genLabel(1),
                    width: 70,
                    on: {
                        onItemClick: function() {
                            this.$scope.checkTag(this.config.localId, 1);
                        }
                    }
                },
                {view: "label", 
                    localId: "__2",
                    label: app.getService("common").genLabel(2),
                    width: 100,
                    on: {
                        onItemClick: function() {
                            this.$scope.checkTag(this.config.localId, 2);
                        }
                    }
                },
                {view: "label", 
                    localId: "__3",
                    label: app.getService("common").genLabel(3),
                    width: 100,
                    on: {
                        onItemClick: function() {
                            this.$scope.checkTag(this.config.localId, 3);
                        }
                    }
                },
                new TemplateRefreshButton(app, local_this.parent_name),
                {width: 10},
            ],

        }

        return filters
    }


    uncheckAll() {
        //сбрасываем все фильтры
        this.tags.forEach( (item)=>{
            let label = this.$$(item).$view.children[0].children[1];
            label.classList.add('ordinary_label');
        })
    }

    setFilter(state) {
        if (this.state !== state) {
            this.app.commonWidgets[this.parent_name].menu_filters.setState(state)
            this.state = state
        }
    }

    checkTag(name, state, setF=true) {
        // this.app.commonWidgets.shipments.menu_filters.hide();
        //выделяем выбранное слово, остальные сбрасываем
        // console.log('name', name);
        let label = this.$$(name).$view.children[0].children[1];
        if (!label.classList.contains('ordinary_label') && setF) {
            state = ''
            this.uncheckAll();
        } else if (!setF) {
            this.uncheckAll();
            if (this.tags.includes(name)) {
                label.classList.remove('ordinary_label');
            }
        } else {
            this.uncheckAll();
            if (this.tags.includes(name)) {
                label.classList.remove('ordinary_label');
            }
        }
        if (setF) this.setFilter(state);
    }
    
    ready() {
        this.app.commonWidgets[this.parent_name]['quick_filters'] = this;
        this.tags = [
            "__1", "__2", "__3"
        ]
    }

    init() {
    }
}

