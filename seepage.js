// 渗透估算
// lib005
// created at 2022/08/02 10:38:23
// last modified at 2022/08/02 10:52:15
// 
// copyright (c) 2022 Jack Hsu <120522448@qq.com>



var seepageJGJ120 = {
    specific: "jgj120-2012",
    runFormulaC01: function (a) {
        var kh = Number(a.c01D) * Number(a.c01Gamma);
        kh = kh / Number(a.c01Hw) / Number(a.c01Gammaw);
        return kh
    },
    runFormulaC02: function (a) {
        var kf = 2 * Number(a.c02Ld) + 0.8 * Number(a.c02D1);
        kf *= Number(a.c02Gamma1);
        kf = kf / Number(a.c02Deltah) / Number(a.c02Gammaw);
        return kf
    }
}