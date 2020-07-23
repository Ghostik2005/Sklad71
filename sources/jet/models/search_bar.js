"use strict";

import {JetView} from "webix-jet";
import {message} from "../views/common";



export default class SearchBar extends JetView{
    
    config(){

        let searchbar = { 
            // id: "_searchbar",
            view: "text", 
            label: "", 
            labelWidth: 0,
            value: '', 
            width: 450, 
            placeholder: "Поиск по составу",
            on: {
                onItemClick: ()=>{
                    console.log('clickk')
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