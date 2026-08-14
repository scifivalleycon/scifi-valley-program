Sci-Fi Valley Con App V4.7 - Table Label Rotation Fix

SAFE PATCH.

Replace only:
- app.js
- service-worker.js

This intentionally does NOT contain any data/*.json files, so it cannot overwrite
your current Map Designer coordinates, vendor assignments, map settings, guest
data, schedules, or other Admin-managed content.

Fix:
When a table/booth is rotated, the table body rotates while its location number
receives an equal inverse rotation. The number therefore remains upright at
90°, 180°, 270°, or any custom angle.
