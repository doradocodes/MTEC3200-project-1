# Product Requirements Document: Leave-Time Assistant

## Project Overview

People can know when an event starts and still arrive late because they lose track of time, underestimate the transition, or miss a schedule change. This is especially costly when a day breaks from its normal routine: people may rush, skip meals, lose focus, spend money on last-minute transport, or arrive after a commitment has begun.

The MVP is a lightweight calendar-aware leave-time assistant. It reads upcoming Google Calendar events, estimates commute time to events with a location, and shows when the user needs to leave. The web app provides a Today view, calendar and location settings, and a top-of-screen status bar for sync health. Browser push notifications can alert the user at leave time. An ESP32 display is optional; users with one can show their next event and leave countdown on it.

The MVP is a deterministic scheduling tool; it does not require AI-generated recommendations. AI may be used to help build the product, but AI functionality is not part of the product scope.

### MVP goals

- Reduce the effort and attention required to track the next scheduled transition.
- Give users a clear commute-time estimate and “leave by” time for events with locations.
- Keep calendar and event information refreshed once per minute and make sync health visible.
- Make the next event and its leave countdown visible at a glance, with an optional ESP32 display.
- Test whether users trust the calculated commute time and find a leave-time notification useful.

### Out of scope

- Creating or editing calendar events.
- Apple Calendar integration.
- Booking rides or buying transit fares.
- Multi-stop day planning.
- Live route rechecking and automatic delay-based alert changes.
- Learning user habits, sharing ETAs, or providing widgets and watch support.
- Preparation-time and arrive-early buffers or “start getting ready” reminders.

## Target users

People with work, school, or personal schedules who sometimes lose track of time or underestimate the time needed to transition to an event. The initial audience is people whose routines vary or whose schedules change, including students and workers moving between locations.

Research illustrates several related situations:

- A student mentally calculates whether there is time to eat and travel between class and a shift, losing focus during class.
- A worker is late when an in-person meeting breaks their usual work-from-home routine.
- A teacher has a calendar but does not fully trust it when schedule details become outdated.

The product should reduce reliance on memory and repeated manual calculations without asking users to maintain extra “leave at” entries in their calendars.

## Skills Required

The technologies and integration skills needed to build the MVP:

- NextJs (required)
- Vercel (required)
- TypeScript and React
- Google Calendar API read access and authorization
- OpenTripPlanner for supported-mode travel-time estimates
- Browser push notifications and service worker support
- ESP32 firmware and communication with the web app over the user's Wi-Fi
- Secure handling of calendar authorization, location, and user preferences

## Key Features

### Milestone 1 — Calendar-aware “Today” and sync status

- Let a user connect Google Calendar and select which of their calendars the assistant reads.
- Read events and show the day's schedule in a Today view, ordered by event time.
- Refresh calendar data and the app's displayed event information at least once per minute.
- Display calendar connection and sync failures in a status bar at the top of the app. Show when the last successful sync occurred so users can tell when event information may be stale.
- Keep calendar data read-only: the MVP does not create or edit events.

**Validation:** A user can connect Google Calendar and see the selected calendars' events in the Today view. Event data refreshes automatically once per minute. A simulated authorization or sync failure appears in the top status bar and is not presented as a successful, current sync.

### Milestone 2 — Commute estimates, leave time, and optional ESP32

- Let the user choose a starting location by granting access to their current location or saving a home address in settings.
- Let the user choose a travel mode: drive, subway, bus, or bike.
- For events that have a destination, use OpenTripPlanner to estimate commute time for the selected travel mode.
- If OpenTripPlanner cannot return a route for a non-online event with a destination, use a default 30-minute commute estimate.
- Show the commute estimate and calculate the leave-by time as event start time minus estimated commute time. Do not add preparation or arrive-early buffers.
- Allow the user to enable browser push notifications, and send a notification at the calculated leave time for an event with a commute estimate, including the 30-minute fallback.
- Include a “Notifications enabled” toggle in settings that shows notification permission status and prompts the user to grant browser notification permission when enabled.
- Keep events without a location visible in the schedule, but do not fabricate a commute estimate or leave time for them.
- Make the ESP32 display optional. For a user who has one, show the next event and, when available, its leave countdown. Assume one display per user connected to the same Wi-Fi as the user's web app.
- Include ESP32 firmware/source code in the project and instructions in the project's README for uploading it to a display.

**Validation:** Given a destination, starting location, selected travel mode, and OpenTripPlanner estimate, the displayed commute time matches the returned estimate and leave-by time is exactly the event start time minus that estimate. If no route is returned for a non-online event with a destination, the commute estimate is 30 minutes and the leave-by time is calculated from it. A browser push notification is sent at leave time when permission is granted; the settings toggle shows whether notifications are enabled and can prompt for permission. Events without a destination show no commute estimate or leave time. The web app remains usable without an ESP32; when connected on the same Wi-Fi, one display per user shows the next event and its leave countdown.
