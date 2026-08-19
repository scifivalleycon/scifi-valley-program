Sci-Fi Valley Con Attendee App V4.74 — Tester Review Upgrade

Rolled forward cumulatively from V4.73. Nothing from the prior attendee app is intentionally removed.

ADDED / CHANGED
- Landing-page countdown now includes live SECONDS and updates every second.
- See Something? Say Something now accepts photo and video evidence: up to 3 attachments total, with no more than 1 video. Photos remain limited to 5 MB each; video is limited to 20 MB and supports MP4, MOV / QuickTime, and WebM.
- Lost & Found remains image-only (one image, 5 MB maximum).
- App registration is now explained as a My Con recovery feature. When Notify V1.18 is deployed, registering a replacement installation with the same name, email, and phone reconnects the new Device ID to the attendee account and restores the saved My Con schedule and reminder preference.
- Vendor details support a Website field and show VISIT WEBSITE when a URL has been supplied from Program Admin / spreadsheet import.
- Colored floor-map rooms are now tappable. Room popups show the published weekend schedule for that room plus related Event Guide information where available. Panel Rooms 1 and 2 both read panel/schedule data; Photo Op Area reads the photo-op schedule; the lawn, cafés, gaming room and Retro Arcade link to their related content.
- Exact positions, dimensions, rotations, labels, paths and transforms from the supplied 2026-08-18 Map Designer source are now the attendee map baseline. Only the requested section colors were changed: Exhibit Hall - Main, Exhibit Hall - Lower, and Patio Vendors now have three distinct fills and legend colors.
- Map opens at a slightly larger 115% visual zoom and has a clear TAP A COLORED ROOM / TAP A TABLE hint. Internal map labels remain excluded from generic accessibility font scaling so the floor-plan geometry does not break.
- FAQ policies expanded for vendor-table transfers, free child admission, entry bag/prop screening, armed/unarmed security, and zero-tolerance harassment/hate conduct.
- Dedicated NOTIFICATIONS screen shows recent convention alerts and grouped My Con reminders. Same-time My Con events are presented and pushed as one grouped reminder.
- Normal 100% Text Size is now rendered about 12% larger than the previous baseline for readability, while retaining the 200% absolute ceiling and all prior component-specific caps (including the 115% top-bar event-name cap).
- Nearby Hotels screen added and driven by data/hotels.json, including the current public hotel information and photo galleries.
- Directions now supports Admin-controlled Holiday Bowl / after-party directions and an optional AMC Altoona 12 movie-screening destination in addition to venue and shuttle destinations.
- Existing in-app Wikipedia reader, external IMDb behavior, Lost & Found, Back button, reporting, schedule, map, guest, notification and PWA features are preserved.

BACKEND REQUIREMENTS
1. Deploy Notify V1.18 first. It enables video evidence, recoverable registered accounts, cross-device My Con restoration, grouped reminder delivery, and notification-center deep links.
2. Deploy Admin V2.29. It adds the closeable photo/video evidence viewer, vendor Website import/editing, hotel management, new directions controls and the updated map recovery baseline.
3. Deploy this Attendee V4.74 patch last.

FILES IN THIS PATCH
- app.js
- event-guide-ui.js
- index.html
- styles.css
- service-worker.js
- data/directions.json
- data/faq.json
- data/hotels.json
- data/map-layout.json
- data/map-settings.json
- data/version.json
- version.json

Upload the files in this ZIP over the matching files in the attendee repository.
