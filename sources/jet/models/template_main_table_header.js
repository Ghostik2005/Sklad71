"use strict";

import {JetView} from "webix-jet";
import {emptyWidth} from "../variables/variables";
import SearchBar from "../models/search_bar";
import TemplateQuickFilters from "../models/template_quick_filters";
import TemplateButtonFilters from "../models/template_button_filters"
import TemplateStatusBar from "../models/template_status_bar";

export default class TemplateMainHeaderView extends JetView{

    constructor(app, name, title) {
        super(app);
        this.p_name = name;
        this.p_title = title;

    }

    config(){
        let local_this = this;
        let app = this.app;
        let toolbar = {view: 'toolbar',
            borderless: true,
            margin: 0,
            cols: [
                {view: "label",
                    label: "<span class='label_highlited'>" + local_this.p_title + "</span>",
                    autowidth: true,
                    css: "label_highlited", hidden: true
                },
                {width: emptyWidth},
                {$subview: SearchBar, name: "search_bar"},
                {},
                new TemplateQuickFilters(app, local_this.p_name),
                new TemplateButtonFilters(app, local_this.p_name),
            ]

        }

        let status = {
            height: 26,
            borderless: true,
            cols: [
                {view: "label",
                    hidden: true,
                    autowidth: true,
                    label: "Название юр. лица:",
                    on: {
                        onItemClick: function(id, event) {
                            this.$scope.changeOrganization(id, event)
                        },
                    }
                },
                {width: emptyWidth},
                {view: "label",
                    hidden: true,
                    css: "italic",
                    autowidth: true,
                    label: "ООО Организация",
                    on: {
                        onItemClick: function(id, event) {
                            this.$scope.changeOrganization(id, event)
                        },
                    },
                },
                {width: emptyWidth},
                {width: emptyWidth},
                new TemplateStatusBar(app, local_this.p_name),
            ]
        }

        return {
            borderless: true,
            rows: [
                toolbar,
                status,
            ]
        }

    }

    changeOrganization(id, event) {
        document.message('Смена организации');
    }

    ready() {
        this.app.commonWidgets[this.p_name]['header'] = this;
    }

    init() {
    }
}
