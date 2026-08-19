Sci-Fi Valley Con Attendee App V4.77 — User-Provided Retro Back Button

Rolled forward cumulatively from V4.76 Café Map Menu-Only Popups.

CHANGED
- Replaces the small mustard/yellow circular Back button in the top-left app header.
- Uses the exact teal/orange/cream retro arrow artwork supplied by the user.
- Keeps the Back control in the same top-left position immediately before the Sci-Fi Valley Con app logo.
- Keeps the button fixed-size and excluded from accessibility text scaling.
- Keeps the existing in-app screen-history and previous scroll-position restoration behavior unchanged.

NEW ASSET
- assets/icons/back-button.png

PRESERVED
- V4.76 Café and Mini Café map popup cleanup.
- V4.75 Days / Hours / Minutes / Seconds countdown.
- V4.74 interactive room areas, map schedules, hotel page, vendor websites, registration recovery, grouped reminders, video reporting and accessibility improvements.
- All prior attendee app functionality, content and styling.

CACHE
- App build version and service-worker cache bumped to V4.77.
- The new back-button artwork is included in the service-worker precache.
- CSS, Event Guide JS and app JS cache-busting query strings bumped to V4.77.

INSTALL
Upload the files inside this ZIP over the matching files in the attendee-app repository.
The new assets/icons/back-button.png file must also be uploaded.
No Admin App or Notify Worker update is required.
