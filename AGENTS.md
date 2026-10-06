# Project Instructions

Read this file before every task.

## About This Project

Leave-Time Assistant is a calendar-aware web app that helps users see their upcoming events, estimated commute times, and when to leave. The product requirements are in `docs/research/PRD.md`.

## Product Scope

- Follow the PRD; do not add features outside its MVP scope.
- Keep Google Calendar integration read-only. Do not create or edit calendar events.
- The Today view shows the day's events in time order and refreshes event data at least once per minute. Make calendar connection and sync failures, and the last successful sync time, visible; never present failed or stale data as a successful current sync.
- For events with a destination, show a commute estimate for the selected travel mode (drive, subway, bus, or bike) and calculate leave-by time as event start minus commute time. Do not add preparation or arrive-early buffers.
- If OpenTripPlanner returns no route for a non-online event with a destination, use a 30-minute estimate. Events without a destination must not show a fabricated commute estimate or leave time.
- Browser push notifications are optional and require permission. The settings toggle must show permission status and prompt for permission when enabled. Notify at the calculated leave time when permission is granted and an estimate is available.
- The ESP32 display is optional. Keep the web app usable without it; support one display per user on the same Wi-Fi and show the next event and its leave countdown when available.
- Do not add AI-generated recommendations, live route rechecking, calendar editing, other calendar providers, or other features explicitly out of scope in the PRD.

## Stack and Installed Dependencies

- Next.js 16.3.5 App Router, React 19.2.8, and TypeScript 5.9.3.
- Tailwind CSS 4.3.3 for styling.
- UI: shadcn CLI 4.21.2 configured with Base UI (`@base-ui/react` 1.8.0), plus `class-variance-authority` 0.7.1, `cn` 0.4.0, and `tw-animate-css` 1.4.0. Icons: `lucide-react` 1.52.0.
- Installed development tooling: ESLint 9.39.5, `eslint-config-next` 16.3.5, `@tailwindcss/postcss` 4.3.3, and React/Node type packages.
- The installed dependencies do not include Google Calendar/API authorization, OpenTripPlanner, push-notification services, or ESP32 communication libraries. Do not assume an integration exists because it is in the PRD; ask before adding dependencies and implement integrations only within the requested scope.
- Use the existing `@/components/ui` components and `@/lib/utils` helper where appropriate. When adding shadcn components, document them in `docs/components.md` (create or update that file as needed).

## Commands

Run these from `project-1/`:

- `npm run dev` — start the development server.
- `npm run build` — build the app.
- `npm run start` — run the production server.
- `npm run lint` — run ESLint.
- `npx shadcn@latest add <component-name>` — add a shadcn component.

## Code Style

- Use TypeScript and React patterns appropriate to the Next.js App Router; keep server and client components intentional.
- Use Tailwind classes. No separate CSS files. Prefer Tailwind's spacing utilities over arbitrary pixel values for spacing and sizing; reserve arbitrary values for custom typography or layout geometry that has no suitable utility.
- Keep Tailwind classes simple so they're easy to debug and maintain.
- Keep reusable UI in `components/`, shadcn UI primitives in `components/ui/`, and shared helpers in `lib/`.
- Use clear, descriptive names and follow the existing project formatting and component patterns.
- Put sections into their own component, so that code is easy to read from a top-level and put them inside `components/`.

## Rules

- Do not add dependencies without asking first.
- Read `docs/research/PRD.md` before implementing product features.
- Preserve working behavior and keep changes scoped to the requested task and PRD.
- Never commit `.env.local`, API keys, or other secrets. Handle calendar authorization, location, and user preferences securely.
- When implementing ESP32 support, include firmware/source code and upload instructions in `README.md`, as required by the PRD.

## How to Talk to Me

- Keep explanations short and identify the files changed.
- Ask before making decisions that significantly affect scope or implementation.
- Stop after the requested task so I can test it manually.
