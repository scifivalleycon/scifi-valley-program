# Sci-Fi Valley Con Digital Program — V3.5

Cumulative update from the complete V3.4.1 attendee app.

## New Event Settings system

The app now reads `data/settings.json`.

Staff-controlled fields:
- Event name
- Edition label
- Start date
- End date
- Venue
- City
- State
- Photo-op store URL

The event dates now dynamically update:
- top app bar
- homepage hero
- guest-page date heading
- Happening Now / Coming Soon messaging
- schedule reminder calendar dates
- notification timing
- photo-op CTA links

The existing October 16–18, 2026 information remains the default/fallback so the app
does not break if settings.json is unavailable during a deployment.

All prior guests, schedule, Event Guide, reminders, sponsors, install behavior, PWA
icons and styling are preserved.
