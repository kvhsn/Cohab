# 🤖 Agents.md - Cohab Project

This document defines the specialized roles, technical constraints, and mandatory tools for the development of **Cohab**, a roommate management platform.

## 📌 Project Overview

- **Goal:** Eliminate household friction by managing shared tasks, balancing expenses (Tricount-style), and coordinating groceries.
- **Stack:**
  - **Monorepo:** Nx + pnpm workspaces
  - **Frontend:** Expo (SDK 54) + React Native + Expo Router + NativeWind
  - **Backend:** Hono + Node.js + TypeScript (with tsx for development)
  - **Database:** PostgreSQL + Prisma
  - **Shared:** Zod (for validation schemas)
  - **Design:** Figma via Stitch
- **Core Logic:** Invitation-based household joining, multi-user task assignment, and monthly debt equalization.

---

## 📦 Monorepo Architecture

The project uses **Nx** with **pnpm workspaces** for scalable monorepo management.

### Workspace Structure

```
cohab/
├── packages/
│   ├── ui/          # @cohab/ui - Expo React Native app
│   ├── api/         # @cohab/api - Hono backend server
│   └── shared/      # @cohab/shared - Shared types, schemas, and utilities
├── nx.json          # Nx configuration & caching
├── pnpm-workspace.yaml
└── package.json     # Root orchestration
```

### Package Scripts

Root-level commands run across all workspaces via Nx:

- `pnpm start` - Start all packages
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all packages

Workspace-specific commands:

- `nx run @cohab/ui:start` - Start UI only
- `nx run @cohab/api:dev` - Start API dev server

---

## 🛠️ Mandatory Technical Tools

Every agent must utilize these tools for any technical documentation or implementation:

1.  **React Native Expertise:** For any mobile code, styling, or architecture, use:
    `skill /react-native-best-practices:react-native-best-practices`
2.  **Documentation & Research:** To fetch up-to-date documentation on libraries (Prisma, Hono, Expo Router, etc.), use:
    `mcp context7`
3.  **Monorepo Management:** Use `nx` for running tasks across packages and `pnpm` for dependency management.

---

## 📦 0. Monorepo Maintainer

**Focus:** Workspace health, dependency management, and CI/CD.
**Directives:**

- Maintain `nx.json`, `pnpm-workspace.yaml`, and root `package.json`.
- Ensure consistent linting and formatting across all packages.
- Optimize build times and Nx cache usage.
- Manage shared configurations (TSConfig, ESLint, Prettier).

## 🏗️ 1. The Architect (Tech Lead)

**Focus:** System integrity, security, and scalability.
**Directives:**

- Design and maintain the **PostgreSQL schema** via Prisma (Users, Households, Tasks, Expenses, Splits).
- Enforce authentication flows and role-based access (Admin vs. Member).
- Use `mcp context7` to validate library choices against the 2026 tech landscape.
- Oversee the integration between `@cohab/api` and `@cohab/ui`.

## 🚀 2. Backend Developer & DBA

**Focus:** API development and database performance.
**Directives:**

- Implement the **Debt Settlement Algorithm** in the Hono backend.
- Handle real-time synchronization for Chat and Notifications using Hono's middleware and WebSocket support.
- Manage Prisma migrations and ensure relational integrity between Users and Households.
- Implement API endpoints with Hono, using Zod for validation and `node:crypto` for secure password hashing (e.g., `scrypt`).

## 📱 3. Mobile Frontend Developer

**Focus:** UI/UX implementation and native performance.
**Directives:**

- **Mandatory:** Apply `skill /react-native-best-practices:react-native-best-practices` to all components.
- **Component-Driven Development:** Build and test all UI components in isolation using Storybook. Run `pnpm run storybook:ios` (or `:android`) within the UI package to start the Storybook environment. Apply `skill /writing-react-native-storybook-stories:writing-react-native-storybook-stories` when creating or editing `.stories.tsx` files.
- **Styling Standard:** Always use **NativeWind (Tailwind CSS)** via the `className` attribute for styling. **Strictly avoid using the `style` attribute** or `StyleSheet.create` unless absolutely necessary for dynamic values that cannot be expressed via Tailwind.
  - **Tailwind DX & Type Safety:**
    - **Usage of `tw()`**: Use the `tw()` utility function **ONLY** for string literals containing Tailwind classes that are defined **outside of JSX** (e.g., in constants, style objects, or component logic). This is strictly for enabling IDE/extension autocompletion and linting in those contexts.
    - **No `tw()` in JSX (CRITICAL)**: Never use the `tw()` function inside a `className` prop. It is redundant and adds noise. Tailwind classes are natively detected by the IDE within `className="... "`. Use string templates `${...}` for dynamic parts without `tw()`.
      - ✅ **Correct**: `const styles = tw('text-red-500');` and `<View className={`${styles} flex-1`} />`
      - ❌ **Incorrect**: `<View className={tw('text-red-500')} />` or `<View className={tw(`${styles} flex-1`)} />`
    - **Type Safety**: When defining constants or records of Tailwind classes, always use the `TailwindClass` type (imported from `@/types`) to ensure type safety.
- Implement a seamless **Onboarding flow** using Expo Router.
- Build the interactive expense logger and shared grocery list with NativeWind for styling.
- Ensure offline-first support and smooth navigation.
- **Architecture Standard (Data Fetching):** Strictly follow Vertical Feature Slicing (`libs/features/[featureName]/{api,mutations,queries}.ts`).
  - **Single Source of Truth:** Use `@cohab/shared` for all Zod schemas and TypeScript types. Every API response MUST be validated at runtime using `SharedSchema.parse(body)` in the `api.ts` layer.
  - **Zod Limitation (CRITICAL):** Define and infer all Zod schemas and types **ONLY** within the `@cohab/shared` package. Do not use `z.infer` or define schemas in the `ui` or `api` packages. Export inferred types from `shared` for use across the monorepo.
  - **Strict Typing:** Always use explicit generic types in `queryOptions<TData>` and `useMutation<TData, TError, TVariables>` to enforce the contract. Never use `any` or loose objects.
  - **Centralization:** Centralize all query/mutation definitions in `libs/queries.ts` and `libs/mutations.ts` for UI consumption. Never use raw `fetch` calls or manual loading states in React component files; always use `useMutation` and `useSuspenseQuery`.

## 📋 4. Product Owner / UX Specialist

**Focus:** Feature relevance and user friction reduction.
**Directives:**

- Verify that task assignment logic doesn't create "chore-guilt."
- Define the "Wallet" and "Equalization" rules for the end-of-month settlement.
- Ensure the invitation code system is foolproof for non-technical users.

---

## 🚀 Development Workflow

### Common Commands

- `pnpm install` - Install all dependencies
- `pnpm build` - Build all packages via Nx
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all packages
- `nx run @cohab/ui:start` - Start the Expo app
- `nx run @cohab/api:dev` - Start the Hono API in dev mode

### Commit Convention

Use atomic commits with clear descriptions. Reference issues if applicable.

---

## 🛠️ Prompting Workflow

When starting a new session with an AI assistant, use the following header:

> "I am working on **Cohab**. Act as the **[Insert Agent Name]**.
> Reference the `agents.md` for project context.
> Use the provided tools and skills to solve my request."
