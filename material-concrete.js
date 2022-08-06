// 混凝土强度
// lib001
// created at 2022/08/01 14:39:51
// last modified at 2022/08/04 19:17:02
// 
// copyright (c) 2022 Jack Hsu



var concrete = {
    standards: ["GB50010"],
    GB50010: {
        specific: "GB50010-2010",
        queryFck: function (a) {
            var fck = {
                "C15": 10.0,
                "C20": 13.4,
                "C25": 16.7,
                "C30": 20.1,
                "C35": 23.4,
                "C40": 26.8,
                "C45": 29.6,
                "C50": 32.4,
                "C55": 35.5,
                "C60": 38.5,
                "C65": 41.5,
                "C70": 44.5,
                "C75": 47.4,
                "C80": 50.2
            }
            return fck[String(a).toUpperCase()]
        },
        queryFc: function (a) {
            var fc = {
                "C15": 7.2,
                "C20": 9.6,
                "C25": 11.9,
                "C30": 14.3,
                "C35": 16.7,
                "C40": 19.1,
                "C45": 21.1,
                "C50": 23.1,
                "C55": 25.3,
                "C60": 27.5,
                "C65": 29.7,
                "C70": 31.8,
                "C75": 33.8,
                "C80": 35.9
            }
            return fc[String(a).toUpperCase()]
        }
    }
}
