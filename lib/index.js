/**
 * @fileoverview This plugin makes `no-unused-expressions` rule friendly towards chai expect statements.
 * @author Ihor Diachenko
 */

const pjs = require('../package.json');

const plugin = {
    meta: {
        name: pjs.name,
        version: pjs.version,
    },
    rules: {
        'no-unused-expressions': require('./rules/no-unused-expressions')
    },
    processors: {}
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
    recommended: {
        plugins: {
            'chai-friendly': plugin
        },
        rules: {
            'chai-friendly/no-unused-expressions': 'error',
            'no-unused-expressions': 'off'
        }
    }
},)

module.exports = plugin;
