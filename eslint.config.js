"use strict";

const pluginChaiFriendly = require("./lib");

module.exports = [
    {
        plugins: { "chai-friendly": pluginChaiFriendly },
        rules: {
            "no-unused-expressions": "off",
            "chai-friendly/no-unused-expressions": "error"
        },
    }
]
