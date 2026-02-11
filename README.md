# Coloc App - Roommate Management Platform

A monorepo project for managing shared households, built with **Expo**, **React Native**, **Hono**, and **Nx**.

## Architecture

This project uses a monorepo structure managed by **Nx** and **pnpm workspaces**:

```
colocapp/
├── packages/
│   ├── ui/          # @colocapp/ui - Expo React Native app
│   └── api/         # @colocapp/api - Hono backend server
├── nx.json          # Nx configuration
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start all services

```bash
pnpm start
```

This will start both the **UI** (Expo app) and **API** (Hono server) simultaneously with streaming logs from both processes. You'll see prefixed output like:

```
[@colocapp/api:start] Server running on port 3000
[@colocapp/ui:start] Expo server started
```

### 3. Start individual services

If you prefer to run services separately:

```bash
# Start API only
nx run @colocapp/api:dev

# Start UI only
nx run @colocapp/ui:start
```

## Available Commands

| Command       | Description                            |
| ------------- | -------------------------------------- |
| `pnpm start`  | Start all packages with streaming logs |
| `pnpm build`  | Build all packages                     |
| `pnpm lint`   | Lint all packages                      |
| `pnpm format` | Format all packages                    |

## Development Features

- **Streaming Logs**: Nx is configured to show interleaved output from all running services
- **Parallel Execution**: Tasks run in parallel by default
- **Nx Cache**: Build artifacts are cached for faster rebuilds

## Learn More

### Expo

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction) - File-based routing

### Nx

- [Nx documentation](https://nx.dev/)
- [Nx run-many](https://nx.dev/nx-api/nx/documents/run-many)

### Backend Stack

- [Hono](https://hono.dev/) - Lightweight web framework
- [Prisma](https://www.prisma.io/) - Database ORM

---

Built with ❤️ for better roommate collaboration.
