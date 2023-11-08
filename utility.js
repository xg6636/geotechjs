// utilities
// lib004
// created at 2022/08/02 10:08:21f
// last modified at 2023-11-08 17:50:49
// 
// copyright (c) 2022 - 2023 Jack Hsu



function getFormData(formId) {
    let f = document.getElementById(formId);
    let out = {};
    let e;
    for (let i = 0; i < f.length; i++) {
        if (f[i].name != '' && f[i].disabled == false) {
            e = f[i].name.replaceAll("-", "_");
            switch (f[i].type.toLowerCase()) {
                case 'checkbox':
                    if (out[e] == undefined) {
                        out[e] = [];
                    }
                    if (f[i].checked) {
                        out[e].push(f[i].value);
                    }
                    break;
                case 'radio':
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
