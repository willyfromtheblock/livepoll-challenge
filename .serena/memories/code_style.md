# Code Style & Conventions

## Formatting (Biome)
- **Indent style**: Tabs
- **Quote style**: Double quotes (JavaScript/TypeScript)
- **Organize imports**: Enabled (auto)
- **Scope**: Only `src/`, `.vscode/`, `index.html`, `vite.config.ts`
- **Excluded**: `src/routeTree.gen.ts`, `src/styles.css`

## TypeScript
- **Strict mode**: Enabled
- **No unused locals/parameters**: Enforced
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **verbatimModuleSyntax**: Enabled (use `import type` for type-only imports)

## React / Component Patterns
- Function components with `export default` for standalone components
- Route components use `createFileRoute` / `createRootRouteWithContext`
- Tailwind CSS utility classes for styling (v4, no config file needed)
- Icons from `lucide-react`

## Naming
- PascalCase for components and types
- camelCase for functions and variables
- File names: PascalCase for components (e.g., `Header.tsx`), lowercase for routes

## Module System
- ESM (`"type": "module"` in package.json)
- Path alias `@/*` → `./src/*`
