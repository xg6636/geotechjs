// 支撑轴压比计算
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2022/08/01 14:39:51
// last modified at 2023-11-09 11:55:17
// 
// copyright (c) 2022 - 2023 Jack Hsu



const concreteStrut = {
    getAxialStrength(a) {
        // param a: sample { width: "700", height: "800", concrete_level: "C30" }
        const s = Number(a.width) * Number(a.height);
        return materialConcrete.queryFc(a.concrete_level).value * s * 0.001
    },
    getAxialForce(a) {
        // param a: sample { pressure: 234, distance: 8.5, angle: 90, steps: 1, load_factor: 1.35 }
        let f = Number(a.pressure); // 围压
        f *= Number(a.distance); // 支撑间距
        f *= Number(a.load_factor); // 荷载系数
        f *= Number(a.steps); // 分担跨数
        const ang = Number(a.angle); // 支撑角度
        f = f / Math.sin(ang / 180 * Math.PI);
        return f
    },
    evaluate(a) {
        const f = this.getAxialForce(a);
        const r = this.getAxialStrength(a);
        const f_r = (f / r).toFixed(3);
        return `轴力: ${f.toFixed(3)} kN \n支撑强度: ${r.toFixed(3)} kN \n轴压比: ${f_r}`
    }
};
