// 边坡计算
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2023-11-15 23:58:45
// last modified at 2023-11-16 13:13:12
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

    let _getSlopingForce = function (raw, guidelineNumber) {
        let gn = normalizeGuidelineNumber(guidelineNumber, "GB50007-2011");

        return _slopingForce[gn] ? _slopingForce[gn](raw) : _slopingForce.gb500072011(raw);
    };

    let _getStability = function (raw, guidelineNumber) {
        let gn = normalizeGuidelineNumber(guidelineNumber, "GB50330-2013");

        return _slopeStability[gn] ? _slopeStability[gn](raw) : _slopeStability.gb503302013(raw);
    };

    return {
        basises: ["GB50007-2011", "GB50330-2013"],
        getSlopingForce: _getSlopingForce,
        gb500072011: {
            getSlopingForce: _getSlopingForce,
        },
        getStability: _getStability,
        gb503302013: {
            getStability: _getStability,
        },
    };
})();
