// 单井出水量
// lib003
// created at 2022/08/01 23:50:09
// last modified at 2022/08/06 13:00:50
// 
// copyright (c) 2022 Jack Hsu



const tubeWell = {
    getMaxCapacity: function (a) {
        // param a: sample {filterRadius: 0.3, filterLength: 18, k: 18}
        var out = 120 * Math.PI;
        out = out * Number(a.filterRadius) * Number(a.filterLength);
        out = out * Math.pow(Number(a.k), 0.333333333);
        return { specification: "JGJ120-2012", value: out }
    },
    getFilterLength: function (a) {
        // param a: sample {wellCapacity:1200, filterDiameter: 0.6, filterNe: 0.4, k: 18}
        var v = Math.sqrt(Number(a.k)) / 15;
        var out = Number(a.wellCapacity) / Math.PI;
        out = out / Number(a.filterDiameter) / Number(a.filterNe) / v;
        return { specification: "工程地质手册（第五版）", value: out }
    }
}
