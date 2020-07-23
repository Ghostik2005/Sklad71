"use strict";

// import {JetView} from "webix-jet";
import {message} from "../views/common";
import {request, checkResponse, getUser} from "../views/common";


export function filtersGetData(params, widget) {
    let docType;
    if (widget.$scope && widget.$scope.parent && widget.$scope.parent.doc_type) {
        if (widget.$scope.parent.doc_type == "Отгрузка") {
            docType = "shipment"
        } else if (widget.$scope.parent.doc_type == "Приходная накладная") {
            docType = "arrival"
        }
    }
    let params_to = {method:"get_filter_list", kwargs: {"user": getUser(), filterName: widget.config.parentName, docType: docType}}
    let result =  request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data
    })
    return result
}


export function refGetFilters(params, widget) {
    // console.log('user', getUser());
    let cfg = widget.$scope.cfg;
    let params_to = {method:"get_ref_filters", kwargs: {"user": getUser(), reference: cfg.reference, field: cfg.name}}
    let result =  request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data
    })
    return result
}

export function productGetFilters(params, widget) {
        let params_to = {method:"get_product_filters", kwargs: {"user": getUser(), filterName: widget.config.parentName}}
        let result =  request(params_to).then(function(data) {
            data = checkResponse(data, 'a');
            return data
        })
        return result
}

export function saveShipmentsDocument(data, intable_id) {
    let params_to = {method:"shipments.save_shipments_document", 
                    kwargs: {user: getUser(), "doc_data": data, "intable": intable_id}
                    }
    let result = checkResponse(request(params_to, !0).response, 's');
    return result    
}


export function getShipmentsDocument(doc_id){
    let params_to = {method:"shipments.get_shipments_document", kwargs: {"user": getUser(), "doc_id": doc_id}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
    // return {}
}

export function saveOrdersDocument(data, intable_id) {
    let params_to = {method:"arrivals.save_arrivals_document", 
                    kwargs: {user: getUser(), "doc_data": data, "intable": intable_id}
                    }
    let result = checkResponse(request(params_to, !0).response, 's');
    return result    
}

export function getOrdersDocument(doc_id){
    let params_to = {method:"orders.get_orders_document", kwargs: {"user": getUser(), "doc_id": doc_id}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
    // return {}
}

export function getOrdersDocumentShip(doc_id){
    let params_to = {method:"orders.get_orders_document_for_shipment", kwargs: {"user": getUser(), "doc_id": doc_id}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
    // return {}
}

export function saveArrivalsDocument(data, intable_id) {
    let params_to = {method:"arrivals.save_arrivals_document", 
                    kwargs: {user: getUser(), "doc_data": data, "intable": intable_id}
                    }
    let result = checkResponse(request(params_to, !0).response, 's');
    return result    
}

export function getArrivalsDocument(doc_id){
    let params_to = {method:"arrivals.get_arrivals_document", kwargs: {"user": getUser(), "doc_id": doc_id}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
    // return {}
}

export function setPartner(data) {
    let params_to = {method:"save_partner",
        kwargs: {user: getUser(), "doc_data": data,},
    };
    let result = checkResponse(request(params_to, !0).response, 's');
    return result   
}

export function getPartner(p_id) {

    let params_to = {method:"get_partner", kwargs: {"user": getUser(), p_id: p_id}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}

export function setPoint(data) {
    let params_to = {method:"save_point",
        kwargs: {user: getUser(), "doc_data": data,},
    };
    let result = checkResponse(request(params_to, !0).response, 's');
    return result   
}

export function getPoint(p_id) {

    let params_to = {method:"get_point", kwargs: {"user": getUser(), p_id: p_id}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}


export function setRef(data, reference) {
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



export function getRef(p_id, reference) {

    let params_to = {method:"get_ref_element", kwargs: {"user": getUser(), p_id: p_id, reference: reference}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}


export function setProduct(data) {
    let params_to = {method:"save_product_card", 
                    kwargs: {user: getUser(), "doc_data": data},
    };
    let result = checkResponse(request(params_to, !0).response, 's');
    return result   
}

export function getProduct(p_id) {

    let params_to = {method:"get_product", kwargs: {"user": getUser(), p_id: p_id}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}

export function getBalances(ids) {
    let params_to = {method:"balance.get_products", kwargs: {"user": getUser(), ids: ids}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result    
}

export function getPositionProducts(prod_id, table) {
    let filters = {production_id: prod_id, sort: table.config.sorting}
    let params_to = {method:"get_products_index", kwargs: {"user": getUser(), filters: filters}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}

export function setCharge(data) {
    console.log('data');
    let params_to = {method:"balance.set_charge_to_price", kwargs: {"user": getUser(), data: data}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result    
}

export function getCredentionals(user) {

    let params_to = {method:"get_credentionals", kwargs: {"user": user}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}

export function getLogin(u_name, pwd) {
    let params_to = {method:"get_login", kwargs: {"user": u_name, "pwd": pwd}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}

export function getId() {
    let params_to = {method:"get_new_id", kwargs: {"user": getUser()}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return result
}

export function checkCode(code) {
    let params_to = {method:"check_prod_code", kwargs: {"user": getUser(), "code": code}}
    let result = checkResponse(request(params_to, !0).response, 's');
    return (result && result.data && result.data===true) ? true : false;
    // return result
}

export function createPrice(params) {
    let params_to = {method:"create_price", kwargs: {"user": getUser(), filters: params}}
    return request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data    
    })
}

export function getTest(params) {
    console.log('test_params', params);
    // let params_to = {method:"create_order", kwargs: {"user": getUser(), filters: params}}
    let params_to = {method:"create_price", kwargs: {"user": getUser(), filters: params}}
    return request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data    
    })
}

export function checkOpened(doc_id, remove = false) {
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


///////////
export function refGetData(params, table) {
    let filters = {n_name: table.cfg.topParent.getFilter(), reference: table.cfg.name};
    if (!params) {
        params = {sort:$$(table.cfg.id).config.sorting};
    }
    params = Object.assign(params, {filters: filters});
    $$(table.cfg.id).config.sorting = params.sort;
    let params_to = {method:"get_reference", kwargs: {"user": getUser(), filters: params}}
    return request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data    
    })
}

export function productSelectionGetData(params, table) {
    // let widgs = table.$scope.app.commonWidgets;
    let filters = {c_name: table.cfg.topParent.getFilter()};
    // let filters = {c_name: table.$scope.getFilter()}; //получаем значение из filter-элементе
    if (!params) {
        params = {sort:table.config.sorting};
    }
    params = Object.assign(params, {filters: filters});
    table.config.sorting = params.sort;
    let params_to = {method:"get_products", kwargs: {"user": getUser(), filters: params}}
    return request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data    
    })
}

export function shipmentProductSelectionGetData(params, table) {
    // let widgs = table.$scope.app.commonWidgets;
    let filters = {n_product: table.$scope.getFilter()}; //получаем значение из filter-элементе
    if (!params) {
        params = {sort:table.config.sorting};
    }
    params = Object.assign(params, {filters: filters});
    table.config.sorting = params.sort;
    let params_to = {method:"balance.get_data", kwargs: {"user": getUser(), filters: params}}
    return request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data    
    })
}



export function balanceGetData(params, table) {
    let widgs = table.$scope.app.commonWidgets;
    let filters = (widgs && widgs.balance.menu_filters) ? widgs.balance.menu_filters.getFilters() : {};
    if (!params) {
        params = {sort:table.config.sorting};
    };
    filters = Object.assign(filters, (widgs.balance.header) ? widgs.balance.header.getSearch(): {})
    params = Object.assign(params, {filters: filters});
    table.config.sorting = params.sort;
    let params_to = {method:"balance.get_data", kwargs: {"user": getUser(), filters: params}}
    return request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data    
    })
}


export function shipmentsGetData(params, table) {
    let widgs = table.$scope.app.commonWidgets;
    let filters = (widgs && widgs.shipments.menu_filters) ? widgs.shipments.menu_filters.getFilters() : {};
    if (!params) {
        params = {sort:table.config.sorting};
    }
    params = Object.assign(params, {filters: filters});
    table.config.sorting = params.sort;
    let params_to = {method:"shipments.get_data", kwargs: {"user": getUser(), filters: params}}
    return request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data    
    })
}

export function ordersGetData(params, table) {
    let widgs = table.$scope.app.commonWidgets;
    let filters = (widgs && widgs.orders.menu_filters) ? widgs.orders.menu_filters.getFilters() : {};
    if (!params) {
        params = {sort:table.config.sorting};
    }
    params = Object.assign(params, {filters: filters});
    table.config.sorting = params.sort;
    let params_to = {method:"orders.get_data", kwargs: {"user": getUser(), filters: params}}
    return request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data    
    })
}

export function ordersSaveData(id, action, row) {
    console.log('id', id);
    console.log('action', action);
    console.log('row', row);

    return true

}



export function arrivalsGetData(params, table) {
    let widgs = table.$scope.app.commonWidgets;
    let filters = (widgs && widgs.arrivals.menu_filters) ? widgs.arrivals.menu_filters.getFilters() : {};
    if (!params) {
        params = {sort:table.config.sorting};
    }
    params = Object.assign(params, {filters: filters});
    table.config.sorting = params.sort;
    let params_to = {method:"arrivals.get_data", kwargs: {"user": getUser(), filters: params}}
    return request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data    
    })
}

export function arrivalsSaveData(id, action, row) {
    console.log('id', id);
    console.log('action', action);
    console.log('row', row);

    return true

}

export function getMovingsDocument(doc_id){
    let params_to = {method:"arrivals.get_arrivals_document", kwargs: {"user": getUser(), "doc_id": doc_id}}
    let result = checkResponse(request(params_to, !0).response, 's');

    return result    
}

export function movingsGetData(params, table) {
    // table.clearAll();
    let widgs = table.$scope.app.commonWidgets;
    let filters = (widgs && widgs.menu_filters) ? widgs.menu_filters.getFilters() 
                                                : {};
    if (!params) {
        params = {sort:table.config.sorting};
    }
    params = Object.assign(params, {filters: filters});
    let params_to = {method:"arrivals.get_data", kwargs: {"user": getUser(), filters: params}}
    let result =  request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data
    })
    table.config.sorting = params.sort
    return result
}

export function movingsSaveData(id, action, row) {
    console.log('id', id);
    console.log('action', action);
    console.log('row', row);

    return true

}

export function getTransfersDocument(doc_id){
    let params_to = {method:"arrivals.get_arrivals_document", kwargs: {"user": getUser(), "doc_id": doc_id}}
    let result = checkResponse(request(params_to, !0).response, 's');

    return result    
}

export function transfersGetData(params, table) {
    // table.clearAll();
    let widgs = table.$scope.app.commonWidgets;
    let filters = (widgs && widgs.menu_filters) ? widgs.menu_filters.getFilters() 
                                                : {};
    if (!params) {
        params = {sort:table.config.sorting};
    }
    params = Object.assign(params, {filters: filters});
    let params_to = {method:"arrivals.get_data", kwargs: {"user": getUser(), filters: params}}
    let result =  request(params_to).then(function(data) {
        data = checkResponse(data, 'a');
        return data
    })
    table.config.sorting = params.sort
    return result
}

export function transfersSaveData(id, action, row) {
    console.log('id', id);
    console.log('action', action);
    console.log('row', row);

    return true

}

