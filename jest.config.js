module.exports = {
  coverageThreshold: {
    global: {
      lines: 60
    },
  },
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  coverageReporters: ["json-summary"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  "moduleNameMapper": {
    "^(k6)": "<rootDir>/test/__mocks__/k6.js"
  }
};