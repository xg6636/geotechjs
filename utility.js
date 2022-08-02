// utilities
// lib004
// created at 2022/08/02 10:08:21
// last modified at 2022/08/02 10:09:23
// 
// copyright (c) 2022 Jack Hsu <120522448@qq.com>



function createFormObjectByItemName(formName) {
    // Caution: out’s property value is string!!!
    var out = new Object();
    var frm = document.forms[formName];
    for (i = 0; i < frm.length; i++) {
        out[frm[i].name] = frm[i].value;
    }
    return out;
}

function createFormObjectByItemId(formName) {
    // Caution: out’s property value is string!!!
    var out = new Object();
    var frm = document.forms[formName];
    for (i = 0; i < frm.length; i++) {
        out[frm[i].id] = frm[i].value;
    }
    return out;
}