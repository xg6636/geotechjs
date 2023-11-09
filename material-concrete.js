// 混凝土强度
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2022/08/01 14:39:51
// last modified at 2023-11-09 11:57:07
//
// copyright (c) 2022 - 2023 Jack Hsu



const materialConcrete = {
    queryFck(levelCode) {
        const a = this.byLevelCode(levelCode);
        if (a == undefined) {
            return undefined
        } else {
            return {
                basis: "GB50010-2010",
                value: a.fck
            }
        }
    },

    queryFc(levelCode) {
        const a = this.byLevelCode(levelCode);
        if (a == undefined) {
            return undefined;
        } else {
            return {
                basis: "GB50010-2010",
                value: a.fc
            }
        }
    },

    byLevelCode(c) {
        const a = {
            "C15": [7.2, 10],
            "C20": [9.6, 13.4],
            "C25": [11.9, 16.7],
            "C30": [14.3, 20.1],
            "C35": [16.7, 23.4],
            "C40": [19.1, 26.8],
            "C45": [21.1, 29.6],
            "C50": [23.1, 32.4],
            "C55": [25.3, 35.5],
            "C60": [27.5, 38.5],
            "C65": [29.7, 41.5],
            "C70": [31.8, 44.5],
            "C75": [33.8, 47.4],
            "C80": [35.9, 50.2]
        };
        const b = a[c.toUpperCase()];
        if (b == undefined) {
            return undefined
        } else {
            return {
                basis: "GB50010-2010",
                fc: b[0],
                fck: b[1]
            }
        }
    }
};
