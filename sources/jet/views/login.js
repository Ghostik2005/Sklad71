"use strict";

import {JetView} from "webix-jet";
import {getCookie, setCookie, deleteCookie} from "../views/common";
import md5 from "../views/md5";
import {getDatas} from "../models/data_processing"

export default class login extends JetView{
    config(){
        var th = this;
        var app = th.app;

        var auth = {view: "form",
            localId: "auth_box",
            label:"Аутентификация",
            elements:[
                {view:"text", label:"Пользователь", name:"user", labelWidth: 120, width: 400, localId: "_user",
                },
                { view:"text", type:"password", label:"Пароль", name:"pass", labelWidth: 120, width: 400,
                },
                {cols: [
                    {},
                    {},
                    {view: "button", label: "OK", hotkey: "enter",
                        tooltip: "Войти",
                        click: function(){
                            if (th.validate_user(th.$$("auth_box").getValues())) {
                                this.$scope.show("/start");

                            } else {
                                document.message('не авторизованно', "error");
                                deleteCookie(app.config.sklad_cook);
                                }
                        }
                    },
                ]}
            ]
        }

        var af = {
            view: "layout",
            rows: [
                {height: document.documentElement.clientHeight/4},
                {cols: [
                    {},
                     auth,
                    {},
                    ]},
                {},
                ]}

        return af
        }

    ready() {
        this.$$("_user").focus();
    }

    init() {
        let app = this.app;
        if (getCookie(app.config.sklad_cook)) this.show("/start");
    }


    validate_user(item) {
        let app = this.app;
        var ret = false;
        item.pass = md5(item.pass);
        let response = getDatas.login(item.user, item.pass);
        if (response && response.data && !response.reason) {
            let d = response.data[0];
            ret = true;
            var opt = {'path': '/', 'expires': 0};
            // app.config.x_api = undefined;

            setCookie(app.config.sklad_cook, [d.n_sklad_name, d.n_hash].join(''), opt)
        };
        return ret;
    }

}
