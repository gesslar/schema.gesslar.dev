import uglify from "@gesslar/uglier"
import eslintReact from "@eslint-react/eslint-plugin"
const files = ["generate-schema-docs.mjs"]

export default [
  ...uglify({
    with: [

      "lints-js", // default files: ["**/*.{js,mjs,cjs}"]
      "lints-jsdoc", // default files: ["**/*.{js,mjs,cjs}"]
      "node", // default files: ["**/*.{js,mjs,cjs}"]
      "react", // default files: ["src/**/*.{js,jsx,mjs,cjs}"]
    ],
    overrides: {
      "lints-js": {files},
      "lints-jsdoc": {files},
      "node": {files}
    }
  })
]
