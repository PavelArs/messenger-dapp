const path = require("path");

const buildNextEslintCommand = (filenames) => {
  // Get relative paths for the Next.js files
  const files = filenames.map((f) =>
    path.relative(path.join("packages", "nextjs"), f)
  );

  // For Next.js, we need to cd into the directory first
  return `cd packages/nextjs && npm run lint -- --fix ${files.join(
    " "
  )} && npm run prettier -- --write ${files.join(" ")}`;
};

// const checkTypesNextCommand = () => "yarn next:typecheck";

const buildHardhatEslintCommand = (filenames) => {
  // Get relative paths for the Hardhat files
  const files = filenames.map((f) =>
    path.relative(path.join("packages", "hardhat"), f)
  );

  // For Hardhat, we need to cd into the directory first
  return `cd packages/hardhat && npm run prettier -- --write ${files.join(
    " "
  )} && npm run eslint -- --fix ${files.join(" ")}`;
};

module.exports = {
  "packages/nextjs/**/*.{ts,tsx}": [
    buildNextEslintCommand,
    // checkTypesNextCommand,
  ],
  "packages/hardhat/**/*.{ts,tsx}": [buildHardhatEslintCommand],
};
