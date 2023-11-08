// 支撑轴压比计算
// lib002
// created at 2022/08/01 14:39:51
// last modified at 2023-11-08 10:00:39
// 
// copyright (c) 2022 - 2023 Jack Hsu



const concreteStrut = {
    getAxialStrength(strut) {
        // param strut: sample { width: "700", height: "800", concrete_level: "C30" }
        const s = Number(strut.width) * Number(strut.height);
        return concreteMaterialGB.queryFc(strut.concrete_level).value * s * 0.001;
    },
    getAxialForce(site) {
        // param site: sample { pressure: 234, distance: 8.5, angle: 90, steps: 1, load_factor: 1.35 }
        let f = Number(site.pressure); // 围压
        f *= Number(site.distance); // 支撑间距
        f *= Number(site.load_factor); // 荷载系数
        f *= Number(site.steps); // 分担跨数
        const a = Number(site.angle); // 支撑角度
        f = f / Math.sin(a / 180 * Math.PI);
        return f;
    },
    evaluate(strut, site) {
        const f = this.getAxialForce(site);
        const r = this.getAxialStrength(strut);
        const f_r = (f / r).toFixed(3);
        return `轴力: ${f.toFixed(3)} kN \n支撑强度: ${r.toFixed(3)} kN \n轴压比: ${f_r}`;
    }
}
