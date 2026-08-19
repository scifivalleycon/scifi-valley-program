Sci-Fi Valley Con Attendee App V4.81 - Admin-Managed Homepage Layout

Rolled forward cumulatively from V4.80.

ADDED
- Reads homepage layout from homeLayout inside data/map-settings.json
- Admin-controlled ordering of homepage clickable objects
- Admin-controlled show/hide state for built-in objects
- Supports custom homepage cards created in the App Layout Designer
- Custom cards can link to an app page, Event Guide item, or external HTTPS website
- Layout refreshes when the app becomes visible and checks again every 60 seconds

PROTECTED / NOT MOVABLE
- Add App system prompt
- Retro event hero
- Top Sci-Fi Valley Con header and back button
- Program Tools drawer/tab
- Sponsor strip
- Bottom navigation

PRESERVED
- V4.80 native Cosplay Clinic content
- Reporting, Lost & Found, map, notifications, accessibility, My Con, guests, schedule, Event Guide, and all prior features

INSTALL
Upload the files inside this folder over the matching files in scifivalleycon/scifi-valley-program.
New files: home-layout.js and home-layout.css.
No data/map-settings.json replacement is included, so your current map settings and floor-map configuration are not overwritten.

PAIRING
Install the Admin App Layout Designer add-on from the other folder in this package.
