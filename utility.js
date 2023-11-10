// utilities
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2022/08/02 10:08:21f
// last modified at 2023-11-10 15:28:05
//
// copyright (c) 2022 - 2023 Jack Hsu

function getFormData(formId) {
    let f = document.getElementById(formId);
    let out = {};
    let e;
    let et;
    for (let i = 0; i < f.length; i++) {
        if (f[i].name != "" && f[i].disabled == false) {
            e = f[i].name.replaceAll("-", "_");
            et = f[i].type.toLowerCase();
            switch (et) {
                case "checkbox":
                    if (out[e] == undefined) {
                        out[e] = [];
                    }
                    if (f[i].checked) {
                        out[e].push(f[i].value);
                    }
                    break;
                case "radio":
                    if (f[i].checked) {
                        out[e] = f[i].value;
                    }
                    break;
                default:
                    out[e] = f[i].value;
            }
        }
    }
    return out;
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
