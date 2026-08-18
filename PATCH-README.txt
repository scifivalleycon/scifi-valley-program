Sci-Fi Valley Con Attendee App V4.68 — Stacked In-App IMDb Viewer

Rolled forward cumulatively from V4.67 Lost & Found Inquiry.

ADDED / CHANGED
- Celebrity guest profiles no longer default straight out to IMDb when the IMDb button is tapped.
- IMDb now opens in a SECOND popup above the existing guest-detail popup, matching the stacked Wikipedia-reader experience.
- The guest-detail popup remains open underneath, so closing IMDb returns the attendee directly to that guest.
- The IMDb popup has its own fixed-size X that is protected from 200% text scaling.
- The live IMDb name page is loaded inside the popup when IMDb/browser framing allows it.
- A clearly visible OPEN ORIGINAL IMDb fallback remains in the popup for browsers or IMDb responses that do not permit embedded display.
- Tapping outside the IMDb popup closes only the IMDb layer.
- Closing the IMDb viewer clears the iframe so it does not continue using data in the background.

PRESERVED
- V4.67 Lost & Found inquiry and reporting integration.
- V4.66 stacked Wikipedia popup.
- V4.65 Event Guide viewport centering.
- All prior 200% text scaling, icon alignment, anti-bounce scrolling, guest-name fitting, reporting, schedule, map, notifications, and PWA features.

CACHE
- App build version and service-worker cache bumped to V4.68.
- CSS, Event Guide JS, and app JS cache-busting query strings bumped to V4.68.

INSTALL
Upload the files inside this ZIP over the matching files in the attendee-app repository.
No Admin App or Notify Worker changes are required for this patch.
