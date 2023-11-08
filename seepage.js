// 渗透估算
// lib005
// created at 2022/08/02 10:38:23
// last modified at 17:05 2023/11/8
// 
// copyright (c) 2022 - 2023 Jack Hsu



const seepage = {
    specific: ["JGJ120"],
    jgj120: {
        specific: "JGJ120-2012",
        runFormulaC01(a) {
            // param a: sample {d: 3, gamma: 18, hw: 5, gammaw: 9.8}
            let kh = Number(a.d) * Number(a.gamma);
            kh = kh / Number(a.hw) / Number(a.gammaw);
            return kh;
        },
        runFormulaC02(a) {
            // param a: sample {ld: 3, d1: 2, gamma1: 10, deltah: 5, gammaw: 9.8}
            let kf = 2 * Number(a.ld) + 0.8 * Number(a.d1);
            kf *= Number(a.gamma1);
            kf = kf / Number(a.deltah) / Number(a.gammaw);
            return kf;
        }
    }
}
