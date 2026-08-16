Sci-Fi Valley Con Attendee App V4.18 SAFE PATCH

Fixes Social Media and Sponsors remaining stuck on "Loading...".

Changes:
- Forces fresh app.js and styles.css with V4.18 cache-busting URLs
- Service worker updates with updateViaCache:none
- Adds data/social-links.json and data/sponsors.json to the PWA cache
- Program-data offline cache lookup ignores cache-busting query strings
- Social links and sponsors render immediately after their JSON loads
- renderAll now isolates each program section, so one unrelated rendering error
  cannot prevent later sections from appearing
- Service-worker cache bumped to sfvc-program-v4-18

This package does NOT contain map-layout.json, vendors.json, guests.json,
schedule.json, settings.json, or other existing Admin-managed data.

UNZIP FIRST, then upload the files inside the package.
