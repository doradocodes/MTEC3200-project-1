# Out the Door

Out the Door is a calendar-aware web app concept for seeing today's plans, estimating commute time, and knowing when to leave. The page shows a sample schedule until Google Calendar (read-only) is connected; routing integrations are not configured yet.

## Project Structure

```text
.
├── app/                    # Next.js routes, root layout, and global styles
├── components/             # Page sections and reusable UI
│   └── ui/                  # Shared UI primitives
├── docs/
│   ├── research/            # Product requirements and research
│   └── wireframes.jpg       # Interface wireframe
├── lib/                     # Shared data, formatting, and utilities
├── public/                  # Static assets
├── package.json             # Dependencies and npm scripts
├── components.json          # shadcn/ui configuration
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── postcss.config.mjs       # PostCSS and Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

The main page is composed in `app/page.tsx`. Its sections are in `components/`, while shared travel-mode data, types, and time-formatting helpers are in `lib/home-page.ts`.

## Google Calendar Setup

1. In Google Cloud Console, enable the Google Calendar API and create an OAuth client (Web application).
2. Add an authorized redirect URI, e.g. `http://localhost:3000/api/google/callback`.
3. Create `.env.local` (never commit it):

```text
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
SESSION_SECRET=<long random string, e.g. `openssl rand -base64 32`>
```

The app requests only the `calendar.readonly` scope. The refresh token is stored encrypted in an httpOnly cookie. Add your Google account as a test user while the OAuth consent screen is in testing mode.

## Getting Started

Install dependencies and start the development server from the repository root:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `npm run dev` starts the development server.
- `npm run lint` runs ESLint.
- `npm run build` creates a production build.
- `npm run start` serves the production build.

## Stack

The app uses Next.js App Router, React, TypeScript, and Tailwind CSS. UI primitives use shadcn/ui with Base UI, and icons come from Lucide.