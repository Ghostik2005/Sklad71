import "./styles/styles.css";



import {JetApp, JetView} from "webix-jet";
import {EmptyRouter} from "webix-jet";
import "./locales/ru";
import {extendWebix, getRefs} from "./views/common"

export default class app extends JetApp{
	constructor(config){
		const defaults = {            
            production:     PRODUCTION,
            id:             "sklad71App",
            name:           APPNAME,
            version:        VERSION,
            start:          "/login",
            // start:          "/start",
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
            user_id:        ""
        };
        
        super({ ...defaults, ...config });
        
        // this.config.r_url = document.location.protocol +'//' + document.location.hostname +  "/sorbent_logic"
        // document.rpc_url = (this.config.production) ? 'https://online365.pro/RPC/' : 'http://127.0.0.1/RPC/';
        document.rpc_url = (PRODUCTION) ? 'https://online365.pro/RPC/' : 'http://127.0.0.1/RPC/';

        // document.rpc_url = 'http://127.0.0.1/RPC/';
        // console.log('init.r', document.rpc_url);        

		this.attachEvent("app:error:resolve", function(name, error) {
			window.console.error(error);
		});
        var app = this;
        app['commonWidgets'] = {
            "arrivals": {},
            "shipments": {},
            "balance": {},
            "sidebar": {},
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
        getRefs();
        extendWebix();

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

