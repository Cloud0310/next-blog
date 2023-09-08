// prettier.config.js
module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "./tailwind.config.js",
  arrowParens: "avoid",
  bracketSpacing: true,
  endOfLine: "crlf",
  semi: true,
  printWidth: 120,
  trailingComma: "none",
  overrides: [
    {
      files: "*.css",
      options: {
        tabWidth: 4,
      },
    },
  ],
};
