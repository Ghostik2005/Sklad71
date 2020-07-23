"use strict";
import {JetView} from "webix-jet";
import ArrivalsHeaderView from "../models/arrivals_header";
// import FooterView from "../views/footer";
import ArrivalsCenterView from "../models/arrivals_center";

export default class ArrivalsView extends JetView{
    config() {
        let app = this.app;
        var ui = {
            type:"line",
            rows: [
                { $subview: ArrivalsHeaderView },
                {height: 2},
                // {},
                new ArrivalsCenterView(app, 'arrivals'),
                // (!this.app.config.production) ? { $subview: FooterView } : {hidden: true},
            ],
        };
        return ui;
    }


    init(){

    }

    ready() {
    }

}
