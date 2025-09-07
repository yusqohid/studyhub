# Contributing to StudyHub

We love your input! We want to make contributing to StudyHub as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project.

## Report bugs using GitHub's [issue tracker](https://github.com/yusqohid/studyhub/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yusqohid/studyhub/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/studyhub.git`
3. Install dependencies: `npm install`
4. Create `.env.local` from `.env.example` and add your credentials
5. Start development server: `npm run dev`

## Code Style

- We use TypeScript for type safety
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### ESLint and Prettier

This project uses ESLint for linting. Make sure to run `npm run lint` before submitting a PR.

## Commit Messages

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` code style changes (formatting, etc.)
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Example:
```
feat: add AI-powered note summarization
fix: resolve authentication redirect issue
docs: update installation instructions
```

## Project Structure

Please familiarize yourself with the project structure:

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── contexts/           # React contexts for state management
├── firebase/           # Firebase configuration and utilities
├── lib/               # Utility functions
└── types/             # TypeScript type definitions
```

## Adding New Features

1. **Discuss First**: For major features, please open an issue first to discuss
2. **Follow Patterns**: Look at existing code to understand patterns
3. **Type Safety**: Ensure full TypeScript coverage
4. **Testing**: Add appropriate tests for new features
5. **Documentation**: Update README.md if needed

## Code Review Process

1. All submissions require review before merging
2. We may ask for changes via code review comments
3. Once approved, we'll merge your PR
4. We'll do our best to respond to PRs within a week

## Community Guidelines

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Questions?

Don't hesitate to ask questions by creating an issue or discussion. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
