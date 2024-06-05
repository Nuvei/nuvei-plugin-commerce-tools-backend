import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import swc from 'unplugin-swc';
import GithubActionsReporter from 'vitest-github-actions-reporter';

const reporters: any[] = ['default'];
const outputFile: any = {};

if (process.env.GITHUB_ACTIONS === 'true') {
    reporters.push('vitest-sonar-reporter', new GithubActionsReporter({ trimRepositoryPrefix: true }));
    outputFile['vitest-sonar-reporter'] = './reports/sonar-report.xml';
}

const coverageReporters = process.env.COVERAGE_REPORTERS ? process.env.COVERAGE_REPORTERS.split(',') : ['clover', 'json', 'lcov', 'text'];

if (process.argv.includes('--ui')) {
    coverageReporters.push('html');
}

const ignorePatterns = ['**/build/**', '**/types/**', '**/common/**'];

const testGlobs = 'packages/**/test/{*,unit,integration}/**/*.test.ts';
const coverageIgnorePatterns = [...ignorePatterns];

export default defineConfig({
    test: {
        environment: 'node',
        include: [testGlobs],
        exclude: ['**/build/**', '**/types/**', '**/common/**', '**/interfaces/**', 'node_modules/**', '**/packages/**/node_modules/**'],
        reporters,
        coverage: {
            exclude: coverageIgnorePatterns,
            provider: 'v8',
            reporter: coverageReporters
        },
        outputFile
    },
    plugins: [swc.vite(), tsconfigPaths()]
});
