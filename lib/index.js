/**
 * @fileoverview This plugin makes `no-unused-expressions` rule friendly towards chai expect statements.
 * @author Ihor Diachenko
 */

module.exports = {
    configs: {
        recommended: {
            plugins: ['chai-friendly'],
            rules: {
                'chai-friendly/no-unused-expressions': 'error',
                'no-unused-expressions': 'off'
            }
        }
    },
    rules: {
        'no-unused-expressions': require('./rules/no-unused-expressions')
    }
};
