# Task Completion Checklist

After completing a coding task, verify:

1. **Linting**: Run `bun run check` (Biome lint + format check)
2. **Type checking**: Ensure no TypeScript errors (strict mode is on)
3. **Imports**: Use `import type` for type-only imports (verbatimModuleSyntax)
4. **Style**: Tabs for indentation, double quotes for strings
5. **Database**: If schema changed, run `bun run db:generate` and potentially `bun run db:migrate`
6. **SSR safety**: Client-only APIs (localStorage, window) must be gated behind a `mounted` state check
