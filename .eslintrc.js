module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "amd": true,
        "jquery": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "google": "writable",
        "url": "writable",
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-console": "off",
        "react/prop-types": [1]
    }
};