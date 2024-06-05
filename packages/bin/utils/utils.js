import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import fg from 'fast-glob';

// Function to adjust the pattern to ensure correct depth matching
const adjustPatternForPackageJson = pattern => {
    // If the pattern ends with "/*", replace it with "/**/package.json" to match any depth
    if (pattern.endsWith('/**/*')) {
        const index = pattern.lastIndexOf('/*');
        return `${pattern.slice(0, Math.max(0, index))}/package.json`;
    }

    // For patterns without a specific structure like 'bin' or 'e2e', assume they are top-level directories
    // and look for package.json files directly inside them and any subdirectories
    return `${pattern}/**/package.json`;
};

const packageJsonCache = {};
export const getPackageJson = path => {
    if (packageJsonCache[path]) {
        return packageJsonCache[path];
    }

    const packageJsonPath = join(path, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8').toString());
    packageJsonCache[path] = packageJson;
    return packageJson;
};

const getWorkspaceDependencies = workspace => {
    const packageJson = getPackageJson(workspace);
    const { dependencies } = packageJson;
    const workspaceDependencies = [];

    // Filter out non-workspace dependencies
    for (const dep in dependencies) {
        if (dependencies[dep].startsWith('workspace:')) {
            workspaceDependencies.push(dep);
        }
    }

    return workspaceDependencies;
};

export const buildDependencyTree = packagePaths => {
    const tree = {};
    // Collect a map of all workspace packages
    for (const packagePath of packagePaths) {
        const packageJson = getPackageJson(packagePath);
        const { name } = packageJson;
        tree[name] = {
            location: packagePath
        };
    }

    // Now that we have a name, build out a dependency tree
    for (const packagePath of packagePaths) {
        const packageJson = getPackageJson(packagePath);
        const workspaceDependencies = getWorkspaceDependencies(packagePath);
        const { name } = packageJson;
        tree[name].workspaceDependencies = workspaceDependencies.map(dependency => ({
            name: dependency,
            location: tree[dependency].location
        }));
    }

    return tree;
};

export const getPackagePaths = () => {
    const workspaceConfig = getPackageJson(process.cwd()).workspaces;
    const packagePaths = [];
    for (const pattern of workspaceConfig.packages) {
        // Create an array of patterns to include the original pattern and exclude any node_modules directories
        const patterns = [adjustPatternForPackageJson(pattern), '!**/node_modules/**'];

        const matches = fg.sync(patterns);
        const packageDirs = matches.map(packageJsonPath => packageJsonPath.replaceAll('/package.json', ''));
        packagePaths.push(...packageDirs);
    }

    return packagePaths;
};
