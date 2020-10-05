"use strict";

import {JetView} from "webix-jet";



export default class SearchBar extends JetView{
    
    config(){

        let searchbar = { 
            view: "text", 
            label: "", 
            labelWidth: 0,
            value: '', 
            width: 450, 
            placeholder: "Поиск по составу",
            on: {
                onItemClick: ()=>{
                }
            }
        }

        return searchbar
    }

    ready() {
        this.app.commonWidgets['search_bar'] = this;
        
    }

    init() {
    
    }
}