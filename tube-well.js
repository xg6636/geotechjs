// 单井出水量
// lib003
// created at 2022/08/01 23:50:09
// last modified at 2023-11-07 22:51:10
// 
// copyright (c) 2022 - 2023 Jack Hsu



const tube_well = {
    get_max_capacity: function (a) {
        // param a: sample {filter_radius: 0.3, filter_length: 18, k: 18}
        var out = 120 * Math.PI;
        out = out * Number(a.filter_radius) * Number(a.filter_length);
        out = out * Math.pow(Number(a.k), 0.333333333);
        return { specific: "JGJ120-2012", value: out }
    },
    get_filter_length: function (a) {
        // param a: sample {well_capacity:1200, filter_diameter: 0.6, filter_ne: 0.4, k: 18}
        var v = Math.sqrt(Number(a.k)) / 15;
        var out = Number(a.well_capacity) / Math.PI;
        out = out / Number(a.filter_diameter) / Number(a.filter_ne) / v;
        return { specific: "工程地质手册（第五版）", value: out }
    }
}
