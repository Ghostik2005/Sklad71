"use strict";

export function common(app) {
    const s = {

        genLabel(method) {
            let states = document.app.states
            let button = states[method]
            return "<span class='table_icon " + button.picture + "', style='color: " + button.color + " '></span><span class='ordinary_label'>" + button.value.toLowerCase() + "</span>"
        },

        html_button_template(picture, tooltip, img_class) {
            img_class = img_class || 'html_button'
            let img = "<div class='" + img_class + "', title='" + tooltip + "', style='background-image:url(" + picture + ");'></div>";
            let but = "<div class='webix_el_button'><button class='webix_img_btn_abs', style='background:transparent'>" + img + "</button> </div>";
            return but
        },

        saveDocument(th){
            let not_saved = false;
            let header =  (th.$$("__charge")) ? {charge:  th.$$("__charge").getValue()} : {};
            let data = {header: Object.assign(header, th.getHeader().getData()), table: th.$$("__table").serialize()}
            //проверка документа на валидность введенных данных
            let valid = th.validateDocument(th, data);
            if (valid) return valid
            //отправляем данные на сервер для записи
            let saved = th.saveDocumentServer(th, data);
            if (saved) return saved
            return not_saved
        },

        holdDocument(doc_type, doc_id, intable_id) {
            let params = {"doc_type": doc_type, "doc_id": doc_id, "intable": intable_id};
            let params_to = {method:"hold_document", kwargs: {"user": getUser(), filters: params}}
            return checkResponse(request(params_to, !0).response, 's');
        },
        
        unDeleteDocument(doc_type, doc_id, intable_id) {
            let params = {"doc_type": doc_type, "doc_id": doc_id, "intable": intable_id};
            let params_to = {method:"undelete_document", kwargs: {"user": getUser(), filters: params}}
            return checkResponse(request(params_to, !0).response, 's');
        },
        
        deleteDocument(doc_type, doc_id, intable_id) {
            let params = {"doc_type": doc_type, "doc_id": doc_id, "intable": intable_id};
            let params_to = {method:"delete_document", kwargs: {"user": getUser(), filters: params}}
            return checkResponse(request(params_to, !0).response, 's');
        },
        
        unHoldDocument(doc_type, doc_id, intable_id) {
            let params = {"doc_type": doc_type, "doc_id": doc_id, "intable": intable_id};
            let params_to = {method:"unhold_document", kwargs: {"user": getUser(), filters: params}}
            return checkResponse(request(params_to, !0).response, 's');
        },

        logout() {
            deleteCookie(app.config.sklad_cook);
            location.href = document.location.href;
        },

        search_key(o, name) {
            let keys = Object.keys(o);
            let k;
            keys.forEach( (key) => {
                if (key.indexOf(name) !== -1) k = key
            })
            return k
        },
        

        

    }
    
    app.setService("common", s);
}

function getTranslates() {
    let params_to = {method:"get_translates", kwargs: {"user": "XXX"}}
    return checkResponse(request(params_to, !0).response, 's');
}

function getRefStates(params) {
    let params_to = {method:"get_states", kwargs: {"user": "XXX"}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}

export function getRefs(app) {
    app['translates'] = getTranslates().data;
    app['states'] = getRefStates().data;
}

export function names(method) {
    let app = document.app;
    let ret;

    if (app && app.translates) {
        ret = app.translates[method];
    } else {
        console.log('gg1', new Date())
        ret = 'undefined'
    }
    return ret
}

export function message(msg, type="success", expires=1) {
    webix.message({
        type: type, 
        text: msg,
        expire: expires*1000
    })
}


function after_call(text, data, XmlHttpRequest) {
    console.log('loading error');
    console.log(text);
    console.log(data);
    console.log(XmlHttpRequest);
    if (XmlHttpRequest.status == 403) {
        // deleteCookie("sorbent-app");
        // location.href = document.location.href;
    };
}

export function request(params, mode) {
    let url = (PRODUCTION) ? 'https://online365.pro/RPC/' : 'http://127.0.0.1/RPC/';
    // url = document.rpc_url;
    var req = (mode === !0) ? webix.ajax().sync().headers({'Content-type': 'application/json'}).post(url, params, {error: after_call})
                    : webix.ajax().timeout(90000).headers({'Content-type': 'application/json'}).post(url, params, {error: after_call})
    return req
}


export function checkResponse(result, mode) {
    
    var ret_value = {};
    var r;
    if (mode === 's') r = JSON.parse(result);
    else if (mode === 'a') r = result.json();
    if (r && r.result && r.result[0] && r.result[0].data) ret_value = r.result[0]

    return ret_value
}

export function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : NaN;
};

export function setCookie(name, value, options) {
    options = options || {};
    var expires = options.expires;
    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    };
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    };
    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value;
    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        };
    };
    document.cookie = updatedCookie;
}

export function deleteCookie (name) {
    setCookie(name, "", {
        'expires': -1, 'path': '/'
    })
}

export function getUser() {
    return $$("sklad_main_ui").$scope.app.config.user;
}

function init_suggest(editor, input) {
    var suggest = editor.config.suggest;
    if (suggest) {
        var box = editor.config.suggest = create_suggest(suggest);
        var boxobj = $$(box);
        if (boxobj && input) boxobj.linkInput(input);
    }
}

function create_suggest(config) {
    if (typeof config == "string") return config;
    if (config.linkInput) return config._settings.id;

    if (_typeof(config) == "object") {
      if (isArray(config)) config = {
        data: config
      };
      config.view = config.view || "suggest";
    } else if (config === true) config = {
      view: "suggest"
    };

    var obj = ui(config);
    return obj.config.id;
}

export const formatText = {
    parse: (text) =>  {
        return text
        // return webix.Number.formatNumber(text)
    },
    edit: (text) => {
        return webix.Number.formatNumber(text)
    }
};

export function extendWebix() {

    webix.editors.price = webix.extend({
        getValue: function () {
            let value = parseFloat(this.getInputNode(this.node).value.toString().replace(',', '.'))*100
            return value;
        },
        setValue: function (value) {
            var input = this.getInputNode(this.node);
            input.value = value/100;
            init_suggest(this, input);
        },
    }, webix.editors.text);

    webix.Number.formatNumber = function(value, config){
        if (!value && value !== 0) return '';
        value = value/100
        config = config || {
            groupDelimiter:" ",
            groupSize:3,
            decimalDelimiter:",",
            decimalSize:2,
            prefix: '',
            sufix: ' \u20BD'
        };
        if (value === "" || typeof value === "undefined") return value;
        value = parseFloat(value);
        var sign = value < 0 ? "-" : "";
        value = Math.abs(value);
        if (!config.decimalOptional) value = value.toFixed(config.decimalSize);
        var str = value.toString();
        str = str.split(".");
        var int_value = "";
    
        if (config.groupSize) {
            var step = config.groupSize;
            var i = str[0].length;
            do {
                i -= step;
                var chunk = i > 0 ? str[0].substr(i, step) : str[0].substr(0, step + i);
                int_value = chunk + (int_value ? config.groupDelimiter + int_value : "");
            } while (i > 0);
        } else int_value = str[0];
    
        if (config.decimalSize) str = sign + int_value + (str[1] ? config.decimalDelimiter + str[1] : "");
        else str = sign + int_value;
    
        if (config.prefix || config.sufix) {
            return config.prefix + str + config.sufix;
        } else return str;
    }

    webix.ui.datafilter.totalTable = webix.extend({
        refresh:function(master, node, value){
            node.firstChild.innerHTML = (!isNaN(master.data.order.length)) ? master.data.order.length : 0;
        }
    }, webix.ui.datafilter.summColumn);

    webix.ui.datafilter.totalTableLong = webix.extend({
        refresh:function(master, node, value){
            node.firstChild.innerHTML = "Всего в выборке: "
            node.firstChild.innerHTML += (!isNaN(master.data.order.length)) ? master.data.order.length : 0;
        }
    }, webix.ui.datafilter.summColumn);

    webix.ui.datafilter.totalVisibleColumn = webix.extend({
        refresh:function(master, node, value){
            let data = master.data.pull;
            var result = 0;
            for (var c in data) {
                let v = +data[c][value.columnId];
                if (!isNaN(v)) result+=v;
            }
            node.firstChild.innerHTML = webix.Number.formatNumber(result);
        }
    }, webix.ui.datafilter.summColumn);

    webix.ui.datafilter.totalColumn = webix.extend({
        refresh:function(master, node, value){
            var result = 0;
            master.mapCells(null, value.columnId, null, 1, function(value){
                let v = +value
                if (!isNaN(v))
                result+=v;
                return value;
            });
            //node.firstChild.innerHTML = formatNumber(result/100);
            node.firstChild.innerHTML = webix.Number.formatNumber(result);
        }
    }, webix.ui.datafilter.summColumn);

    webix.protoUI({
        name: "cWindow",
        defaults: {
            resize: !true,
            modal: false,
            move: !true,
            position: "center"
            },
        $init: function(config){
            webix.extend(config, {
                head: {
                    view: "toolbar",
                    cols: [
                        {view: "label", label: ""},
                        {view: "button",
                            type: "icon",
                            icon: "mdi-close",
                            // css: "times warning",
                            height: 26,
                            width:26,
                            on: {
                                onItemClick: function () {
                                    this.getTopParentView().hide();
                                },
                            },
                        },
                    ]
                }
            })
        }
    }, webix.ui.window);


}