# Contributing to StreamdownRN

Thank you for your interest in contributing to StreamdownRN! This document provides guidelines for contributors.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/darkresearch/streamdown-rn.git
cd streamdown-rn
```

2. Install dependencies:
```bash
npm install
```

3. Run type checking:
```bash
npm run type-check
```

4. Build the package:
```bash
npm run build
```

## Development Workflow

### Making Changes

1. Create a branch from `main`:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes in the `src/` directory

3. Run type checking to ensure no TypeScript errors:
```bash
npm run type-check
```

4. Build to verify everything compiles:
```bash
npm run build
```

### Testing

While formal tests are being added, please manually test your changes by:

1. Building the package: `npm run build`
2. Using `npm link` to test in a React Native project
3. Verifying markdown rendering works correctly
4. Testing with streaming content (incomplete markdown)
5. Testing dynamic component injection if applicable

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and single-purpose

## Pull Request Guidelines

1. **One feature per PR** - Keep changes focused
2. **Descriptive title** - Clearly state what the PR does
3. **Description** - Explain the why and how of your changes
4. **Update README** - If adding features, document them
5. **Check types** - Ensure `npm run type-check` passes

### Good PR Example

```
Title: Add support for custom heading styles

Description:
Adds a new `headingStyles` prop that allows users to customize
the appearance of markdown headings.

Changes:
- Add headingStyles prop to StreamdownRN
- Update theme types to include heading style options
- Add documentation to README
- Preserve backward compatibility with default styles

Fixes #42
```

## Reporting Issues

When reporting bugs, please include:

- **React Native version**
- **StreamdownRN version**  
- **Platform** (iOS/Android/Web)
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Code sample** (if possible)

## Feature Requests

We welcome feature requests! Please:

- Check if it's already been requested
- Explain the use case clearly
- Provide examples if possible
- Consider if it fits the core mission (streaming markdown for AI chat)

## Questions?

- Open a GitHub Discussion for questions
- Check existing issues and PRs
- Read the README thoroughly

## License

By contributing to StreamdownRN, you agree that your contributions will be licensed under the Apache License 2.0.

