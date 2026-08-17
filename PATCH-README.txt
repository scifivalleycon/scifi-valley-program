Sci-Fi Valley Con Attendee App V4.22 Static Event Buttons Fix

WHY:
The V4.21 page could remain stuck on "Loading events and activities..." if the
main attendee JavaScript render pipeline did not reach renderEventQuickLinks.

FIX:
- All 11 Event Guide activity buttons are now hard-coded into index.html.
- They appear immediately without waiting for JavaScript or events.json.
- New standalone event-guide-ui.js handles the detail popups independently.
- The standalone script fetches data/events.json directly with cache:no-store.
- It does not depend on app.js, state.events, renderAll(), the map, guests,
  notifications, sponsors, or any other app module.
- Existing search/filter functionality remains in the main app.
- Service-worker cache bumped to V4.22 and includes event-guide-ui.js.

This is a SAFE PATCH and does not contain current map, vendor, guest, schedule,
settings, or celebrity JSON files.

UNZIP FIRST, then upload all files/folders inside this ZIP.
