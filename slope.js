// 边坡计算
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2023-11-15 23:58:45
// last modified at 2023-11-16 17:59:51
//
// copyright (c) 2023 Jack Hsu



const slope = (function () {
    let _slopingForce = {
        _importRaw: function (raw) {
            return {
                safetyFactor: raw.safety_factor ?? 1.0,
                upperForce: raw.upper_force ?? 0,
                upperSurfaceAngle: raw.upper_surface_angle ?? 60,
                myGravity: raw.my_gravity ?? 0,
                mySurfaceAngle: raw.my_surface_angle ?? 45,
                mySurfaceLength: raw.my_surface_length ?? 1,
                surfaceCohesion: raw.surface_c ?? 1,
                surfaceFrictionAngle: raw.surface_phi ?? 1,
            };
        },

        gb500072011: function (raw) {
            let data = this._importRaw(raw);
            for (const [key, value] of Object.entries(data)) {
                data[key] = Number(value);
            }

            let bn = degreeToRadian(data.mySurfaceAngle);
            let bn1n = degreeToRadian(data.upperSurfaceAngle - data.mySurfaceAngle);
            let tgyn = Math.tan(degreeToRadian(data.surfaceFrictionAngle));

            data.outPsi = Math.cos(bn1n) - Math.sin(bn1n) * tgyn;
            data.outGnt = data.myGravity * Math.sin(bn);
            data.outGnn = data.myGravity * Math.cos(bn);
            data.outFn = data.upperForce * data.outPsi;
            data.outFn += data.safetyFactor * data.outGnt;
            data.outFn -= data.outGnn * tgyn;
            data.outFn -= data.surfaceCohesion * data.mySurfaceLength;
            data.basis = "GB50007-2011";
            data.resultToHTML = `Fn=${data.outFn.toFixed(3)}kN，<br>&psi;=${data.outPsi.toFixed(3)}`;

            return data;
        },
    };

    let _slopeStability = {
        _importRaw: function (raw) {
            return {
                extraVerticalLoad: raw.extra_vertical_load ?? 0,
                extraHorizontalLoad: raw.horizontal_load ?? 0,
                myGravity: raw.my_gravity ?? 0,
                mySurfaceAngle: raw.my_surface_angle ?? 45,
                mySurfaceLength: raw.my_surface_length ?? 1,
                surfaceCohesion: raw.surface_c ?? 1,
                surfaceFrictionAngle: raw.surface_phi ?? 1,
                waterHeight: raw.water_height ?? 0,
            };
        },

        gb503302013: function (raw) {
            let data = this._importRaw(raw);
            for (const [key, value] of Object.entries(data)) {
                data[key] = Number(value);
            }

            const rw = 9.8;
            const b = degreeToRadian(data.mySurfaceAngle);
            const cb = Math.cos(b);
            const sb = Math.sin(b);
            const l = data.mySurfaceLength;
            const gg = data.myGravity + data.extraVerticalLoad;

            data.outV = 0.5 * rw * data.waterHeight ** 2;
            data.outU = 0.5 * rw * data.waterHeight * l;

            data.outR = gg * cb;
            data.outR -= data.extraHorizontalLoad * sb + data.outV * sb + data.outU;
            data.outR *= Math.tan(degreeToRadian(data.surfaceFrictionAngle));
            data.outR += data.surfaceCohesion * l;

            data.outT = gg * sb + data.extraHorizontalLoad * cb + data.outV * cb;

            data.outFs = data.outR / data.outT;

            data.basis = "GB50330-2013";
            data.displayResult = `Fs=${data.outFs.toFixed(3)}，
                                    R=${data.outR.toFixed(3)}kN，T=${data.outT.toFixed(3)}kN`;

            return data;
        },
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

                data.outEta = 2 * data.soilCohesion / r / data.wallHeight;
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
                data.outKa *= Math.sin(a + b) / (Math.sin(a) ** 2) / (Math.sin(a + b - y - c) ** 2);

                data.outEa = 0.5 * r * (data.wallHeight ** 2) * data.outKa;

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

                data.outEta = 2 * data.soilCohesion / data.soilGravity / data.wallHeight;

                data.outKa = Math.sin(a + d) * Math.sin(d - dc) / (Math.sin(a) ** 2);
                data.outKa -= data.outEta * Math.cos(dc) / Math.sin(a);
                data.outKa *= Math.sin(a + b) / Math.sin(a - c + d - dc) / Math.sin(d - b);

                data.outEa = 0.5 * data.soilGravity * (data.wallHeight ** 2) * data.outKa;

                data.basis = "GB50330-2013";
                data.resultToHTML = `Ea=${data.outEa.toFixed(3)}kN/m，<br>
                                Ka=${data.outKa.toFixed(3)}，&eta;=${data.outEta.toFixed(3)}`;

                return data;
            },
        }
    };

    let _getSlopingForce = function (raw, guidelineNumber) {
        let gn = normalizeGuidelineNumber(guidelineNumber, "GB50007-2011");

        return _slopingForce[gn] ? _slopingForce[gn](raw) : _slopingForce.gb500072011(raw);
    };

    let _getStability = function (raw, guidelineNumber) {
        let gn = normalizeGuidelineNumber(guidelineNumber, "GB50330-2013");

        return _slopeStability[gn] ? _slopeStability[gn](raw) : _slopeStability.gb503302013(raw);
    };

    let _getActivePressureOnRetainingWall = function (raw, guidelineNumber) {
        let gn = normalizeGuidelineNumber(guidelineNumber, "GB50330-2013");

        return _retainingWall[gn].getActivePressure ?
            _retainingWall[gn].getActivePressure(raw)
            :
            _retainingWall.gb503302013.getActivePressure(raw);
    };

    let _getActivePressureOfFiniteSoilOnRetainingWall = function (raw, guidelineNumber) {
        let gn = normalizeGuidelineNumber(guidelineNumber, "GB50330-2013");

        return _retainingWall[gn].getActivePressureOfFiniteSoil ?
            _retainingWall[gn].getActivePressureOfFiniteSoil(raw)
            :
            _retainingWall.gb503302013.getActivePressureOfFiniteSoil(raw);
    };

    return {
        basises: ["GB50007-2011", "GB50330-2013"],
        getSlopingForce: _getSlopingForce,
        gb500072011: {
            getSlopingForce: _getSlopingForce,
        },
        getStability: _getStability,
        retainingWall: {
            getActivePressure: _getActivePressureOnRetainingWall,
            getActivePressureOfFiniteSoil: _getActivePressureOfFiniteSoilOnRetainingWall,
        },
        gb503302013: {
            getStability: _getStability,
            retainingWall: {
                getActivePressure: _getActivePressureOnRetainingWall,
                getActivePressureOfFiniteSoil: _getActivePressureOfFiniteSoilOnRetainingWall,
            },
        },
    };
})();
