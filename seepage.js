// 渗透估算
// lib005
// created at 2022/08/02 10:38:23
// last modified at 2022/08/04 19:17:08
// 
// copyright (c) 2022 Jack Hsu



var seepage = {
    standards: ["JGJ120"],
    JGJ120: {
        specific: "JGJ120-2012",
        runFormulaC01: function (a) {
            // param a: sample {c01D: 3, c01Gamma: 18, c01Hw: 5, c01Gammaw: 9.8}
            var kh = Number(a.c01D) * Number(a.c01Gamma);
            kh = kh / Number(a.c01Hw) / Number(a.c01Gammaw);
            return kh
        },
        runFormulaC02: function (a) {
            // param a: sample {c02Ld: 3, c02D1: 2, c02Gamma1: 10, c02Deltah: 5, c02Gammaw: 9.8}
            var kf = 2 * Number(a.c02Ld) + 0.8 * Number(a.c02D1);
            kf *= Number(a.c02Gamma1);
            kf = kf / Number(a.c02Deltah) / Number(a.c02Gammaw);
            return kf
        }
    }
}
