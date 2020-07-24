"use strict";

import {JetView} from "webix-jet";
import {message, ref_states} from "../views/common";
import {v_states} from "../views/variables";
import TemplateRefreshButton from "../models/template_refresh_button";



export default class ArrivalsQuickFilters extends JetView{
    config(){

        const genLabel = function(method) {
            let button = ref_states.data.getItem(method) || v_states[method];
            return "<span class='table_icon " + button.picture + "', style='color: " + button.color + " '></span><span class='ordinary_label'>" + button.value.toLowerCase() + "</span>"
        }
        
        // const genId = function()

        let filters = {
            borderless: true,
            cols: [
                {view: "label", 
                    localId: "__1",
                    label: genLabel(1),
                    width: 70,
                    on: {
                        onItemClick: function() {
                            this.$scope.checkTag(this.config.localId, 1);
                        }
                    }
                },
                {view: "label", 
                    localId: "__2",
                    label: genLabel(2),
                    width: 100,
                    on: {
                        onItemClick: function() {
                            this.$scope.checkTag(this.config.localId, 2);
                        }
                    }
                },
                {view: "label", 
                    localId: "__3",
                    label: genLabel(3),
                    width: 100,
                    on: {
                        onItemClick: function() {
                            this.$scope.checkTag(this.config.localId, 3);
                        }
                    }
                },
                new TemplateRefreshButton(this.app, 'arrivals'),
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
            this.app.commonWidgets.arrivals.menu_filters.setState(state)
            this.state = state
        }
    }

    checkTag(name, state, setF=true) {
        // this.app.commonWidgets.arrivals.menu_filters.hide();
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
        this.app.commonWidgets.arrivals['quick_filters'] = this;
        this.tags = [
            "__1", "__2", "__3"
        ]
    }

    init() {
    }
}

