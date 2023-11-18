// 边坡计算
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2023-11-15 23:58:45
// last modified at 2023-11-18 15:33:17
//
// copyright (c) 2023 Jack Hsu



const slope = (function () {
    const _slope = {
        SoilMass: function (gravity, cohesion, frictionAngle) {
            return {
                gravity: (0 < gravity) ? Number(gravity) : 0,
                cohesion: (0 < cohesion) ? Number(cohesion) : 0,
                frictionAngle: (0 < frictionAngle) ? Number(frictionAngle) : 0,
            };
        },

        SlipSurface: function (angle, length, cohesion, frictionAngle) {
            return {
                angle: (0 < angle) ? Number(angle) : 0,
                length: (0 < length) ? Number(length) : 0,
                cohesion: (0 < cohesion) ? Number(cohesion) : 0,
                frictionAngle: (0 < frictionAngle) ? Number(frictionAngle) : 0,
            };
        },

        SlidingBlock: function (slipSurface, gravity) {
            return {
                slipSurface: slipSurface ?? null,
                gravity: (0 < gravity) ? Number(gravity) : 0,
            };
        },

        RetainingWall: function (height, backAngle, backFrictionAngle) {
            return {
                height: (0 < height) ? Number(height) : 0,
                backAngle: (0 < backAngle) ? Number(backAngle) : 0,
                backFrictionAngle: (0 < backFrictionAngle) ? Number(backFrictionAngle) : 0,
            };
        },

        RockSlope: function (angle, surfaceFrictionAngle) {
            return {
                angle: (0 < angle) ? Number(angle) : 0,
                surfaceFrictionAngle: (0 < surfaceFrictionAngle) ? Number(surfaceFrictionAngle) : 0,
            };
        },
    };

    const _gb500072011 = {
        formula643: function (currentBlock, upperBlock, forceFromUpper, safetyFactor) {
            // 滑坡推力计算

            let cb = currentBlock;
            let ub = upperBlock;

            let bn = degreeToRadian(cb.slipSurface.angle);
            let bn1n = degreeToRadian(ub.slipSurface.angle - cb.slipSurface.angle);
            let tgyn = Math.tan(degreeToRadian(cb.slipSurface.frictionAngle));

            let o = { basis: "GB50007-2011", };
            o.Psi = Math.cos(bn1n) - Math.sin(bn1n) * tgyn;

            o.Gnt = cb.gravity * Math.sin(bn);
            o.Gnn = cb.gravity * Math.cos(bn);

            o.Fn = forceFromUpper * o.Psi;
            o.Fn += safetyFactor * o.Gnt;
            o.Fn -= o.Gnn * tgyn;
            o.Fn -= cb.slipSurface.cohesion * cb.slipSurface.length;

            o.resultToHTML = `Fn=${o.Fn.toFixed(3)}kN，<br>&psi;=${o.Psi.toFixed(3)}`;

            return o;
        },
    };

    const _gb503302013 = {
        formulaA02: function (block, verticalLoad, horizontalLoad, waterHeight) {
            // 平面滑动面的边坡稳定性系数
            const rw = 9.8;
            const b = degreeToRadian(block.slipSurface.angle);
            const cb = Math.cos(b);
            const sb = Math.sin(b);
            const l = block.slipSurface.length;
            const gg = block.gravity + Number(verticalLoad);

            let o = { basis: "GB50330-2013", };
            o.V = 0.5 * rw * waterHeight ** 2;
            o.U = 0.5 * rw * waterHeight * l;

            o.R = gg * cb;
            o.R -= Number(horizontalLoad) * sb + o.V * sb + o.U;
            o.R *= Math.tan(degreeToRadian(block.slipSurface.frictionAngle));
            o.R += block.slipSurface.cohesion * l;

            o.T = gg * sb + Number(horizontalLoad) * cb + o.V * cb;

            o.Fs = o.R / o.T;

            o.basis = "GB50330-2013";
            o.displayResult = `Fs=${o.Fs.toFixed(3)}，
                                    R=${o.R.toFixed(3)}kN，T=${o.T.toFixed(3)}kN`;

            console.log(block);

            console.log(o);
            return o;
        },

        formula6210: function (height, angle, soilMass) {
            // 坡顶水平、坡面倾斜的边坡主动土压力

            let r = soilMass.gravity;

            let o = { basis: "GB50330-2013", };
            o.eta = 2 * soilMass.cohesion / r / height;

            let y = degreeToRadian(soilMass.frictionAngle);
            let a = degreeToRadian(angle);

            let p = 1 / Math.tan(a) / (o.eta + Math.tan(y));
            p = Math.sqrt(1 + p);
            p = Math.cos(y) / (p - Math.sin(y));
            o.theta = Math.atan(p);

            p = 1 / Math.tan(o.theta) - 1 / Math.tan(a);
            p *= Math.tan(o.theta - y);
            p -= o.eta * Math.cos(y) / Math.sin(o.theta) / Math.cos(o.theta - y);
            o.Ka = p;

            o.theta = radianToDegree(o.theta);

            o.Ea = 0.5 * r * height ** 2 * o.Ka;

            o.resultToHTML = `Ea=${o.Ea.toFixed(3)}kN/m，&theta;=${o.theta.toFixed(3)}&deg;
                                <br>Ka=${o.Ka.toFixed(3)}，&eta;=${o.eta.toFixed(3)}`;

            return o;
        },

        formula623: function (retainingWall, soilMass, slopeTopAngle, topVerticalLoad) {
            // 非水平坡顶的挡土墙主动土压力

            const a = degreeToRadian(retainingWall.backAngle);
            const b = degreeToRadian(slopeTopAngle);
            const c = degreeToRadian(retainingWall.backFrictionAngle);
            const y = degreeToRadian(soilMass.frictionAngle);
            const r = soilMass.gravity;
            const h = retainingWall.height;

            let o = { basis: "GB50330-2013", };
            o.eta = (2 * soilMass.cohesion) / r / h;
            const g = o.eta;

            let kq = 2 * topVerticalLoad * Math.sin(a) * Math.cos(b);
            kq /= r * h * Math.sin(a + b);
            kq += 1;

            o.Kq = kq;

            ka = Math.sin(a + c) * Math.sin(a - c);
            ka += Math.sin(y + c) * Math.sin(y - b);
            ka *= kq;
            ka += 2 * g * Math.sin(a) * Math.cos(y) * Math.cos(a + b - y - c);

            let ka3 = 2 * Math.sqrt(kq * Math.sin(a + b) * Math.sin(y - b) + g * Math.sin(a) * Math.cos(y));
            ka3 *= Math.sqrt(kq * Math.sin(a - c) * Math.sin(y + c) + g * Math.sin(a) * Math.cos(y));

            ka -= ka3;
            ka *= Math.sin(a + b) / Math.sin(a) ** 2 / Math.sin(a + b - y - c) ** 2;

            o.Ka = ka;

            o.Ea = 0.5 * r * h ** 2 * ka;

            o.resultToHTML = `Ea=${o.Ea.toFixed(3)}kN/m，<br>
                            Ka=${o.Ka.toFixed(3)}，Kq=${o.Kq.toFixed(3)}，<br>
                            &eta;=${o.eta.toFixed(3)}`;

            return o;
        },

        formula628: function (retainingWall, soilMass, soilTopAngle, rockSlope) {
            // 有限范围填土的主动土压力

            console.log(retainingWall);
            console.log(soilMass);
            console.log(rockSlope);
            const a = degreeToRadian(retainingWall.backAngle);
            const b = degreeToRadian(soilTopAngle);
            const c = degreeToRadian(retainingWall.backFrictionAngle);
            const d = degreeToRadian(rockSlope.angle);
            const dc = degreeToRadian(rockSlope.surfaceFrictionAngle);
            const r = soilMass.gravity;
            const h = retainingWall.height;

            let o = { basis: "GB50330-2013", };
            o.eta = (2 * soilMass.cohesion) / r / h;

            let ka = (Math.sin(a + d) * Math.sin(d - dc)) / Math.sin(a) ** 2;
            ka -= (o.eta * Math.cos(dc)) / Math.sin(a);
            ka *= Math.sin(a + b) / Math.sin(a - c + d - dc) / Math.sin(d - b);

            o.Ka = ka;

            o.Ea = 0.5 * r * h ** 2 * ka;

            o.resultToHTML = `Ea=${o.Ea.toFixed(3)}kN/m，<br>
                            Ka=${o.Ka.toFixed(3)}，&eta;=${o.eta.toFixed(3)}`;

            return o;
        },
    };

    return {
        basises: ["GB50007-2011", "GB50330-2013"],
        SoilMass: _slope.SoilMass,
        SlipSurface: _slope.SlipSurface,
        SlidingBlock: _slope.SlidingBlock,
        RetainingWall: _slope.RetainingWall,
        RockSlope: _slope.RockSlope,
        gb500072011: {
            formula643: _gb500072011.formula643,
        },
        gb503302013: {
            formula6210: _gb503302013.formula6210,
            formulaA02: _gb503302013.formulaA02,
            formula623: _gb503302013.formula623,
            formula628: _gb503302013.formula628,
        },
    };
})();
