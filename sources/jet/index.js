import "./styles/styles.css";

import {getRefs} from "./views/common";
import {JetApp, JetView} from "webix-jet";
import {EmptyRouter} from "webix-jet";
import "./locales/ru";
import { app_common } from "./common";


export default class app extends JetApp{
	constructor(config){
                
		const defaults = {            
            production:     PRODUCTION,
            id:             "sklad71App",
            name:           APPNAME,
            version:        VERSION,
            start:          "/login",
            home_org_id:    "",
            home_org:       "",
            user:           "",
            fullname:       "",
            role:           0,
            eventS:         undefined,
            // r_url:          (!PRODUCTION) ? "http://saas.local/sorbent_logic" : "../sorbent_logic",
            router:         EmptyRouter,
            x_api:          "x_login",
            debug:          true,
            searchDelay:    1000,
            popDelay:       800,
            roles:          [],
            sklad_cook:     "sk_new-app",
            user_id:        "",
            restricted:     {}, //словарь элементов, если true - запрещено пользователю
            restricted_menu: {}, //словарь элементов контекстного меню, если true - запрещено пользователю
        };
        super({ ...defaults, ...config });    
        
        document.rpc_url = (PRODUCTION) ? 'https://online365.pro/RPC/' : 'http://127.0.0.1/RPC/';


		this.attachEvent("app:error:resolve", function(name, error) {
			window.console.error(error);
		});
        var app = this;
        
        app.use(app_common);
        document.app = app;
        document.message = (msg, type="success", expires=1) => {
            webix.message({
                type: type, 
                text: msg,
                expire: expires*1000
            })
        };

        getRefs(app);
        app['commonWidgets'] = {
            "arrivals": {},
            "shipments": {},
            "balances": {},
            // "sidebar": {},
            "orders": {},
        },

		webix.attachEvent("onBeforeAjax", function(mode, url, data, request, headers, files, promise){
			headers["x-api-key"] = app.config.x_api;
        });

        window.onerror = function (message, source, lineNr, col, err) {
            webix.message({"text": "Возникла ошибка - мы работаем над ее исправлением. Текст в консоли", "type": "error", width: "800px", delay: "5"}); //
            window.console.log("message:", message);
            window.console.log("source:", source);
            window.console.log("err:", err);
            return true; 
        };

        app.attachEvent("app:error:resolve", function(name, error) {
            window.console.error(error);
            });

        
    }
    
}

webix.i18n.setLocale("ru-RU");
if (!BUILD_AS_MODULE){
    webix.ready(() => new app().render() );
};


// add this
webix.protoUI({
    name:"sklad71",
    app: app
}, webix.ui.jetapp);

