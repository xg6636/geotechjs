// utilities
// lib004
// created at 2022/08/02 10:08:21f
// last modified at 2023-11-07 22:52:04
// 
// copyright (c) 2022 - 2023 Jack Hsu



function get_form_data(form_id) {
    var f = document.getElementById(form_id);
    var out = {};
    var e;
    for (i = 0; i < f.length; i++) {
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
    // Caution: out’s property value is string!!!
    var out = new Object();
    var frm = document.forms[formName];
    for (i = 0; i < frm.length; i++) {
        out[frm[i].id] = frm[i].value;
    }
    return out;
}

