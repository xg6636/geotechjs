// utilities
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2022/08/02 10:08:21
// last modified at 2023-11-17 20:00:49
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

function radianToDegree(x) {
    return (x * 180.0) / Math.PI;
}

function degreeToRadian(x) {
    return (x * Math.PI) / 180.0;
}

function normalizeGuidelineNumber(x, defaultNumber) {
    let gn = x ?? defaultNumber;
    gn = gn.toString().toLowerCase();
    gn = gn.replace("-", "");
    gn = gn.replace("/", "");  
    
    return gn;
}