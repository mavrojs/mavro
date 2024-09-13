# Contributing to mavro

Thank you for considering contributing to **mavro**! We appreciate your support in making this framework better. By contributing, you help improve the framework for everyone.

This guide will help you understand how to contribute, report bugs, suggest features, and set up your development environment for contributions.

## Code of Conduct

Please note that this project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Table of Contents
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Improving Documentation](#improving-documentation)
  - [Contributing Code](#contributing-code)
- [Development Workflow](#development-workflow)
  - [Setup Development Environment](#setup-development-environment)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Style Guidelines](#style-guidelines)
- [License](#license)

## How Can I Contribute?

### Reporting Bugs

If you encounter any bugs or unexpected behavior in **mavro**, please report them by following these steps:

1. **Search existing issues**: Make sure the issue hasn’t already been reported.
2. **Open a new issue**: If no similar issue exists, create a new one [here](https://github.com/mavrojs/mavro/issues) and include the following:
   - A descriptive title.
   - Steps to reproduce the bug.
   - The expected outcome.
   - What actually happened, including any error messages.
   - Your environment details (Node.js version, OS, etc.).

### Suggesting Features

We welcome new ideas to improve **mavro**! To suggest a feature:

1. **Check the roadmap**: Review the existing roadmap and issues to ensure the feature hasn’t already been planned.
2. **Open a new issue**: If the feature is new, create an issue [here](https://github.com/mavrojs/mavro/issues) with:
   - A clear and concise description of the feature.
   - How it will benefit the framework and its users.
   - Any potential challenges or alternatives.

### Improving Documentation

Good documentation is essential to helping others use and contribute to the project. If you notice any inconsistencies or missing details in the documentation:

1. **Fork the repository**.
2. **Make your changes** to the relevant documentation files (usually found in the `docs` directory).
3. **Submit a pull request** with a clear description of what was updated.

### Contributing Code

Contributing code is one of the most valuable ways to help. Here's how to do so effectively:

1. **Look for open issues**: Start by checking the open issues labeled `help wanted` or `good first issue`.
2. **Fork the repository**: Clone it to your machine and create a new branch for your changes.
3. **Make your changes**: Ensure the code is clean, well-commented, and follows the project’s style guidelines.
4. **Test your changes**: Run any necessary tests to ensure your contributions don’t introduce bugs.
5. **Submit a pull request**: Once you’re satisfied with your changes, open a pull request following the template provided.

## Development Workflow

### Setup Development Environment

1. **Fork the repository**: Click on the `Fork` button at the top of the GitHub page.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/mavro.git
   cd mavro
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
   This command starts the development server and watches for any code changes.

### Submitting Pull Requests

1. **Create a branch**: Always create a new branch for your work, for example:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. **Commit your changes**: Make clear, concise commits, and include descriptive commit messages.
   ```bash
   git add .
   git commit -m "Add feature X to improve Y"
   ```
3. **Push to your branch**:
   ```bash
   git push origin feature/my-new-feature
   ```
4. **Submit a pull request**: Go to your fork on GitHub, navigate to the **Pull Requests** section, and open a new pull request. Include:
   - A detailed description of the changes.
   - The issue number if your PR addresses an existing issue.
   - Screenshots or examples, if applicable.

### Pull Request Guidelines

- **One change per pull request**: Keep each PR focused on one specific change or issue.
- **Test before submitting**: Ensure your code passes all existing tests and add new tests where necessary.
- **Clear documentation**: Update the documentation when making changes that affect the framework’s functionality.

## Style Guidelines

We follow consistent coding conventions to keep the codebase clean and maintainable:

1. **Linting**: Run the linter before committing your code:
   ```bash
   npm run lint
   ```
2. **Code formatting**: Use **Prettier** for consistent code formatting. Run:
   ```bash
   npm run format
   ```
3. **File structure**: Follow the MVC pattern and maintain clear separation of concerns in your codebase.

## License

By contributing, you agree that your contributions will be licensed under the **MIT License**. For more details, refer to the [LICENSE](LICENSE) file.