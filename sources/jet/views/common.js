"use strict";

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
        // console.log('gg1', new Date())
        ret = 'undefined'
        // ret = names_translates[method];
    }
    return ret
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
    // console.log('f_req');
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

export const formatText = {
    parse: (text) =>  {
        return text
        // return webix.Number.formatNumber(text)
    },
    edit: (text) => {
        return webix.Number.formatNumber(text)
    }
};
