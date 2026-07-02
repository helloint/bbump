#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import inquirer from 'inquirer';

// Check if the project uses Yarn (by checking for yarn.lock)
const isYarn = existsSync('yarn.lock');
// Yarn berry (v2+) signals: .yarnrc.yml config or .yarn/ cache/version folder.
// Yarn classic (1.x) uses .yarnrc (no .yml) and no .yarn/ directory.
const isYarnBerry = existsSync('.yarnrc.yml') || existsSync('.yarn');

// Get the current branch name
const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();

// Determine the default version type based on the branch prefix
const isFeatureBranch = currentBranch.startsWith('feat');
const defaultVersionType = isFeatureBranch ? 'minor' : 'patch';

// Define version bump options
const questions = [
    {
        type: 'list',
        name: 'versionType',
        message: 'Select the version type to bump:',
        choices: ['minor', 'patch'],
        default: defaultVersionType, // Dynamic default based on branch prefix
    },
];

// Prompt the user for selection
const { versionType } = await inquirer.prompt(questions);

try {
    // Execute version command based on the package manager
    // Yarn berry (v2+) uses positional strategy arg and does not create git tags.
    // Yarn classic (1.x) uses --<strategy> --no-git-tag-version.
    const versionCommand = isYarn
        ? (isYarnBerry
            ? `yarn version ${versionType}`
            : `yarn version --${versionType} --no-git-tag-version`)
        : `npm version ${versionType} --no-git-tag-version`;
    execSync(versionCommand, { stdio: 'inherit' });

    // Add only package.json and lockfile to Git
    const lockfile = isYarn ? 'yarn.lock' : 'package-lock.json';
    const filesToAdd = ['package.json'];
    if (existsSync(lockfile)) {
        filesToAdd.push(lockfile);
    }

    execSync(`git add ${filesToAdd.join(' ')}`, { stdio: 'inherit' });

    // Commit only the specified files with a fixed commit message
    execSync(`git commit -m "chore: bump version" ${filesToAdd.join(' ')}`, { stdio: 'inherit' });

    console.log(`Version bumped to ${versionType} and changes committed with message: 'chore: bump version'.`);
} catch (error) {
    console.error('Failed to bump version or commit changes:', error.message);
    process.exit(1);
}
