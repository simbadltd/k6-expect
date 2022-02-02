module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  "moduleNameMapper": {
    "^(k6)": "<rootDir>/test/__mocks__/k6.js"
  }
};