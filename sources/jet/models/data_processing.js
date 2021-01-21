"use strict";

import {request, checkResponse, getUser} from "../views/common";

export function filtering(obj, value){
    return obj['value'].toString().toLowerCase().indexOf(value) != -1
  }

export function gen_number(doc_type) {
    let params_to = {method:"gen_doc_number", kwargs: {"user": getUser(), "doc_type": doc_type}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}

export function set_limit(row_id, new_val) {
    let params_to = {method:"set_point_limit", kwargs: {"user": getUser(), "n_limit": new_val, "row_id": row_id}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}

export const report_processing = {

    new_report: function(doc_type, doc_number) {
        let params_to = {method:"generate_report.generate",
                         kwargs: {"user": getUser(), "doc_type": doc_type, "doc_number": doc_number}
                        }
        let result = checkResponse(request(params_to, !0).response, 's');
        if (result.data && result.data.link) {
            window.open(result.data.link, "_blank");
        } else {
            if (result.data && result.data.binary && result.data.file_name) {
                var blob = new Blob([_base64ToArrayBuffer(result.data.binary)]);
                webix.html.download(blob, result.data.file_name);
            }
        }
        // return (result && result.data && result.data===true) ? true : false;
    }

}

export const checks = {

    code: function (code) {
        let params_to = {method:"check_prod_code", kwargs: {"user": getUser(), "code": code}}
        let result = checkResponse(request(params_to, !0).response, 's');
        return (result && result.data && result.data===true) ? true : false;
    },

    opened: function (doc_id, remove = false) {
        let docs = localStorage.getItem('opened');
        let items = new Set;
        if (!remove) {
            if (docs) {
                items = new Set(docs.split(';'));
                if (items.has(doc_id)) return false;
            }
            items.add(doc_id);
        } else {
            if (docs) {
                items = new Set(docs.split(';'));
                items.delete(doc_id)
            }
        }
        items = Array.from(items)
        items = items.join(';')
        localStorage.setItem('opened', items)
        return true
    }

}

export const balance_processing = {

    get_all: function(ids) {
        let params_to = {method:`balances.get_products`, kwargs: {"user": getUser(), ids: ids}}
        let result = checkResponse(request(params_to, !0).response, 's');
        return result
    },

    set_charge: function (data) {
        let params_to = {method:"balances.set_charge_to_price", kwargs: {"user": getUser(), data: data}}
        let result = checkResponse(request(params_to, !0).response, 's');
        return result
    },

    get_data: function(params, table) {
        // console.log('---------------------')
        let filters = {n_product: table.$scope.getFilter()}; //получаем значение из filter-элементе
        // console.log('ids', table.$scope);
        let kwargs = genKwargs(params, table, "", filters);
        table.config.sorting = kwargs.filters.sort;
        let params_to = {method:"balances.get_data", kwargs: kwargs};
        return request(params_to).then(function(data) {
            data = checkResponse(data, 'a');
            return data
        })
    }

}

export const filters_process = {

    get_data: function(params, widget) {
        let docType;
        // console.log(widget)
        if (widget.$scope && widget.$scope.parent && widget.$scope.parent.doc_type) {
            // console.log(widget.$scope.parent.doc_type)
            if (widget.$scope.parent.doc_type == "Отгрузка") {
                docType = "shipment"
            } else if (widget.$scope.parent.doc_type == "Приходная накладная") {
                docType = "arrival"
            } else if (widget.$scope.parent.doc_type == "Перемещение") {
                docType = "movement"
            } else if (widget.$scope.parent.doc_type == "Заказ покупателя") {
                docType = "order"
            }
        } else if (widget.config && widget.config.ordersFg) {
            docType = "order"
        }
        let params_to = {method:"get_filter_list", kwargs: {"user": getUser(), filterName: widget.config.parentName, docType: docType}}
        let result =  request(params_to).then(function(data) {
            data = checkResponse(data, 'a');
            return data
        })
        return result
    },

    get_ref_filters: function(params, widget) {
        let cfg = widget.$scope.cfg;
        let params_to = {method:"get_ref_filters", kwargs: {"user": getUser(), reference: cfg.reference, field: cfg.name}}
        let result =  request(params_to).then(function(data) {
            data = checkResponse(data, 'a');
            return data
        })
        return result
    },

    get_prod_filters: function(params, widget) {
        let params_to = {method:"get_product_filters", kwargs: {"user": getUser(), filterName: widget.config.parentName}}
        let result =  request(params_to).then(function(data) {
            data = checkResponse(data, 'a');
            return data
        })
        return result
    }

}

export const refSingle = {

    get: function(p_id, p_type) {
        let params_to = {method:`get_${p_type}`, kwargs: {"user": getUser(), p_id: p_id}}
        let result = checkResponse(request(params_to, !0).response, 's');
        return result
    },

    save: function(data, p_type) {
        let params_to = {method:`save_${p_type}`,
                        kwargs: {user: getUser(), "doc_data": data},
        };
        let result = checkResponse(request(params_to, !0).response, 's');
        return result
    },
}


export const reference = {

    checkmark: function(params) {
        let method;
        if (params.table == "_products_") {
            method = "products_checkmark";
        } else {
        }
        if (method) {
            let params_to = {method: method, kwargs: {"user": getUser(),
                item_id: params.item_id, item_code: params.item_code,
                field: params.field, value: params.value
            }}
            let result = checkResponse(request(params_to, !0).response, 's');
            return result
        } else {
            return {}
        }
    },

    get: function(p_id, reference) {
        let params_to = {method:"get_ref_element", kwargs: {"user": getUser(), p_id: p_id, reference: reference}}
        let result = checkResponse(request(params_to, !0).response, 's');
        return result
    },

    set: function(data, reference) {
        let params_to = {method:"save_ref_element",
            kwargs: {user: getUser(), "doc_data": data, reference: reference},
        };
        let result = checkResponse(request(params_to, !0).response, 's');
        if (result.data[0].hasOwnProperty('n_type_name')) {
            result.data[0].n_type = result.data[0].n_type_name;
        } else if (result.data[0].hasOwnProperty('c_cat_name')) {
            result.data[0].c_cat = result.data[0].c_cat_name;
        } else if (result.data[0].hasOwnProperty('c_dir_name')) {
            result.data[0].c_dir = result.data[0].c_dir_name;
        } else if (result.data[0].hasOwnProperty('c_parent_name')) {
            result.data[0].c_parent = result.data[0].c_parent_name;
        }
        return result
    }
}

export const getDatas = {

    ref_data: function(params, table) {
        let filters = {n_name: table.$scope.cfg.topParent.getFilter(), reference: table.$scope.cfg.name};
        if (!params) {
            params = {sort:$$(table.$scope.cfg.id).config.sorting};
        }
        params = Object.assign(params, {filters: filters});
        $$(table.$scope.cfg.id).config.sorting = params.sort;
        let params_to = {method:"get_reference", kwargs: {"user": getUser(), filters: params}}
        return request(params_to).then(function(data) {
            data = checkResponse(data, 'a');
            return data
        })
    },

    product_data: function(params, table) {
        let filters = {c_name: table.$scope.cfg.topParent.getFilter()};
        let kwargs = genKwargs(params, table, "", filters);
        table.config.sorting = kwargs.filters.sort;
        let params_to = {method:"get_products", kwargs: kwargs};
        return request(params_to).then(function(data) {
            data = checkResponse(data, 'a');
            return data
        })
    },

    credentionals: function(user) {
        let params_to = {method:"get_credentionals", kwargs: {"user": user}}
        let res = request(params_to, !0).response;
        let result = checkResponse(res, 's');
        return result
    },

    new_id: function() {
        let params_to = {method:"get_new_id", kwargs: {"user": getUser()}}
        let result = checkResponse(request(params_to, !0).response, 's');
        return result
    },

    login: function(u_name, pwd) {
        let params_to = {method:"get_login", kwargs: {"user": u_name, "pwd": pwd}}
        let result = checkResponse(request(params_to, !0).response, 's');
        return result
    },

    getAllData: function(params, table) {
        let parent =  this.parent.view_name;
        let kwargs = genKwargs(params, table, parent)
        table.config.sorting = kwargs.filters.sort;
        let params_to = {method: `${parent}.get_data`, kwargs: kwargs}
        return request(params_to).then(function(data) {
            data = checkResponse(data, 'a');
            return data
        })
    },
}


export const documentProcessing = {

    save: function(data, intable_id, doc_type) {
        let params_to = {method:`${doc_type}.save_${doc_type}_document`,
                        kwargs: {user: getUser(), "doc_data": data, "intable": intable_id}
                        }
        let result = checkResponse(request(params_to, !0).response, 's');
        return result
    },

    get: function (doc_id, doc_type){
        let params_to = {method: `${doc_type}.get_${doc_type}_document`, kwargs: {"user": getUser(), "doc_id": doc_id}}
        let result = checkResponse(request(params_to, !0).response, 's');
        return result
    },

    get_on_order: function(doc_id){
        let params_to = {method:"orders.get_orders_document_for_shipment", kwargs: {"user": getUser(), "doc_id": doc_id}}
        let result = checkResponse(request(params_to, !0).response, 's');
        return result
        // return {}
    },


}

export function isEmpty(obj) {
    for (let key in obj) {
      // если тело цикла начнет выполняться - значит в объекте есть свойства
      return false;
    }
    return true;
  }


export function createPrice(params) {
    let params_to = {method:"create_price", kwargs: {"user": getUser(), filters: params}}
    return request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data
    })
}


function genKwargs(params, table, data_type, filters) {
    // console.log('params', params);
    // console.log('table', table);
    // console.log('data_type', data_type);
    let app = table.$scope.app;
    // let sb = table.$scope.app.commonWidgets[data_type];
    // console.log('sb', sb);
    let new_params = JSON.parse(JSON.stringify(params))
    if (!filters) {
        let widgs = app.commonWidgets;
        if (data_type == 'balances') {
            filters = widgs[data_type].header.getSearch();
        } else {
            filters = (widgs && widgs[data_type].menu_filters) ? widgs[data_type].menu_filters.getFilters() : {};
        }

    }
    if (new_params && !new_params.sort) {
        Object.assign(new_params, {sort:table.config.sorting});
    };
    if (!new_params) {
        new_params = {sort:table.config.sorting};
    }
    new_params = Object.assign(new_params, {filters: filters});
    return {"user": getUser(), filters: new_params}
}

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}