export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@Config/(.*)$': '<rootDir>/src/Config/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }]
    },
    testMatch: ['**/__tests__/**/*.test.(ts|tsx|js)'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    testEnvironmentOptions: {
        url: 'http://localhost'
    },
    moduleDirectories: ['node_modules', 'src'],
    verbose: false
};
