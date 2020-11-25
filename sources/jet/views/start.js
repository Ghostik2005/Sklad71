"use strict";
import {JetView} from "webix-jet";
import HeaderView from "../views/header";
import FooterView from "../views/footer";
import CenterView from "../views/center";
import MenuButtonsBar from "../views/menu-bar";
import {getCookie} from "../views/common";
import {getDatas} from "../models/data_processing"

import md5 from "../views/md5";

export default class StartView extends JetView{
    config() {
        var ui = {
            type:"line",
            id: "sklad_main_ui",
            rows: [
                { $subview: HeaderView },
                {$subview: MenuButtonsBar},
                {height: 2},
                // {cols: [
                    // {$subview: MenuButtonsBar},
                    { $subview: CenterView },
                // ]},
                { $subview: FooterView },
            ],
        };
        return ui;
    }


    getError(error_type) {
        if (error_type === 1) {
            webix.alert({
                type:"alert-error",
                title:"Ошибка регистрации",
                text:"Пользователь не зарегистрирован в системе. Обратитесь к администратору",
                width:500
            }).then((result) => {
                this.getError(error_type);
                }
            )
        } else if (error_type === 2) {
            webix.alert({
                type:"alert-error",
                title:"Ошибка входа",
                buttons:["OK"],
                text: "Авторизуйтесь в складе и обновите страницу",
                width:300
            }).then((result) => {
                this.getError(error_type)
                }
            )
        } else {

        }
    }



    init(){
        let sklad_c = getCookie(this.app.config.sklad_cook);
        localStorage.setItem('opened', '');
        if (sklad_c.length > 32) {
            let user_name = decodeURI(sklad_c.slice(0, -32))
            // делаем запрос с разрешениями и параметрами пользователя и в этоже время поддягиваем справочники
            let d = getDatas.credentionals(user_name);
            if (d.data) {
                this.app.config.user = d.data[0].n_name;
                this.app.config.user_id = d.data[0].n_id;
                this.app.config.home_org_id = d.data[0].n_home_id;
                this.app.config.home_org = d.data[0].n_home_name;
            } else {
                this.getError(1);
            }
        } else {
            this.getError(2);
        }
    }

    ready() {
        // console.log('40035', md5('40035'))
        this.app.commonWidgets['header'].setUser();
        this.app.commonWidgets['header'].setOrg();
    }

}
