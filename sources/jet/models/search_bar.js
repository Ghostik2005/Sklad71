"use strict";

import {JetView} from "webix-jet";



export default class SearchBar extends JetView{

    config(){
        let app = this.app;
        let searchbar = {
            localId: "_search",
            view: "text",
            label: "",
            labelWidth: 0,
            value: '',
            width: 650,
            minWidth: 450,
            placeholder: "Поиск",
            on: {
                onKeyPress: function(code, event) {
                    // if (code ===32 || (code>=48 && code<=90)) {
                        clearTimeout(this.delay);
                        this.delay = setTimeout(() => {
                            app.commonWidgets[this.$scope.p_name].center_table.getData()
                        }, 850);
                    // }
                },
            },
        }

        return searchbar
    }

    getSearch() {
        return this.$$('_search').getValue();
    }

    ready() {
        console.log('tt', this.p_name)
        this.app.commonWidgets[this.p_name]['search_bar'] = this;

    }

    init() {
        this.p_name = this.getParentView().getParentView().p_name

    }
}