// 单井出水量
// lib003
// created at 2022/08/01 23:50:09
// last modified at 17:06 2023/11/8
// 
// copyright (c) 2022 - 2023 Jack Hsu



const tubeWell = {
	specific: ["JGJ120-2012","工程地质手册（第五版）"],
    getMaxCapacity(a) {
        // param a: sample {filter_radius: 0.3, filter_length: 18, k: 18}
        let out = 120 * Math.PI;
        out = out * Number(a.filter_radius) * Number(a.filter_length);
        out = out * Math.pow(Number(a.k), 0.333333333);
        return { specific: "JGJ120-2012", value: out };
    },
    getFilterLength(a) {
        // param a: sample {well_capacity:1200, filter_diameter: 0.6, filter_ne: 0.4, k: 18}
        let v = Math.sqrt(Number(a.k)) / 15;
        let out = Number(a.well_capacity) / Math.PI;
        out = out / Number(a.filter_diameter) / Number(a.filter_ne) / v;
        return { specific: "工程地质手册（第五版）", value: out };
    }
}
