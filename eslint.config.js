"use strict";

const pluginChaiFriendly = require("./lib");

module.exports = [
    pluginChaiFriendly.configs.recommendedV9,
    {
        ignores: ["node_modules", "!.eslintrc.js", "examples"],
    }
]
