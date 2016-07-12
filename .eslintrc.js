module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module'
    },
    rules: {
        'strict': [ 'error', 'global' ],
        'indent': [ 'error', 4 ],
        'linebreak-style': [ 'error', 'unix' ],
        'quotes': [ 'error', 'single' ],
        'semi': [ 'error', 'always' ]
    }
};