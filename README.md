# Bump Version based on branch prefix
> Smart version bumper for npm packages with branch-aware defaults

`bumpb`, `b` represents `branch`

[![npm version](https://img.shields.io/npm/v/bumpb)](https://www.npmjs.com/package/bumpb)
[![license](https://img.shields.io/npm/l/bumpb)](LICENSE)

## Features

- Interactive prompt for version selection
- Automatically suggests version bump type (`minor` or `patch`) based on branch prefix
- Creates a standardized commit with only `package.json` and `yarn.lock`/`package-lock.json`
- Works with both npm and yarn
- Zero configuration required

## Installation

You can use `npx bumpb` without installation (recommended). This way, you can always get latest version.

Or Install it as a dev dependency:

```bash
npm install -D bumpb
```
or
```bash
yarn add -D bumpb
```

## Usage
Run in your project directory:

```bash
npx bumpb
```

Or add `script` to your `package.json`:
```json
{
  "scripts": {
    "bumpVersion": "npx bumpb"
  }
}
```

Or if you installed as dev dependency:
```json
{
  "scripts": {
    "bumpVersion": "bumpb"
  }
}
```

## How It Works
The tool follows this logic:

1. Branch Detection  
   - `feat/`, `feature/`, `minor/` prefixes → `minor` bump
   - All others → `patch` bump

2. Package Manager  
Automatically detects whether to use `npm version` or `yarn version`

3. Git Integration  
Commits only `package.json` and the lockfile with message:  
`"chore: bump version"`

## Contributing
PRs are welcome! Please open an issue first to discuss proposed changes.

## License
MIT © helloint
