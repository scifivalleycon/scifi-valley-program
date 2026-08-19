Sci-Fi Valley Con Attendee App V4.83
APP LAYOUT CUSTOM BUTTON COLORS

CUMULATIVE UPDATE
Rolled forward from:
- V4.81 Admin-controlled Home layout
- V4.82 Event Guide layout controls

UPLOAD ONLY TO:
scifivalleycon/scifi-valley-program

WHAT'S NEW
The attendee app can now render per-object colors saved from Program Admin App Layout Designer:
- Button background
- Text
- Icon / accent
- Border

SUPPORTED AREAS
- Home
- Event Guide main buttons
- Event Guide Events & Activities

HOW IT WORKS
Program Admin stores the color overrides with homeLayout / eventGuideLayout inside the existing data/map-settings.json file.
The attendee app reads those values and applies the colors without rewriting the hard-coded program content.

DEFAULT SAFETY
If custom colors are disabled, missing, or invalid, the app uses its original styling.
No existing map settings, map coordinates, vendors, guests, schedules, Event Guide content, or other live Admin-managed JSON is included in this ZIP.

FILES IN THIS PATCH
- index.html
- home-layout.js
- home-layout.css
- event-guide-layout.js
- event-guide-layout.css
- service-worker.js
- version.json
- data/version.json

IMPORTANT
Use together with Program Admin V2.30 if you want to edit colors through the Admin interface.
