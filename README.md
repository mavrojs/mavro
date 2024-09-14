<p align="center">
  <a href="https://otha.studio/oss/mavro">
    <img alt="mavro" width="95" src="./.github/resources/mavro-icon.svg">
    <h2 align="center">A minimal, fast, and scalable Node.js framework.</h2>
  </a>
</p>
<p align="center">
  <a href="https://github.com/mavrojs/mavro/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license">
  </a>
  <a href="https://www.npmjs.com/package/mavro">
    <img src="https://img.shields.io/npm/v/mavro.svg?style=flat" alt="npm version">
  </a>
  <a href="https://github.com/mavrojs/mavro/actions/workflows/runtime_build_and_test.yml">
    <img src="https://github.com/mavrojs/mavro/actions/workflows/runtime_build_and_test.yml/badge.svg" alt="(Runtime) Build and Test">
  </a>
  <a href="https://github.com/mavrojs/mavro/actions/workflows/compiler_typescript.yml">
    <img src="https://github.com/mavrojs/mavro/actions/workflows/compiler_typescript.yml/badge.svg?branch=main" alt="(Compiler) TypeScript">
  </a>
  <a href="https://github.com/mavrojs/mavro/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  </a>
</p>


**mavro** is a minimal, fast, and scalable Node.js framework built on Koa.js and powered by TypeScript. It simplifies backend development by offering a complete MVC architecture, a powerful CLI for generating APIs, and built-in features like authentication, caching, and mailing.

With mavro, you can quickly build robust and production-ready APIs while minimizing repetitive tasks and focusing on what truly matters: building high-quality applications.

## 🚀 Features

### **Core Features:**

- **Minimal CLI Tool**: Generate APIs, models, controllers, and routes effortlessly with:

  ```bash
  npm create api:apiname
  ```

- **MVC Architecture**: Organized codebase with a clear separation of concerns.
- **Authentication**: Support for JWT and session-based authentication with middleware for route protection.
- **Mail System**: Built-in support for SMTP and easy configuration for services like SendGrid.
- **Caching**: In-memory caching with optional Redis integration for improved performance.
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation for your APIs.
- **Service Providers**: Modular providers for features like caching and mailing, easily extendable.

## Philosophy

**mavro** combines the best of modern JavaScript and TypeScript development with minimalistic principles inspired by Koa.js. Its opinionated approach simplifies complex decisions and repetitive tasks, allowing developers to focus on delivering high-quality APIs with minimal friction. Every feature is designed with scalability, security, and maintainability in mind, ensuring that developers can ship production-grade applications faster with less overhead.

## 📦 Installation

To get started with mavro, you'll need Node.js and npm installed. Follow these steps to set up your project:

1. **Install mavro CLI globally:**

   ```bash
   npm install -g mavro-cli
   ```

2. **Create a new mavro project:**

   ```bash
   npm new-mavro my-api
   ```

3. **Navigate to your project directory and install dependencies:**

   ```bash
   cd my-api
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

## 📜 Usage

### **Creating an API:**

Use the CLI to generate new models, controllers, services, and routes:

```bash
npm create api:apiname
```

This command will scaffold the necessary files and set up basic routes for CRUD operations.

### **Authentication:**

Configure authentication by setting up JWT or session-based strategies in your `config` files. Use the provided middleware to protect your routes.

### **Mailing:**

Configure the mail system in `config/mail.js` and start sending emails using built-in methods.

### **Caching:**

Enable and configure caching in `config/cache.js`. Optionally, set up Redis for distributed caching.

### **API Documentation:**

Access auto-generated API documentation at `/docs` to view your API endpoints and their specifications.

## 🔧 Roadmap for Version 1.0

We are committed to making **mavro** stable, secure, and highly performant. The first stable version, **v1.0**, will include all the core features described above, plus optimizations and security enhancements. Our journey to stability will be divided into several phases:

### **Phase 1: Core Development Setup** (v0.1 - v0.2)

- Project setup and initialization.
- Basic MVC structure.
- Command-line interface (CLI) for generating projects and APIs.

### **Phase 2: Core Features Implementation** (v0.2 - v0.4)

- Implement authentication, mailing, and caching systems.
- Introduce the API documentation system.
- Build-in support for various databases via ORM integrations.

### **Phase 3: Additional Core Functionality** (v0.5 - v0.6)

- Introduce WebSocket support for real-time applications.
- Event-driven architecture for decoupled services.
- Background jobs and task scheduling support.

### **Phase 4: Testing & Optimization** (v0.7 - v0.8)

- Unit testing and integration testing for stability.
- Performance optimizations for production use.

### **Phase 5: Public Beta Release & Examples** (v0.8 - v0.9)

- Release beta version for public use.
- Create example applications demonstrating mavro’s features.
- Gather feedback from the community.

### **Version 1.0: Stable Release** (v1.0)

- Final round of optimizations and feature polishing.
- Official stable release.

The goal of **Version 1.0** is to provide a solid foundation for developers, offering all the key features needed to build fast, secure, and scalable APIs. Subsequent versions will focus on expanding the ecosystem and integrating more advanced features.

## 🤝 Contributing

We are looking for contributors to help us build mavro into the go-to framework for JavaScript and TypeScript developers. Whether you're fixing bugs, adding new features, or improving the documentation, we welcome all contributions. Please check out our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started or join our community on [Discord](https://discord.gg/jJK5kZx84B).

## 📜 License

mavro is licensed under the [MIT License](LICENSE). See the LICENSE file for more information.

## 🌐 Contact

For questions, suggestions, or support, feel free to reach out to us on [GitHub Discussions](https://github.com/mavrojs/mavro/discussions) or join our community on [Discord](https://discord.gg/jJK5kZx84B).
