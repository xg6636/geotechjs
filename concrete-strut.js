// 支撑轴压比计算
// coded by Jack Hsu <jackhsu2010@gmail.com>
// created at 2022/08/01 14:39:51
// last modified at 2023-11-11 12:38:15
//
// copyright (c) 2022 - 2023 Jack Hsu

const concreteStrut = {
  getAxialStrength(a) {
    // param a: sample { width: "700", height: "800", concrete_level: "C30" }
    return (
      materialConcrete.queryFc(a.concrete_level) *
      Number(a.width) *
      Number(a.height) *
      0.001
    );
  },

  getAxialForce(a) {
    let f = Number(a.pressure); // 围压
    f *= Number(a.distance); // 支撑间距
    f *= Number(a.load_factor); // 荷载系数
    f *= Number(a.steps); // 分担跨数
    const ang = Number(a.angle); // 支撑角度
    f = f / Math.sin((ang / 180) * Math.PI);
    return f;
  },

  evaluate(a) {
    let out = {
      axialForce: 0.0,
      axialStrength: 0.0,
      axialFSRatio: 0.0,
      displayAxialFSRatio: "",
    };
    out.axialForce = this.getAxialForce(a);
    out.axialStrength = this.getAxialStrength(a);
    out.axialFSRatio = (f / r).toFixed(3);
    out.displayAxialFSRatio = `轴力: ${out.axialForce.toFixed(3)} kN 
                            \n支撑强度: ${out.axialStrength.toFixed(3)} kN 
                            \n轴压比: ${out.axialFSRatio}`;
    return out;
  },
};
