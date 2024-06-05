import fs from 'node:fs';
import path from 'node:path';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import { getPackagePaths } from './utils/utils.js';

// Get the list of all package paths
const packagePaths = getPackagePaths();

// Create a coverage map to hold the combined coverage data
const coverageMap = libCoverage.createCoverageMap();

for (const packagePath of packagePaths) {
    const packageJSON = path.join(packagePath, 'package.json');
    const coverageDir = path.join(packagePath, 'coverage');

    // Skip if the package.json or the coverage directory doesn't exist
    if (!fs.existsSync(packageJSON) || !fs.existsSync(coverageDir)) continue;

    const coverageFile = path.join(coverageDir, 'coverage-final.json');

    // Skip if the coverage file doesn't exist
    if (!fs.existsSync(coverageFile)) continue;

    // Read the coverage report for this package
    const coverageReport = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));

    // Merge the coverage report into the coverage map
    coverageMap.merge(coverageReport);
}

// Define the coverage context
const context = libReport.createContext({
    dir: 'coverage',
    coverageMap
});

// Create and execute the lcov report
const report = reports.create('lcov', {});
report.execute(context);

// Create and execute the text report
const textReport = reports.create('text', { maxCols: 200 });
textReport.execute(context);

// Create and execute the text-summary report
const textSummaryReport = reports.create('text-summary', {});
textSummaryReport.execute(context);

// Create and execute the json report
const jsonReport = reports.create('json', {});
jsonReport.execute(context);
