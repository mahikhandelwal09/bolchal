# Contributing to BolChal

Thank you for your interest in contributing to **BolChal**! We welcome community contributions, bug fixes, enhancements, and topic suggestions.

## Code of Conduct

Please be respectful, constructive, and encouraging in all discussions, pull requests, and issues.

## Development Workflow

1. **Fork the repository** on GitHub.
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/<your-username>/bolchal.git
   cd bolchal
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a topic branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Start development server**:
   ```bash
   npm run dev
   ```

## Coding Standards

- **TypeScript**: Strictly typed code without `any`.
- **Styling**: Follow existing CSS variable system and minimal aesthetic.
- **Linting**: Ensure code passes `npm run lint`.
- **Build**: Ensure `npm run build` succeeds cleanly before opening a pull request.

## Submitting Pull Requests

1. Commit your changes with clear, semantic commit messages (e.g., `feat: add new speaking niche`, `fix: timer pause transition`).
2. Push to your branch and open a Pull Request against `main`.
3. Provide a brief description of the changes and screenshots if UI changes were made.
