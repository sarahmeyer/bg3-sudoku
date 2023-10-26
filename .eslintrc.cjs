module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        'eslint:recommended',
        "plugin:react/recommended",
        'plugin:@typescript-eslint/recommended',
        "plugin:prettier/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "parser": '@typescript-eslint/parser',
    "plugins": [
        "react",
        '@typescript-eslint',
        'prettier'
    ],
    "rules": {
        "prettier/prettier": "error"
    },
    "root": true
}