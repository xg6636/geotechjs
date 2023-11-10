// utilities
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2022/08/02 10:08:21f
// last modified at 2023-11-10 15:51:12
//
// copyright (c) 2022 - 2023 Jack Hsu



function getFormData(formId) {
    const f = new FormData(document.getElementById(formId));
    let d = {};
    for (const [k, v] of f) {
        let e = k.replaceAll("-", "_");
        if (d[e] == undefined) {
            d[e] = v;
        } else if (Array.isArray(d[e])) {
            d[e].push(v);
        } else {
            d[e] = [d[e]];
            d[e].push(v);
        }
    }
    return d;
}

function createFormObjectByItemId(formName) {
    // Caution: out’s property value is string!
    let out = {};
    let frm = document.forms[formName];
    for (i = 0; i < frm.length; i++) {
        out[frm[i].id] = frm[i].value;
    }
    return out;
}
