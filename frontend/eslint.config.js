import eslintPluginAstro from 'eslint-plugin-astro';
import pluginImport from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

/** @type { import("eslint").Linter.Config[] } */
export default [
    ...eslintPluginAstro.configs.recommended,
    ...eslintPluginAstro.configs["jsx-a11y-recommended"],
    {   
        plugins: {
            "unused-imports": unusedImports,
            "import": pluginImport,
        },
        rules: {
            "astro/no-set-html-directive": "off",
            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],
            semi: ["error", "always"],
            "import/order": [
                "warn",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        ["parent", "sibling", "index"],
                        "object",
                        "type",
                    ],
                    "newlines-between": "always",
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],
        }
    }
];