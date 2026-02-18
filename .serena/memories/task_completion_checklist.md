# Task Completion Checklist

After completing a coding task, verify:

1. **Linting**: Run `npm run check` (Biome lint + format check)
2. **Type checking**: Ensure no TypeScript errors (strict mode is on)
3. **Tests**: Run `npm run test` if tests exist for the modified area
4. **Imports**: Use `import type` for type-only imports (verbatimModuleSyntax)
5. **Style**: Tabs for indentation, double quotes for strings
6. **Database**: If schema changed, run `npm run db:generate` and potentially `npm run db:migrate`
