module.exports = {
    "prettier": true,
    "ignores": [
        "build"
    ],
    "rules": {
        "import/no-unresolved": "off",
        "import/no-unassigned-import": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/consistent-type-imports": ["error", { "disallowTypeAnnotations": false }],
        "@typescript-eslint/dot-notation": ["error", { "allowPrivateClassPropertyAccess": true }],
        "@typescript-eslint/no-unsafe-enum-comparison": "off",
        "@typescript-eslint/return-await": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/prefer-ts-expect-error": "off",
        "@typescript-eslint/prefer-promise-reject-errors": "off",
        "@typescript-eslint/naming-convention": [
            "error",
            {
                "selector": "typeLike",
                "format": ["PascalCase"]
            }
        ],
        "unicorn/template-indent": "off",
        "unicorn/prevent-abbreviations": "off",
        "unicorn/no-useless-promise-resolve-reject": "off",
        "unicorn/consistent-function-scoping": "off",
        "unicorn/no-useless-undefined": "off",
        "unicorn/prefer-event-target": "off",
        "new-cap": "off",
        "no-await-in-loop": "off",
        "no-warning-comments": "off",
        "n/prefer-global/process": "off",
        "no-unused-vars": "off",
        'import/no-duplicates': ['error', { 'prefer-inline': false }],
        "@typescript-eslint/member-ordering": [
        "error",
        { "default": ["public-static-field", "static-field", "static-method", "signature", "field", "constructor", "method"] }
        ]
    }
}
