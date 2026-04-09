# 🏠 Cohab

Cohab is a modern roommate management platform designed to eliminate household friction. It manages shared tasks, balances expenses (Tricount-style), and coordinates groceries.

## 🚀 Technology Stack

- **Monorepo**: [Nx](https://nx.dev) + pnpm workspaces
- **Frontend**: [Expo](https://expo.dev) (SDK 54) + React Native + [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind v5](https://www.nativewind.dev/) (Tailwind CSS)
- **Backend**: [Hono](https://hono.dev/) + Node.js
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/)
- **Shared Logic**: [Zod](https://zod.dev/) for cross-package validation and types

## 🎨 Design Language

Cohab uses a premium, clean design language focused on clarity and ease of use.

- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) - handled via the `Typography` component with built-in `weight` support.
- **Dark Mode**: Optimized with a deep Slate palette (`slate-950`) and glassmorphism surfaces.
- **Consistency**: All UI elements leverage a central `Typography` component and the `Card` system for unified elevation. Avoid manual font-weight class overrides.

## 📦 Project Structure

```text
cohab/
├── packages/
│   ├── ui/          # @cohab/ui - Mobile application (Expo)
│   ├── api/         # @cohab/api - Backend server (Hono)
│   └── shared/      # @cohab/shared - Universal schemas and types
├── nx.json          # Monorepo configuration
└── package.json     # Root orchestration
```

## 🛠️ Get Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development servers**

   ```bash
   # Start everything (API + UI)
   pnpm start

   # Start specific packages via Nx
   nx run @cohab/api:dev
   nx run @cohab/ui:start
   ```

3. **Storybook (UI Component Development)**
   ```bash
   cd packages/ui
   pnpm run storybook:ios   # or :android
   ```

## 📜 Development Guidelines

- **Architecture**: Follow Vertical Feature Slicing in the UI package.
- **Data Fetching**: Use TanStack Query (React Query) with centralized queries in `libs/queries.ts`.
- **Validation**: Every API response must be validated at runtime using the shared Zod schemas.

---

_Created with ❤️ for better shared living._
