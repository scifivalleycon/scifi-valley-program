Sci-Fi Valley Con Attendee App V4.70 — In-App Back Button

Rolled forward cumulatively from V4.69 IMDb External Link Restore.

ADDED
- Small circular Back button in the upper-right corner of the app header.
- Back returns the attendee to the previous app screen they were viewing.
- The previous screen's scroll position is saved and restored, so Back returns the attendee to where they left off instead of forcing them to the top.
- Navigation history is kept inside the PWA and capped to the most recent 40 screen changes.
- The button hides automatically when there is no previous in-app screen to return to.
- The Back arrow is fixed-size and excluded from accessibility font scaling so it stays centered at 100% through 200% Text Size.

PRESERVED
- V4.69 reliable external IMDb links.
- V4.67 Lost & Found inquiry and reporting integration.
- V4.66 stacked Wikipedia popup.
- V4.65 Event Guide viewport centering.
- All prior text scaling, icon alignment, anti-bounce scrolling, guest-name fitting, reporting, schedule, map, notification and PWA features.

CACHE
- App build version and service-worker cache bumped to V4.70.
- CSS, Event Guide JS and app JS cache-busting query strings bumped to V4.70.

INSTALL
Upload the files inside this ZIP over the matching files in the attendee-app repository.
No Admin App or Notify Worker changes are required.
