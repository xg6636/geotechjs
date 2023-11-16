// 边坡计算
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2023-11-15 23:58:45
// last modified at 2023-11-16 10:28:16
//
// copyright (c) 2023 Jack Hsu

function radianToDegree(x) {
    return (x * 180.0) / Math.PI;
}

function degreeToRadian(x) {
    return (x * Math.PI) / 180.0;
}

function normalizeGuidelineNumber(x, defaultNumber) {
    let gn = x ?? defaultNumber;
    gn = gn.toLowerCase();
    gn = gn.replace("-", "");
    gn = gn.replace("/", "");
    return gn;
}

const slope = (function () {
    let _slope = {
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

    let _getSlopingForce = function (raw, guidelineNumber) {
        let gn = normalizeGuidelineNumber(guidelineNumber, "GB50007-2011");

        return _slope[gn] ? _slope[gn](raw) : _slope.gb500072011(raw);
    };

    return {
        basises: ["GB50007-2011"],
        getSlopingForce: _getSlopingForce,
        gb500072011: {
            getSlopingForce: _getSlopingForce,
        },
    };
})();
