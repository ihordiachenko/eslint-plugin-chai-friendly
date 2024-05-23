"use strict";

const pluginChaiFriendly = require("./lib");

module.exports = [
    pluginChaiFriendly.configs.recommended,
    {
        ignores: ["node_modules", "!.eslintrc.js", "examples"],
    }
]
