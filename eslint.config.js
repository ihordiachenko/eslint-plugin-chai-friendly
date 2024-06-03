"use strict";

const pluginChaiFriendly = require("./lib");

module.exports = [
    pluginChaiFriendly.configs.recommendedFlat,
    {
        ignores: ["node_modules", "!.eslintrc.js", "examples"],
    }
]
