// groundwater functions
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2022/08/01 23:50:09
// last modified at 2023-11-09 11:49:01
// 
// copyright (c) 2022 - 2023 Jack Hsu



const groundwater = {
    seepage: {
        basises: ["JGJ120"],
        jgj120: {
            basis: "JGJ120-2012",
            formulaC01(a) {
                // param a: sample {d: 3, gamma: 18, hw: 5, gammaw: 9.8}
                let kh = Number(a.d) * Number(a.gamma);
                kh = kh / Number(a.hw) / Number(a.gammaw);
                return kh
            },
            formulaC02(a) {
                // param a: sample {ld: 3, d1: 2, gamma1: 10, deltah: 5, gammaw: 9.8}
                let kf = 2 * Number(a.ld) + 0.8 * Number(a.d1);
                kf *= Number(a.gamma1);
                kf = kf / Number(a.deltah) / Number(a.gammaw);
                return kf
            }
        }
    },
    tubeWell: {
        basises: ["JGJ120-2012", "工程地质手册（第五版）"],
        getMaxCapacity(a) {
            // param a: sample {filter_radius: 0.3, filter_length: 18, k: 18}
            let out = 120 * Math.PI;
            out = out * Number(a.filter_radius) * Number(a.filter_length);
            out = out * Math.pow(Number(a.k), 0.333333333);
            return { basis: "JGJ120-2012", value: out }
        },
        getFilterLength(a) {
            // param a: sample {well_capacity:1200, filter_diameter: 0.6, filter_ne: 0.4, k: 18}
            let v = Math.sqrt(Number(a.k)) / 15;
            let out = Number(a.well_capacity) / Math.PI;
            out = out / Number(a.filter_diameter) / Number(a.filter_ne) / v;
            return { basis: "工程地质手册（第五版）", value: out }
        }
    }

};