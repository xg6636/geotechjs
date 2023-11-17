// 边坡计算
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2023-11-15 23:58:45
// last modified at 2023-11-17 22:34:59
//
// copyright (c) 2023 Jack Hsu



const slope = (function () {
    const _slope = {
        makeSoilMass: function (gravity, cohesion, frictionAngle) {
            return {
                gravity: (0 < gravity) ? Number(gravity) : 0,
                cohesion: (0 < cohesion) ? Number(cohesion) : 0,
                frictionAngle: (0 < frictionAngle) ? Number(frictionAngle) : 0,
            };
        },

        makeSlipSurface: function (angle, length, cohesion, frictionAngle) {
            return {
                angle: (0 < angle) ? Number(angle) : 0,
                length: (0 < length) ? Number(length) : 0,
                cohesion: (0 < cohesion) ? Number(cohesion) : 0,
                frictionAngle: (0 < frictionAngle) ? Number(frictionAngle) : 0,
            };
        },

        makeSlidingBlock: function (slipSurface, gravity) {
            return {
                slipSurface: slipSurface ?? null,
                gravity: (0 < gravity) ? Number(gravity) : 0,
            };
        },
    };

    let _gb500072011Formula643 = function (currentBlock, upperBlock, forceFromUpper, safetyFactor) {
        let cb = currentBlock;
        let ub = upperBlock;

        let bn = degreeToRadian(cb.slipSurface.angle);
        let bn1n = degreeToRadian(ub.slipSurface.angle - cb.slipSurface.angle);
        let tgyn = Math.tan(degreeToRadian(cb.slipSurface.frictionAngle));

        let out = { basis: "GB50007-2011", };
        out.outPsi = Math.cos(bn1n) - Math.sin(bn1n) * tgyn;

        out.outGnt = cb.gravity * Math.sin(bn);
        out.outGnn = cb.gravity * Math.cos(bn);

        out.outFn = forceFromUpper * out.outPsi;
        out.outFn += safetyFactor * out.outGnt;
        out.outFn -= out.outGnn * tgyn;
        out.outFn -= cb.slipSurface.cohesion * cb.slipSurface.length;

        out.resultToHTML = `Fn=${out.outFn.toFixed(3)}kN，<br>&psi;=${out.outPsi.toFixed(3)}`;

        return out;
    };

    let _gb503302013FormulaA02 = function (block, verticalLoad, horizontalLoad, waterHeight) {
        const rw = 9.8;
        const b = degreeToRadian(block.slipSurface.angle);
        const cb = Math.cos(b);
        const sb = Math.sin(b);
        const l = block.slipSurface.length;
        const gg = block.gravity + Number(verticalLoad);

        let out = { basis: "GB50330-2013", };
        out.outV = 0.5 * rw * waterHeight ** 2;
        out.outU = 0.5 * rw * waterHeight * l;

        out.outR = gg * cb;
        out.outR -= Number(horizontalLoad) * sb + out.outV * sb + out.outU;
        out.outR *= Math.tan(degreeToRadian(block.slipSurface.frictionAngle));
        out.outR += block.slipSurface.cohesion * l;

        out.outT = gg * sb + Number(horizontalLoad) * cb + out.outV * cb;

        out.outFs = out.outR / out.outT;

        out.basis = "GB50330-2013";
        out.displayResult = `Fs=${out.outFs.toFixed(3)}，
                                R=${out.outR.toFixed(3)}kN，T=${out.outT.toFixed(3)}kN`;

        console.log(block);

        console.log(out);
        return out;
    };

    let _gb503302013Formula6210 = function (height, angle, soilMass) {
        let r = soilMass.gravity;

        let out = { basis: "GB50330-2013", };
        out.outEta = 2 * soilMass.cohesion / r / height;

        let y = degreeToRadian(soilMass.frictionAngle);
        let a = degreeToRadian(angle);

        let p = 1 / Math.tan(a) / (out.outEta + Math.tan(y));
        p = Math.sqrt(1 + p);
        p = Math.cos(y) / (p - Math.sin(y));
        out.outTheta = Math.atan(p);

        p = 1 / Math.tan(out.outTheta) - 1 / Math.tan(a);
        p *= Math.tan(out.outTheta - y);
        p -= out.outEta * Math.cos(y) / Math.sin(out.outTheta) / Math.cos(out.outTheta - y);
        out.outKa = p;

        out.outTheta = radianToDegree(out.outTheta);

        out.outEa = 0.5 * r * height ** 2 * out.outKa;

        out.resultToHTML = `Ea=${out.outEa.toFixed(3)}kN/m，&theta;=${out.outTheta.toFixed(3)}&deg;
                            <br>Ka=${out.outKa.toFixed(3)}，&eta;=${out.outEta.toFixed(3)}`;

        return out;
    };

    let _retainingWall = {
        _importRaw: function (raw) {
            return {
                topVerticalLoad: raw.top_vertical_load ?? 0,
                topAngle: raw.top_angle ?? 0,
                wallHeight: raw.retaining_wall_height ?? 1,
                wallBackAngle: raw.retaining_wall_back_angle ?? 75,
                wallBackFrictionAngle: raw.retaining_wall_back_phi ?? 0,
                soilGravity: raw.soil_gravity ?? 20,
                soilCohesion: raw.soil_c ?? 1,
                soilFrictionAngle: raw.soil_phi ?? 25,
            };
        },

        gb503302013: {
            getActivePressure: function (raw) {
                let data = _retainingWall._importRaw(raw);
                for (const [key, value] of Object.entries(data)) {
                    data[key] = Number(value);
                }

                const a = degreeToRadian(data.wallBackAngle);
                const b = degreeToRadian(data.topAngle);
                const c = degreeToRadian(data.wallBackFrictionAngle);
                const y = degreeToRadian(data.soilFrictionAngle);
                const r = data.soilGravity;

                data.outEta = (2 * data.soilCohesion) / r / data.wallHeight;
                const g = data.outEta;

                data.outKq = 2 * data.topVerticalLoad * Math.sin(a) * Math.cos(b);
                data.outKq /= r * data.wallHeight * Math.sin(a + b);
                data.outKq += 1;

                const kq = data.outKq;

                data.outKa = Math.sin(a + c) * Math.sin(a - c);
                data.outKa += Math.sin(y + c) * Math.sin(y - b);
                data.outKa *= kq;
                data.outKa += 2 * g * Math.sin(a) * Math.cos(y) * Math.cos(a + b - y - c);

                let ka3 = 2 * Math.sqrt(kq * Math.sin(a + b) * Math.sin(y - b) + g * Math.sin(a) * Math.cos(y));
                ka3 *= Math.sqrt(kq * Math.sin(a - c) * Math.sin(y + c) + g * Math.sin(a) * Math.cos(y));

                data.outKa -= ka3;
                data.outKa *= Math.sin(a + b) / Math.sin(a) ** 2 / Math.sin(a + b - y - c) ** 2;

                data.outEa = 0.5 * r * data.wallHeight ** 2 * data.outKa;

                data.basis = "GB50330-2013";
                data.resultToHTML = `Ea=${data.outEa.toFixed(3)}kN/m，<br>
                                Ka=${data.outKa.toFixed(3)}，Kq=${data.outKq.toFixed(3)}，<br>
                                &eta;=${data.outEta.toFixed(3)}`;

                return data;
            },

            getActivePressureOfFiniteSoil: function (raw) {
                let data = _retainingWall._importRaw(raw);
                data.rockSlopeAngle = raw.rock_slope_angle ?? 0;
                data.rockSlopeFrictionAngle = raw.rock_slope_phi ?? 0;
                for (const [key, value] of Object.entries(data)) {
                    data[key] = Number(value);
                }

                const a = degreeToRadian(data.wallBackAngle);
                const b = degreeToRadian(data.topAngle);
                const c = degreeToRadian(data.wallBackFrictionAngle);
                const d = degreeToRadian(data.rockSlopeAngle);
                const dc = degreeToRadian(data.rockSlopeFrictionAngle);

                data.outEta =
                    (2 * data.soilCohesion) / data.soilGravity / data.wallHeight;

                data.outKa = (Math.sin(a + d) * Math.sin(d - dc)) / Math.sin(a) ** 2;
                data.outKa -= (data.outEta * Math.cos(dc)) / Math.sin(a);
                data.outKa *=
                    Math.sin(a + b) / Math.sin(a - c + d - dc) / Math.sin(d - b);

                data.outEa = 0.5 * data.soilGravity * data.wallHeight ** 2 * data.outKa;

                data.basis = "GB50330-2013";
                data.resultToHTML = `Ea=${data.outEa.toFixed(3)}kN/m，<br>
                                Ka=${data.outKa.toFixed(3)}，&eta;=${data.outEta.toFixed(3)}`;

                return data;
            },
        },
    };

    let _getActivePressureOnRetainingWall = function (raw, guidelineNumber) {
        let gn = normalizeGuidelineNumber(guidelineNumber, "GB50330-2013");

        return _retainingWall[gn].getActivePressure
            ? _retainingWall[gn].getActivePressure(raw)
            : _retainingWall.gb503302013.getActivePressure(raw);
    };

    let _getActivePressureOfFiniteSoilOnRetainingWall = function (
        raw,
        guidelineNumber
    ) {
        let gn = normalizeGuidelineNumber(guidelineNumber, "GB50330-2013");

        return _retainingWall[gn].getActivePressureOfFiniteSoil
            ? _retainingWall[gn].getActivePressureOfFiniteSoil(raw)
            : _retainingWall.gb503302013.getActivePressureOfFiniteSoil(raw);
    };

    return {
        basises: ["GB50007-2011", "GB50330-2013"],
        makeSoilMass: _slope.makeSoilMass,
        makeSlipSurface: _slope.makeSlipSurface,
        makeSlidingBlock: _slope.makeSlidingBlock,
        gb500072011: {
            formula643: _gb500072011Formula643,
        },
        retainingWall: {
            getActivePressure: _getActivePressureOnRetainingWall,
            getActivePressureOfFiniteSoil:
                _getActivePressureOfFiniteSoilOnRetainingWall,
        },
        gb503302013: {
            formula6210: _gb503302013Formula6210,
            formulaA02: _gb503302013FormulaA02,
            retainingWall: {
                getActivePressure: _getActivePressureOnRetainingWall,
                getActivePressureOfFiniteSoil:
                    _getActivePressureOfFiniteSoilOnRetainingWall,
            },
        },
    };
})();
