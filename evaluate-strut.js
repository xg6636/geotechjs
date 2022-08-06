// 支撑轴压比计算
// lib002
// created at 2022/08/01 14:39:51
// last modified at 2022/08/06 15:41:12
// 
// copyright (c) 2022 Jack Hsu



import { queryFc as queryConcreteFc } from "./material-concrete.js";

const concreteStrut = {
    getAxialStrength: function (strut) {
        // param strut: sample { width: "700", height: "800", concreteLevel: "C30" }
        var s = Number(strut.width) * Number(strut.height);
        return queryConcreteFc(strut.concreteLevel) * s * 0.001
    },
    getAxialForce: function (site) {
        // param site: sample { pressure: 234, distance: 8.5, angle: 90, steps: 1, loadFactor: 1.35 }
        var f = Number(site.pressure); // 围压
        f = f * Number(site.distance); // 支撑间距
        f = f * Number(site.loadFactor); // 荷载系数
        f = f * Number(site.steps); // 分担跨数
        var a = Number(site.angle); // 支撑角度
        f = f / Math.sin(a / 180 * Math.PI);
        return f
    },
    evaluate: function (strut, site) {
        var f = this.getAxialForce(site);
        var r = this.getAxialStrength(strut);
        var f_r = (f / r).toFixed(3);
        return "轴力: " + (f).toFixed(3) + "kN\n" + "支撑强度: "
            + (r).toFixed(3) + "kN\n" + "轴压比: " + f_r
    }
}
