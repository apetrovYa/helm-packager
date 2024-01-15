module.exports = {
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    coveragePathIgnorePatterns: ['/node_modules/'],

    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: 'v8',

    // A list of reporter names that Jest uses when writing coverage reports
    coverageReporters: ['json', 'text', 'lcov', 'clover'],

    // An object that configures minimum threshold enforcement for coverage results
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },

    // The test environment that will be used for testing
    testEnvironment: 'node',

    // The glob patterns Jest uses to detect test files
    testMatch: [
        '**/test/**/*.ts?(x)',
        '**/?(*.)+(spec|test).ts?(x)',
    ],

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ['/node_modules/'],

    // The regexp pattern or array of patterns that Jest uses to detect test files
    // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

    // This option allows the use of a custom results processor
    // testResultsProcessor: "your-custom-results-processor",

    // A map from regular expressions to paths to transformers
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },

    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: ['/node_modules/'],

    // Indicates whether each individual test should be reported during the run
    verbose: true,

    // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
    watchPathIgnorePatterns: ['/node_modules/'],

    // Whether to use watchman for file crawling
    // watchman: true,
};