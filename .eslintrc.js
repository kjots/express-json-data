module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module'
    },
    rules: {
        'arrow-spacing': [ 'error', { before: true, after: true } ],
        'brace-style': [ 'error', 'stroustrup', { allowSingleLine: true } ],
        'comma-dangle': [ 'error', 'never' ],
        'eqeqeq': [ 'error', 'always' ],
        'indent': [ 'error', 4, { SwitchCase: 1 } ],
        'keyword-spacing': [ 'error', { before: true, after: true } ],
        'linebreak-style': [ 'error', 'unix' ],
        'no-cond-assign': [ 'error', 'always' ],
        'no-empty': [ 'error', { allowEmptyCatch: true } ],
        'no-unneeded-ternary': [ 'error', { defaultAssignment: false } ],
        'no-var': 'error',
        'prefer-template': 'error',
        'quotes': [ 'error', 'single' ],
        'semi': [ 'error', 'always' ],
        'space-before-blocks': [ 'error', 'always' ],
        'strict': [ 'error', 'global' ],
        'yoda': [ 'error', 'never' ]
    },
    overrides: [
        {
            files: [ '**/*.spec.js' ],
            env: {
                mocha: true
            }
        }
    ]
};