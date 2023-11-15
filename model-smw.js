// smw model
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2023-11-03 14:39:51
// last modified at 2023-11-15 11:56:42
//
// copyright (c) 2023 Jack Hsu

const modelSMW = {
    // require materialSteel,
    // maybe it's from material-steel.js.

    hsteelTrait: {
        basis: "11SG814,p42",
        h500x200x9x14: { a: 99.3, g: 77.9, ix: 39628, sx: 918, wx: 1598 },
        h500x200x10x16: { a: 112.3, g: 88.1, ix: 45685, sx: 1048, wx: 1827 },
        h500x200x11x19: { a: 129.3, g: 102, ix: 54478, sx: 1231, wx: 2153 },
        h500x300x11x15: { a: 141.2, g: 111, ix: 57212, sx: 1332, wx: 2374 },
        h500x300x11x18: { a: 159.2, g: 125, ix: 67916, sx: 1550, wx: 2783 },
        h700x300x13x20: { a: 207.5, g: 163, ix: 164101, sx: 2707, wx: 4743 },
        h700x300x13x24: { a: 231.5, g: 182, ix: 193622, sx: 3125, wx: 5532 },
        h800x300x14x22: { a: 239.5, g: 188, ix: 242399, sx: 3520, wx: 6121 },
        h800x300x14x26: { a: 263.5, g: 207, ix: 280925, sx: 3998, wx: 7023 },
        h850x300x14x19: { a: 227.5, g: 179, ix: 243858, sx: 3416, wx: 5848 },
        h850x300x15x23: { a: 259.7, g: 204, ix: 291216, sx: 4004, wx: 6917 },
        h850x300x16x27: { a: 292.1, g: 229, ix: 339670, sx: 4600, wx: 7992 },
        h850x300x17x31: { a: 324.7, g: 255, ix: 389234, sx: 5205, wx: 9073 },
    },

    shapedSteel: {
        fromDataDescription: {
            ss_kind: "型钢类型，如：'h700x300x13x20'。",
            ss_material: "型钢材料，如：'q355'。",
            ss_distance: "型钢间距，以mm计。",
        },

        fromData(raw) {
            let ss = {
                id: raw.ss_kind,
                material: raw.ss_material,
                distance: Number(raw.ss_distance),
                f: 0,
                fv: 0,
                fy: 0,
            };

            ss.size = ss.id.substr(1);

            let a = ss.size.split("x");
            ss.h = Number(a[0]);
            ss.b = Number(a[1]);
            ss.tw = Number(a[2]);
            ss.t = Number(a[3]);
            ss.a = modelSMW.hsteelTrait[ss.id].a;
            ss.g = modelSMW.hsteelTrait[ss.id].g;
            ss.ix = modelSMW.hsteelTrait[ss.id].ix;
            ss.sx = modelSMW.hsteelTrait[ss.id].sx;
            ss.wx = modelSMW.hsteelTrait[ss.id].wx;

            let b = materialSteel.query(ss.material, ss.t);
            if (b == undefined) {
                b = materialSteel.query(ss.material, 99);
            }

            ss.f = b.f;
            ss.fv = b.fv;
            ss.fy = b.fy;

            return ss;
        },

        toHTML(data) {
            let a;
            a = `<li>截面尺寸为 $ ${data.h} \\times ${data.b} \\times ${data.tw} \\times ${data.t} $ ，</li>
                <li>$ ${data.material.toUpperCase()}， f_y= ${data.fy} N/mm^2， f= ${data.f} N/mm^2， f_v= ${data.fv} N/mm^2 $，</li>
                <li>$ I_x= ${data.ix} cm^4 $，</li>
                <li>$ S_x= ${data.sx} cm^3 $，</li>
                <li>$ W_x= ${data.wx} cm^3 $，</li>
                <li>间距为 $ ${data.distance} mm $。</li> `;
            return a;
        },
    },

    dsm: {
        fromDataDescription: {
            dsm_kind: "类型，'wall' 或 'round'。",
            dsm_thickness: "墙厚，以mm计。",
            dsm_round_parameter: "圆桩参数，如：'d850@600'，'d'不能少。",
            dsm_diameter:
                "桩径，以mm计，优先级高于 dsm_round_parameter，本字段不空的话，会覆盖掉 dsm_round_parameter的值。",
            dsm_distance:
                "桩间距，以mm计，优先级高于 dsm_round_parameter，本字段不空的话，会覆盖掉 dsm_round_parameter的值。",
        },

        fromData(raw) {
            let dsm = {
                strength: Number(raw.dsm_strength),
                kind: raw.dsm_kind.toLowerCase(),
                displayKind: "",
            };

            if (dsm.kind.toLowerCase() == "wall") {
                dsm.displayKind = `搅拌墙`;
                dsm.thickness = Number(raw.dsm_thickness);
                dsm.plainDescription = `${dsm.thickness}mm${dsm.displayKind}`;
                dsm.description = `$${dsm.thickness}mm$${dsm.displayKind}`;
            } else {
                dsm.displayKind = `搅拌桩`;
                let rp = raw.dsm_round_parameter;
                if (rp) {
                    rp = rp.split("@");
                    dsm.diameter = Number(rp[0].substr(1));
                    dsm.distance = Number(rp[1]);
                }
                if (raw.dsm_diameter) {
                    dsm.diameter = Number(raw.dsm_diameter);
                }
                if (raw.dsm_distance) {
                    dsm.distance = Number(raw.dsm_distance);
                }
                dsm.plainDescription = `d${dsm.diameter}@${dsm.distance}${dsm.displayKind}`;
                dsm.description = `$\\phi${dsm.diameter}@${dsm.distance}$${dsm.displayKind}`;
            }

            return dsm;
        },

        toHTML(data) {
            return `<li>${data.description} ，</li> 
                    <li>水泥土强度：$${data.strength} MPa$。</li>`;
        },
    },
};
