// groundwater functions
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2022/08/01 23:50:09
// last modified at 2023-11-18 19:59:19
//
// copyright (c) 2022 - 2023 Jack Hsu



const groundwater = {
  seepage: {
    cite: ["JGJ120"],
    jgj120: {
      cite: "JGJ120-2012",
      formulaC01(a) {
        // param a: sample {d: 3, gamma: 18, hw: 5, gammaw: 9.8}
        return (
          (Number(a.d) * Number(a.gamma)) / Number(a.hw) / Number(a.gammaw)
        );
      },

      formulaC02(a) {
        // param a: sample {ld: 3, d1: 2, gamma1: 10, deltah: 5, gammaw: 9.8}
        let kf = 2 * Number(a.ld) + 0.8 * Number(a.d1);
        kf *= Number(a.gamma1);
        kf = kf / Number(a.deltah) / Number(a.gammaw);
        return kf;
      },
    },
  },

  tubeWell: {
    cite: ["JGJ120-2012", "工程地质手册（第五版）"],
    getMaxCapacity(filterRadius, filterLength, k) {
      let o = 120 * Math.PI;
      o *= Number(filterRadius) * Number(filterLength);
      o *= Math.pow(Number(k), 0.333333333);
      return {
        cite: [["JGJ120-2012", "公式7.3.16"], ["工程地质手册（第五版）", "公式9-5-14"]],
        value: o,
        displayValue: `单井出水能力:${o.toFixed(3)}m3/d[${(o / 24.0).toFixed(3)}m3/h]`,
      };
    },

    getFilterLength(a) {
      // param a: sample {well_capacity:1200, filter_diameter: 0.3, filter_ne: 0.4, k: 18}
      let k = Number(a.k) / 24 / 3600;
      let v = Math.sqrt(k) / 15;
      let q = Number(a.well_capacity) / 24 / 3600;
      o = q / Math.PI / Number(a.filter_diameter) / Number(a.filter_ne) / v;
      return {
        cite: "工程地质手册（第五版）,公式9-5-7",
        value: o,
        displayValue: `过滤器长度: ${o.toFixed(3)}m`,
      };
    },
  },
};
