const config = require('../../.xo-config.cjs');

config.rules['@typescript-eslint/ban-ts-comment'] = 'off'
config.rules['@typescript-eslint/prefer-ts-expect-error'] = 'off'
config.rules['eslint-comments/no-unused-disable'] = 'off'

module.exports = config;
