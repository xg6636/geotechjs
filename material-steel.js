// 钢材强度
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2023-11-03 14:39:51
// last modified at 2023-11-12 16:46:13
//
// copyright (c) 2023 Jack Hsu



const materialSteel = (function () {
  const _gb500172017Data = {
    name: "GB50017-2017",
    q235: {
      t16: [215, 125, 320, 235, 370],
      t40: [205, 120, 320, 225, 370],
      t100: [200, 115, 320, 215, 370],
      ts: [16, 40, 100],
    },

    q345: {
      t16: [305, 175, 400, 345, 470],
      t40: [295, 170, 400, 335, 470],
      t63: [290, 165, 400, 325, 470],
      t80: [280, 160, 400, 315, 470],
      t100: [270, 155, 400, 305, 470],
      ts: [16, 40, 63, 80, 100],
    },

    q355: {
      t16: [305, 175, 400, 345, 470],
      t40: [295, 170, 400, 335, 470],
      t63: [290, 165, 400, 325, 470],
      t80: [280, 160, 400, 315, 470],
      t100: [270, 155, 400, 305, 470],
      ts: [16, 40, 63, 80, 100],
    },
  };

  let _outJSON = function (a) {
    return { f: a[0], fv: a[1], fce: a[2], fy: a[3], fu: a[4] };
  };

  let _lookup = function (kind, th, guidelineData) {
    kind = kind.toLowerCase();
    th = Number(th);
    const gd = guidelineData ?? _gb500172017Data;
    const v = gd[kind];
    if (v == undefined) {
      return undefined;
    } else {
      const ts = v.ts;
      const a = Math.round(th);
      let c = ts.filter((x) => x >= a);
      if (c.length == 0) {
        return undefined;
      } else {
        let out = _outJSON(v[`t${c[0]}`]);
        out.basis = gd.name;
        out.name = kind;
        return out;
      }
    }
  };

  let query = function (typeName, thickness) {
    return _lookup(typeName, thickness);
  };

  return {
    basises: ["GB50017-2017"],
    query: query,
    gb500172017: { query: query },
  };
})();
