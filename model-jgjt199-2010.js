// jgj/t199-2010 model
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2023-11-03 14:39:51
// last modified at 2023-11-12 18:05:22
//
// copyright (c) 2023 Jack Hsu



const modelJGJT1992010 = {
    constant: {
        gammaf: 1.25,
        gamma0: {
            level1: 1.1,
            level2: 1.0,
            level3: 0.9,
        },
    },

    preprocessPitData(pitData) {
        let ret = { pitLevel: pitData.level.toLowerCase() };
        ret.norms = Array.isArray(pitData.norms) ? pitData.norms : undefined;
        ret.gammaf = pitData.gammaf ?? this.constant.gammaf;
        ret.gamma0 = pitData.gamma0 ?? this.constant.gamma0[ret.pitLevel];
        return ret;
    },

    formula4241: {
        run(pitData, shapedSteelData) {
            let ret = modelJGJT1992010.preprocessPitData(pitData);
            ret.mk = pitData.m * shapedSteelData.distance * 0.001;
            ret.w = shapedSteelData.wx;
            ret.f = shapedSteelData.f;

            let x = ((ret.gammaf * ret.gamma0 * ret.mk) / ret.w) * 1000;
            ret.result = x.toFixed(3);
            ret.quality = x <= ret.f ? 1 : 0;

            return ret;
        },

        resultToHTML(r) {
            let a = `根据JGJ/T199-2010公式4.2.4-1，
                \\[ \\begin{align}
                \\frac{ ${r.gammaf} \\gamma_0M_k}{W_x}
                &= ${r.gammaf} \\times ${r.gamma0} \\times ${r.mk} \\div ${r.w} \\times 1000 \\\\
                &= ${r.result} N/mm^2
                ${r.quality == 1
                    ? `\\leq f = ${r.f} N/mm^2 \\end{align} \\] 型钢抗弯强度<b>满足要求</b >。`
                    : `\\gt f = ${r.f} N/mm^2 \\end{align} \\] 型钢抗弯强度<span class='red-bold'>不满足要求</span>。`
                }`;
            return a;
        },

        runAndOutputHTML(pitData, shapedSteelData) {
            return this.resultToHTML(this.run(pitData, shapedSteelData));
        },
    },

    formula4242: {
        run(pitData, shapedSteelData) {
            let ret = modelJGJT1992010.preprocessPitData(pitData);
            ret.vk = pitData.v * shapedSteelData.distance * 0.001;
            ret.s = shapedSteelData.sx;
            ret.i = shapedSteelData.ix;
            ret.tw = shapedSteelData.tw;
            ret.fv = shapedSteelData.fv;

            let x = ((ret.gammaf * ret.gamma0 * ret.vk * ret.s) / ret.i / ret.tw) * 1000;
            ret.result = x.toFixed(3);
            ret.quality = x <= ret.fv ? 1 : 0;

            return ret;
        },

        resultToHTML(r) {
            let a = `根据JGJ/T199-2010公式4.2.4-2，
                \\[ \\begin{align}
                \\frac{ ${r.gammaf} \\gamma_0V_kS}{It_w}
                &= ${r.gammaf} \\times ${r.gamma0} \\times ${r.vk} \\times ${r.s} 
                \\div ${r.i} \\div ${r.tw} \\times 1000 \\\\
                &= ${r.result} N/mm^2
                ${r.quality == 1
                    ? `\\leq f_v= ${r.fv} N/mm^2 \\end{align} \\] 型钢抗剪强度<b>满足要求</b>。`
                    : `\\gt f_v= ${r.fv} N/mm^2 \\end{align} \\] 型钢抗剪强度<span class='red-bold'>不满足要求</span>。`
                }`;
            return a;
        },

        runAndOutputHTML(pitData, shapedSteelData) {
            return this.resultToHTML(this.run(pitData, shapedSteelData));
        },
    },

    formula4251: {
        run(pitData, shapedSteelData, dsmData) {
            let ret = modelJGJT1992010.preprocessPitData(pitData);
            ret.tauck = dsmData.strength / 3;
            ret.qk = pitData.v * 0.001;
            ret.l1 = shapedSteelData.distance - shapedSteelData.b;
            ret.tauck = ret.tauck.toFixed(3);

            let x = ret.tauck / 1.6;
            ret.tau = x.toFixed(3);
            ret.v1k = ret.qk * ret.l1 * 0.5;

            let h = dsmData.kind == "round" ? dsmData.diameter : dsmData.thickness;

            ret.de1 = h - (h - shapedSteelData.h) * 0.5;
            x = (ret.gammaf * ret.gamma0 * ret.v1k) / ret.de1;
            ret.tau1 = x.toFixed(3);
            ret.result = ret.tau1;
            ret.quality = ret.tau1 <= ret.tau ? 1 : 0;

            return ret;
        },

        resultToHTML(r) {
            let a;
            a = `<p>
                根据JGJ/T199-2010公式4.2.5-4，
                \\[ \\tau=\\frac{\\tau_{ck}}{1.6}
                = ${r.tauck} \\div 1.6
                = ${r.tau} N/mm^2 \\]
                </p>
                <p>
                根据JGJ/T199-2010公式4.2.5-3，
                \\[ V_{1k}=q_kL_1/2
                = ${r.qk} \\times ${r.l1} \\div 2
                = ${r.v1k} N/mm \\]
                </p>
                <p>
                根据JGJ/T199-2010公式4.2.5-2，
                \\[ \\begin{align}
                \\tau_1 &=\\frac{ ${r.gammaf} \\gamma_0V_{1k}}{d_{e1}} \\\\
                &= ${r.gammaf} \\times ${r.gamma0} \\times ${r.v1k} \\div ${r.de1} \\\\
                &= ${r.tau1} N/mm^2
                ${r.quality == 1
                    ? `\\leq \\tau=${r.tau} N/mm^2 \\end{align} \\] 水泥土局部受剪<b>满足要求</b>。`
                    : `\\gt \\tau=${r.tau} N/mm^2 \\end{align} \\] 水泥土局部受剪<span class='red-bold'>不满足要求</span>。`
                }
                </p>`;
            return a;
        },

        runAndOutputHTML(pitData, shapedSteelData, dsmData) {
            return this.resultToHTML(this.run(pitData, shapedSteelData, dsmData));
        },
    },

    formula4255: {
        run(pitData, shapedSteelData, dsmData) {
            let ret = modelJGJT1992010.preprocessPitData(pitData);
            ret.tauck = dsmData.strength / 3;
            ret.tauck = ret.tauck.toFixed(3);
            ret.qk = pitData.v * 0.001;

            if (shapedSteelData.distance <= dsmData.distance) {
                ret.quality = -1;
            } else {
                let x = ret.tauck / 1.6;
                ret.tau = x.toFixed(3);

                if (dsmData.kind == "round") {
                    let d, dd, dx;
                    d = dsmData.diameter;
                    dd = d - dsmData.distance;
                    dx = Math.sqrt(d ** 2 * 0.25 - (d * 0.5 - dd * 0.5) ** 2) * 2;
                    ret.l2 = dsmData.distance;
                    ret.de2 = dx.toFixed(3);
                } else {
                    ret.l2 = shapedSteelData.distance - shapedSteelData.b;
                    ret.de2 = dsmData.thickness;
                }

                ret.v2k = ret.qk * ret.l2 * 0.5;
                x = (ret.gammaf * ret.gamma0 * ret.v2k) / ret.de2;
                ret.tau2 = x.toFixed(3);
                ret.result = ret.tau2;
                ret.quality = ret.tau2 <= ret.tau ? 1 : 0;
            }
            return ret;
        },

        resultToHTML(r) {
            let a;
            a = `${r.quality == -1
                ? `<p>H型钢为密插型，无需验算水泥土最薄弱截面局部受剪承载力。</p>`
                : `<p>
                根据JGJ/T199-2010公式4.2.5-4，
                \\[ \\tau=\\frac{\\tau_{ck}}{1.6}
                = ${r.tauck} \\div 1.6
                = ${r.tau} N/mm^2 \\]
                </p>
                <p>
                根据JGJ/T199-2010公式4.2.5-7，
                \\[ V_{2k}=q_kL_2/2
                = ${r.qk} \\times ${r.l2} \\div 2
                = ${r.v2k} N/mm \\]
                </p>
                <p>
                根据JGJ/T199-2010公式4.2.5-6，
                \\[ \\begin{align}
                \\tau_2 &=\\frac{ ${r.gammaf} \\gamma_0V_{2k}}{d_{e2}} \\\\
                &= ${r.gammaf} \\times ${r.gamma0} \\times ${r.v2k} \\div ${r.de2} \\\\
                &= ${r.tau2} N/mm^2
                ${r.quality == 1
                    ? `\\leq \\tau=${r.tau} N/mm^2 \\end{align} \\] 水泥土局部受剪<b>满足要求</b>。`
                    : `\\gt \\tau=${r.tau} N/mm^2 \\end{align} \\] 水泥土局部受剪<span class='red-bold'>不满足要求</span>。`
                }
                </p>`
                }`;
            return a;
        },

        runAndOutputHTML(pitData, shapedSteelData, dsmData) {
            return this.resultToHTML(this.run(pitData, shapedSteelData, dsmData));
        },
    },
};
