Sci-Fi Valley Con Attendee App V4.69 — IMDb External Link Restore

Rolled forward cumulatively from V4.68, with only the unreliable embedded IMDb viewer removed.

CHANGED
- Celebrity IMDb buttons once again open the official IMDb profile in the browser / external web view.
- Removed the V4.68 iframe-based IMDb popup because IMDb's anti-bot / embedding protections can return challenge pages instead of the celebrity profile.
- No attempt is made to bypass IMDb's challenge or framing protections.
- The external IMDb link remains the dependable way to reach each guest's official IMDb page.

PRESERVED
- V4.67 Lost & Found inquiry and Admin reporting integration.
- V4.66 stacked Wikipedia popup.
- V4.65 Event Guide viewport centering.
- All previous text scaling, icon alignment, anti-bounce scrolling, guest-name fitting, reporting, schedules, maps, notifications, and PWA functionality.

CACHE
- App build version and service-worker cache bumped to V4.69.
- CSS, Event Guide JS, and app JS cache-busting query strings bumped to V4.69.

INSTALL
Upload the files inside this ZIP over the matching files in the attendee-app repository.
No Admin App or Notify Worker changes are required.
