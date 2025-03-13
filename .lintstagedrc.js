const path = require("path");

const buildNextEslintCommand = (filenames) =>
  `yarn run nextjs:lint:fix --file ${filenames
    .map((f) => path.relative(path.join("packages", "nextjs"), f))
    .join(" --file ")}`;

// const checkTypesNextCommand = () => "yarn next:typecheck";

const buildHardhatEslintCommand = (filenames) =>
  `yarn run hardhat:lint:fix ${filenames
    .map((f) => path.relative(path.join("packages", "hardhat"), f))
    .join(" ")}`;

module.exports = {
  "packages/nextjs/**/*.{ts,tsx}": [
    buildNextEslintCommand,
    // checkTypesNextCommand,
  ],
  "packages/hardhat/**/*.{ts,tsx}": [buildHardhatEslintCommand],
};
