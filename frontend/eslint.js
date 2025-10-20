export default {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // React specific
    "react/prop-types": "off", // CRA didn't force prop-types
    "react/react-in-jsx-scope": "off", // not needed in React 17+

    // General rules similar to CRA
    "no-unused-vars": "warn", // yellow squiggly for unused vars
    "no-console": "warn", // console.log gives warning
    "no-debugger": "warn", // debugger statement gives warning
    eqeqeq: ["warn", "always"], // CRA prefers === over ==
    curly: "warn", // warn if missing curly braces in blocks
  },
};
