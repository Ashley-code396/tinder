# Suitinder (Tinder-like dApp)

This repository contains a decentralized matchmaking application (named "Suitinder") with a Next.js client, a Node/TypeScript server, Move smart contracts, and Nautilus tooling for enclave support.

This README explains the project layout, development workflow, and how to run the different components locally.

## Table of contents

- Project overview
- Repository layout
- Tech stack
- Prerequisites
- Quickstart (dev)
- Running components individually
  - Server
  - Client
  - Contracts
  - Nautilus (enclave / local services)
- Environment variables
- Testing & linting
- Contributing
- Troubleshooting
- License

## Project overview

Suitinder is an experimental dApp that pairs a web client (Next.js) with a backend server and blockchain smart contracts written in Move. Nautilus provides enclave tooling and helper scripts used by the repository.

The client handles UI, wallet integration, and calls the server. The server stores user and event data (Prisma + PostgreSQL) and calls Sui/Move contracts. The `contracts/` folder contains Move sources and tests.

## Repository layout

Top-level folders:

- `client/` — Next.js front-end (React + TypeScript). Key files: `app/`, `components/`, `lib/`, `page.tsx`.
- `server/` — Node/Express backend in TypeScript. Uses Prisma and PostgreSQL. Key files: `app.ts`, `bin/www.ts`, `prisma/`, `routes/`, `services/`.
- `contracts/` — Move contracts and tests (`suitinder`, `profileNft`, `seal`).
- `nautilus/` — Enclave and tooling for running Nautilus services. Contains scripts and a Rust-based server under `src/nautilus-server`.

There are other supporting files and generated clients (e.g. `server/generated/prisma`).

## Tech stack

- Client: Next.js 15 (React 19), Tailwind CSS, TypeScript
- Server: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- Contracts: Move (Sui ecosystem)
- Enclave/Infrastructure: Nautilus (Rust), Containerfile, shell scripts

## Prerequisites

- Node.js (recommended v18+)
- npm, yarn or pnpm (any node package manager will work)
- PostgreSQL (or a hosted Postgres like Neon). A `DATABASE_URL` connection string is required for the server.
- Move toolchain to build/test contracts (if working with contracts)

Note: Some repository subfolders include their own scripts and runtime requirements. Use the subsections below.

## Quickstart (development)

1. Start the Postgres database or ensure `DATABASE_URL` is set to a reachable database.
2. Run the server locally (installs + prisma migrations).
3. Run the client in development mode.

Example commands (run from repository root):

```bash
# Server: install deps, generate prisma client, run migrations, start
cd server
npm install
# Generate the Prisma client (if needed)
npx prisma generate
# Apply migrations (creates and migrates DB schema)
npx prisma migrate dev --name init
npm start
```

In a new terminal, run the client:

```bash
cd client
npm install
npm run dev
```

Open the frontend at http://localhost:3000 (or the port Next.js prints). The server defaults to port `3009` unless `PORT` is set (see `server/bin/www.ts`).

## Running components individually

### Server

- Location: `server/`
- Start (development):

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm start
```

- Important files:
  - `server/app.ts` — Express app
  - `server/bin/www.ts` — server bootstrap (reads `process.env.PORT`)
  - `server/prisma/` — Prisma client and migrations
  - `server/routes/` — API endpoints

Notes:
- The server expects a `DATABASE_URL` environment variable. Use a `.env` file in `server/` (not committed) with:

```bash
# server/.env (example - DO NOT commit real credentials)
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
PORT=3009
FRONTEND_URL=http://localhost:3000
```

### Client

- Location: `client/`
- Start development:

```bash
cd client
npm install
npm run dev
```

- Build & start for production:

```bash
cd client
npm run build
npm run start
```

The client integrates with on-chain tooling and wallets (see `client/lib/` and `client/enokiwallets/`).

### Contracts (Move)

- Location: `contracts/` (specifically `contracts/suitinder/`, `contracts/seal/`, etc.)
- These are Move modules. Use the Move/Sui toolchain to build and test them.

Typical steps (depends on your Move/Sui toolchain):

```bash
cd contracts/suitinder
# build and run Move tests (tooling varies by environment)
# e.g. `move build` or the Sui equivalent — consult the Move/Sui docs
```

There are tests under `contracts/suitinder/tests` (Move test format).

### Nautilus (enclave & tooling)

- Location: `nautilus/`
- Nautilus contains container and shell scripts for running enclave-related tooling. See `nautilus/README.md` and `nautilus/UsingNautilus.md` for details.

Common helper scripts: `nautilus/run.sh`, `nautilus/update.sh`, `nautilus/register_enclave.sh`.

If you want to build/run the local Nautilus server (Rust):

```bash
cd nautilus/src/nautilus-server
# Follow the Rust/Cargo instructions in that directory (check `Cargo.toml`)
./run.sh    # may be provided for convenience
```

## Environment variables

The server and client depend on environment variables for runtime configuration. Common keys:

- `DATABASE_URL` — PostgreSQL connection string (required by server)
- `PORT` — server port (server defaults to `3009`)
- `FRONTEND_URL` — frontend origin used by the server (defaults to `http://localhost:3000`)

Do not commit secrets or connection strings to git. Use local `.env` files or a secrets manager.

## Testing & linting

- Client lints with `npm run lint` (see `client/package.json`).
- Move/contract tests live in `contracts/` and must be run with the Move/Sui toolchain.
- Server unit/integration tests: not included by default — consider adding Jest or Vitest for server-side tests.

## Contributing

If you plan to contribute:

- Follow repository coding conventions (TypeScript, small commits).
- Keep secrets out of commit history.
- Add tests for new behavior (frontend or Move contracts).
- Open a pull request and include a clear description and testing steps.

Suggested small improvements to add in follow-ups:

- Add GitHub Actions CI for lint/build/test for `client/`, `server/`, and `contracts/`.
- Add a `Makefile` or root-level `scripts/` to orchestrate starting all components locally.

## Troubleshooting

- If Prisma complains about `DATABASE_URL` missing, ensure `server/.env` exists and is loaded by your process runner.
- If Next.js fails to start, run `npm install` in `client/` and ensure Node version is compatible.
- For Move contract issues, ensure your Move/Sui toolchain version matches the contracts' `Move.toml` toolchain settings.

## Security & secrets

- Never commit `.env` files with credentials. Use environment-specific secrets managers when deploying.
- Rotate database and API keys if they are accidentally committed.

## License

Check the repository root for a `LICENSE` file. If none exists, ask the project owner which license should apply.

## Contact / Maintainers

For questions about the codebase, contact the repository owner or open an issue with a clear reproduction.

---

