// 钢材强度
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2023-11-03 14:39:51
// last modified at 2023-11-09 12:03:22
//
// copyright (c) 2023 Jack Hsu



const materialSteel = {
    basis: "GB50017-2017",

    q235: {
        t16: [215, 125, 320, 235, 370],
        t40: [205, 120, 320, 225, 370],
        t100: [200, 115, 320, 215, 370]
    },

    q345: {
        t16: [305, 175, 400, 345, 470],
        t40: [295, 170, 400, 335, 470],
        t63: [290, 165, 400, 325, 470],
        t80: [280, 160, 400, 315, 470],
        t100: [270, 155, 400, 305, 470]
    },

    q355: {
        t16: [305, 175, 400, 345, 470],
        t40: [295, 170, 400, 335, 470],
        t63: [290, 165, 400, 325, 470],
        t80: [280, 160, 400, 315, 470],
        t100: [270, 155, 400, 305, 470]
    },

    query(steelType, thickness) {
        let outJSON = function (a) {
            return { f: a[0], fv: a[1], fce: a[2], fy: a[3], fu: a[4] }
        };

        let inQ235 = function (th) {
            const a = Math.round(Number(th));
            const b = [16, 40, 100];
            let c = b.filter((x) => x >= a);
            if (c.length == 0) {
                return undefined;
            } else {
                return outJSON(materialSteel.q235[`t${c[0]}`]);
            }
        };

        let inQ345 = function (th) {
            const a = Math.round(Number(th));
            const b = [16, 40, 63, 80, 100];
            let c = b.filter((x) => x >= a);
            if (c.length == 0) {
                return undefined;
            } else {
                return outJSON(materialSteel.q345[`t${c[0]}`]);
            }
        };

        let inQ355 = function (th) {
            const a = Math.round(Number(th));
            const b = [16, 40, 63, 80, 100];
            let c = b.filter((x) => x >= a);
            if (c.length == 0) {
                return undefined;
            } else {
                return outJSON(materialSteel.q355[`t${c[0]}`]);
            }
        };
        
        const a = steelType.toLowerCase();
        switch (a) {
            case 'q235':
                return inQ235(thickness);
            case 'q345':
                return inQ345(thickness);
            case 'q355':
                return inQ355(thickness);
            default:
                return undefined;
        }
    }
};
