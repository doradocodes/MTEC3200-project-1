# MVP

## Core problem
You know when events start. You don't know when to leave. The app answers that one question.

## Must-have features
- Calendar sync: read events from Google Calendar and Apple Calendar. Only events with a location need a leave time
- Travel time estimate: pull a travel time from a maps API based on current location and preferred mode (transit, walk, bike, car)
- Leave-by time: start time minus travel time minus a buffer, shown clearly for each event
- Notifications: two alerts per event, one to start getting ready, one to leave
- Personal buffers: default prep time and arrive-early time, overridable per event
- Next up view: one screen showing the next event and a countdown to when you need to act

## Nice to have, but not MVP
- Rechecking travel time live and updating the alert if delays appear
- Learning your actual prep and travel habits over time
- Different buffers by event type (work, social, appointments)
- Sharing your ETA with the people you're meeting
- Widgets and watch support
- Out of scope for now
- Creating or editing calendar events
- Booking rides or buying transit fares
- Multi-stop day planning

## Key assumptions to test
- People trust an auto-calculated leave time
- Two alerts help without becoming noise
- Calendar events have usable locations often enough