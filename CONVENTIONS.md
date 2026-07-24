# TaskFlow Project Conventions

## Folder Structure

app/
components/
lib/
prisma/
types/

- `app/` — Next.js App Router pages, layouts, and route handlers.
- `components/` — Reusable React components.
- `lib/` — Shared utilities and application helpers.
- `prisma/` — Database schema and migrations.
- `types/` — Shared TypeScript types.

## Naming Convention

- Components use PascalCase.

Example:
TaskCard.tsx
BoardHeader.tsx

- Functions and variables use camelCase.

Example:

```ts
createTask()
currentUser
Database models use PascalCase.
Example:
User
Board
Task
TypeScript Rules
Avoid using any.
Prefer explicit types when the type is not obvious.
Keep shared types inside types/.
Import Rules
Use absolute imports with @/.
Example:
import Button from "@/components/Button";
Avoid long relative imports:
../../../../components/Button
Component Rules
Server Components are the default.
Use Client Components only when browser APIs, state, or event handlers are required.
Environment Variables
Access environment variables through:
process.env
Never hardcode secrets or credentials.
```
