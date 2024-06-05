import fs from 'node:fs';
import path from 'node:path';
import xml2js from 'xml2js';
import unixify from 'unixify';
import { getPackagePaths } from './utils/utils.js';

const updateFilePaths = (packagePath, fileEntries) => {
    if (packagePath.includes('\0')) {
        throw new Error('Invalid package path');
    }

    const packagePathSanitized = packagePath.replace(/^(\.\.(\/|\\|$))+/, '');
    for (const fileEntry of fileEntries) {
        fileEntry.$.path = unixify(path.resolve(path.join(packagePathSanitized, fileEntry.$.path)));
    }
};

const fileName = 'sonar-report.xml';
const outputDir = './reports/';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Get the list of all package paths
const packagePaths = getPackagePaths();

const aggregatedXml = {
    testExecutions: {
        $: { version: 1 },
        file: []
    }
};

for (const packagePath of packagePaths) {
    const packageJSON = path.join(packagePath, 'package.json');
    const reportsDir = path.join(packagePath, 'reports');

    // Skip if the package.json or the reports directory doesn't exist
    if (!fs.existsSync(packageJSON) || !fs.existsSync(reportsDir)) continue;

    const reportFile = path.join(reportsDir, fileName);

    // Skip if the report file doesn't exist
    if (!fs.existsSync(reportFile)) continue;

    // Read the test report for this package
    const testReport = fs.readFileSync(reportFile, 'utf8');
    const parsedXML = await xml2js.parseStringPromise(testReport);
    try {
        const fileEntries = parsedXML?.testExecutions?.file;
        if (fileEntries) {
            updateFilePaths(packagePath, fileEntries);
            aggregatedXml.testExecutions.file.push(...fileEntries);
        } else {
            console.log('No entries in file', reportFile);
        }
    } catch (error) {
        console.err('Failed to parse xml for fileName', error);
        throw error;
    }
}

const builder = new xml2js.Builder({ xmldec: { version: '1.0', encoding: 'utf8' } });
const xml = builder.buildObject(aggregatedXml);
fs.writeFileSync(path.join(outputDir, fileName), xml);
