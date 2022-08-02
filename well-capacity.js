// 单井出水量
// lib003
// created at 2022/08/01 23:50:09
// last modified at 2022/08/02 11:30:06
// 
// copyright (c) 2022 Jack Hsu <120522448@qq.com>



var wellJGJ120 = {
    specific: "jgj120-2012",
    getMaxCapacity: function (a) {
        // param a: sample {filterRadius: 0.3, filterLength: 18, k: 18}
        var aux = 120 * Math.PI;
        aux = aux * Number(a.filterRadius) * Number(a.filterLength);
        aux = aux * Math.pow(Number(a.k), 0.333333333)
        return aux
    }
}