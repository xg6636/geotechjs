// groundwater functions
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2022/08/01 23:50:09
// last modified at 2023-11-29 13:16:36
//
// copyright (c) 2022 - 2023 Jack Hsu



const groundwater = (function () {
  const _jgj1202012 = {
    formulaC01: function (a) {
      // param a: sample {d: 3, gamma: 18, hw: 5, gammaw: 9.8}
      return (Number(a.d) * Number(a.gamma)) / Number(a.hw) / Number(a.gammaw);
    },
    formulaC02: function (a) {
      // param a: sample {ld: 3, d1: 2, gamma1: 10, deltah: 5, gammaw: 9.8}
      let kf = 2 * Number(a.ld) + 0.8 * Number(a.d1);
      kf *= Number(a.gamma1);
      kf = kf / Number(a.deltah) / Number(a.gammaw);
      return kf;
    },
    formulaE04: function (pitArea, objectAquifer, level0, level1, filterLength) {
      let o = { cite: "JGJ120-2012", };
      o.A = Number(pitArea);
      o.sd = Number(level0) - Number(level1);
      o.l = Number(filterLength);
      o.k = objectAquifer.k;
      o.M = objectAquifer.topElevation - objectAquifer.bottomElevation;
      o.R = objectAquifer.influenceRadius;
      o.r0 = Math.sqrt(o.A / Math.PI);
      o.Q = 2 * Math.PI * o.k * o.M * o.sd;
      o.Q /= Math.log(1 + o.R / o.r0) + (o.M - o.l) / o.l * Math.log(1 + 0.2 * o.M / o.r0);
      o.value = o.Q;
      o.displayValue = `Q=${o.value.toFixed(3)}m3/d，
                    r0=${o.r0.toFixed(3)}m`;
      return o;
    },

    formulaE05: function (pitArea, objectAquifer, level0, level1) {
      let l0 = Number(level0);
      let l1 = Number(level1);
      let be = objectAquifer.bottomElevation;
      let o = { cite: "JGJ120-2012", };
      o.A = Number(pitArea);
      o.k = objectAquifer.k;
      o.H0 = l0 - be
      o.h = l1 - be;
      o.M = objectAquifer.topElevation - be;
      o.r0 = Math.sqrt(o.A / Math.PI);
      o.Q = Math.PI * o.k;
      o.Q *= (2 * o.H0 - o.M) * o.M - o.h ** 2;
      o.Q /= Math.log(1 + objectAquifer.influenceRadius / o.r0);
      o.value = o.Q;
      o.displayValue = `Q=${o.value.toFixed(3)}m3/d，
                    r0=${o.r0.toFixed(3)}m`;
      return o;
    },
  };

  const _tubeWell = {
    getMaxCapacity: function (filterRadius, filterLength, k) {
      let o = 120 * Math.PI;
      o *= Number(filterRadius) * Number(filterLength);
      o *= Math.pow(Number(k), 0.333333333);
      return {
        cite: [["JGJ120-2012", "公式7.3.16"], ["工程地质手册（第五版）", "公式9-5-14"]],
        value: o,
        displayValue: `单井出水能力:${o.toFixed(3)}m3/d[${(o / 24.0).toFixed(3)}m3/h]`,
      };
    },
    getFilterLength: function (a) {
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
  };

  const _obj = {
    aquifer: function (topElev, bottomElev, k, influRadius) {
      return {
        topElevation: Number(topElev),
        bottomElevation: Number(bottomElev),
        k: Number(k),
        influenceRadius: influRadius ? Number(influRadius) : 0,
      };
    },
  };

  const _db42t8302012 = {
    formula13: function (pitArea, objectAquifer, level0, level1) {
      let l0 = Number(level0);
      let l1 = Number(level1);
      let o = { cite: "DB42/T830-2012", };
      o.F = Number(pitArea);
      o.K = objectAquifer.k;
      o.H = l0 - objectAquifer.bottomElevation;
      o.S = l0 - l1;
      o.L = objectAquifer.topElevation - l1;
      o.r0 = 0.565 * Math.sqrt(o.F);
      o.K0 = (o.S + 0.8 * o.L) * o.K / o.H;
      o.Q = 2 * Math.PI * o.K0 * o.S * o.r0;
      o.value = o.Q;
      o.displayValue = `Q=${o.value.toFixed(3)}m3/d，
                      K0=${o.K0.toFixed(3)}m/d，r0=${o.r0.toFixed(3)}m`;
      return o;
    },
  };

  return {
    cite: ["JGJ120-2012", "DB42/T830-2012", "工程地质手册（第五版）"],
    aquifer: _obj.aquifer,
    seepage: {
      jgj1202012FormulaC01: _jgj1202012.formulaC01,
      jgj1202012FormulaC02: _jgj1202012.formulaC02,
    },
    tubeWell: {
      getMaxCapacity: _tubeWell.getMaxCapacity,
      getFilterLength: _tubeWell.getFilterLength,
    },
    bigWellMethod: {
      db42t8302012Formula13: _db42t8302012.formula13,
      jgj1202012FormulaE04: _jgj1202012.formulaE04,
      jgj1202012FormulaE05: _jgj1202012.formulaE05,
    },
  };
})();
