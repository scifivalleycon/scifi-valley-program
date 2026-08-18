Sci-Fi Valley Con Attendee App V4.49 — Venue & Driving Directions

NEW DIRECTIONS PAGE
- Venue destination: Blair County Convention Center
  1 Convention Center Dr, Altoona, PA 16602
- Optional shuttle / Park & Ride destination managed by Program Admin
- Starting address input
- USE MY CURRENT LOCATION browser geolocation button
- If origin is left blank, Google Maps can use the most relevant/device location
- Driving directions launch with Google Maps universal Maps URLs
- No Google Maps API key is required
- Home screen gets a GET DRIVING DIRECTIONS button
- Event Guide / More gets a VENUE & DRIVING DIRECTIONS shortcut

SHUTTLE
The public shuttle card remains hidden until Admin publishes a shuttle address.

HIGH TRAFFIC
Keeps the V4.48 lightweight version-polling architecture. directions.json is included
in full refreshes and data/version.json is used to signal new Admin content.

NEW DATA FILE
- data/directions.json

IMPORTANT
This patch does not contain or replace map-layout.json, vendors.json, guests.json,
schedule.json, or other existing Admin-managed event content.

UNZIP FIRST, then upload the files inside to the attendee GitHub repository.
