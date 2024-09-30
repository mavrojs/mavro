# Contributing to Mavro

Thank you for your interest in contributing to the Mavro framework! This document outlines the process for contributing to the project, from code submissions to managing releases.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Code Quality and Testing](#code-quality-and-testing)
5. [Submitting Pull Requests](#submitting-pull-requests)
6. [Releasing and Publishing](#releasing-and-publishing)
7. [Managing Breaking Changes](#managing-breaking-changes)
8. [Communication and Support](#communication-and-support)

## Introduction

Mavro is a minimal, fast, and scalable Node.js framework built with Koa.js and TypeScript. It aims to simplify development by providing a modular structure for creating APIs and services. Our goal is to foster a collaborative community, continuously improving Mavro through contributions.

This document explains the processes and guidelines for contributing to Mavro, including development workflow, testing, and the release process.

## Getting Started

1. Fork the repository and clone it locally:
   ```bash
   git clone https://github.com/mavrojs/mavro.git
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Ensure you have the required tools:
   - Node.js 20.x
   - TypeScript
   - ESLint

4. Run the project in development mode:
   ```bash
   npm run dev
   ```

## Development Workflow

We use the following branching and versioning strategies:

- **Branches**:
  - `main`: The stable branch. Direct commits are prohibited.
  - `develop`: The primary development branch. Merge feature branches here.
  - `feature/{name}`: For new features or enhancements.
  - `fix/{name}`: For bug fixes.
  - `hotfix/{name}`: For urgent fixes to the `main` branch.
  - `release/{version}`: For preparing a new release.

- **Versioning**: We follow [Semantic Versioning](https://semver.org/).
  - **Major (X.0.0)**: Breaking changes.
  - **Minor (0.X.0)**: New features, no breaking changes.
  - **Patch (0.0.X)**: Bug fixes.

## Code Quality and Testing

### Linting and Formatting

All code should follow the project's ESLint rules and be formatted using Prettier. Run the following commands to check for issues:

```bash
npm run lint
npm run format
```

### Testing

We use Jest for testing. Ensure all tests pass before submitting a PR:

```bash
npm test
```

Tests are located in the `__tests__` directory and should follow the naming convention `*.test.ts`.

## Submitting Pull Requests

1. Ensure your branch is up-to-date with the `develop` branch.
2. Create a pull request targeting the `develop` branch.
3. Include a detailed description of your changes.
4. Follow the pull request template and link any related issues.
5. Ensure all tests pass and no linting errors exist.

## Releasing and Publishing

### Release Process

1. Merge changes from `develop` to a `release/{version}` branch.
2. Update the `CHANGELOG.md` with a summary of changes.
3. Once reviewed, merge `release/{version}` into `main` and tag the release.
4. Publish to npm:

   ```bash
   npm publish
   ```

5. After the release, merge `main` back into `develop` to synchronize branches.

### Publishing Packages

- All packages should follow the naming convention `@mavro/{package-name}`.
- Major releases must be approved by core maintainers.
- Minor and patch releases can be performed by any contributor with publishing rights.

## Managing Breaking Changes

Breaking changes require careful review and clear communication:

1. Open an issue or discussion proposing the breaking change.
2. Gain consensus from the core team before implementation.
3. Implement changes on a `feature/breaking-{name}` branch.
4. Update the documentation and `CHANGELOG.md`.
5. Ensure a clear migration path for users in the release notes.

## Communication and Support

- **GitHub Issues**: For bug reports, feature requests, and questions.
- **Discord**: Join our [Discord channel](https://discord.com/invite/your-channel) for real-time discussion.
- **Email**: Contact us at support@maya-agency.ma for any other inquiries.

We appreciate all contributions, big or small. Thank you for helping improve Mavro!