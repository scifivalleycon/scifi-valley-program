Sci-Fi Valley Con Attendee App V4.82
EVENT GUIDE LAYOUT DESIGNER SUPPORT

Rolled forward from V4.81 App Layout Designer.

WHAT CHANGED
- Keeps the existing Admin-controlled Home layout system.
- Adds Admin-controlled layout support to the EVENT GUIDE screen (the MORE tab).
- Event Guide main shortcut buttons can now be reordered or hidden from Program Admin.
- Events & Activities quick buttons can now be reordered or hidden from Program Admin.
- Custom buttons created in Program Admin can be added to Home, Event Guide main buttons, or Events & Activities.
- Custom buttons may link to another app page, a specific Event Guide item, or an external HTTPS website.
- Event Guide layout is stored inside the existing data/map-settings.json as eventGuideLayout.
- Existing map coordinates, vendor assignments, reports, schedules, guests, settings, accessibility, notifications, and all prior app features are preserved.

FILES IN THIS PATCH
- index.html
- event-guide-layout.js
- event-guide-layout.css
- service-worker.js
- version.json
- data/version.json

IMPORTANT
This ZIP intentionally does NOT include data/map-settings.json. Your live Home layout, floor-plan settings and map data must not be overwritten by a code update.

UPLOAD TO
scifivalleycon/scifi-valley-program

No Notify Worker update is required.
