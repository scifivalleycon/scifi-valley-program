Sci-Fi Valley Con Attendee App V4.80 - Cosplay Clinic Native Content Cleanup

Rolled forward cumulatively from V4.79 Cosplay Clinic / Table D8.

CHANGED
- Removes the embedded/copied Cosplay Clinic poster image from the dedicated Cosplay Clinic screen.
- Keeps the Cosplay Clinic information as real selectable, accessible in-app text.
- Keeps the Home-screen Cosplay Clinic card and Event Guide entry.
- Keeps the Table D8 location badge and OPEN FLOOR MAP action.
- Keeps the existing retro styling and enlarged-text accessibility behavior.
- Removes the old Cosplay Clinic poster from the service-worker offline precache list so it is no longer required by the app.

PRESERVED
- V4.79 Cosplay Clinic functionality and Table D8 navigation.
- V4.78 Program Tools header no-overlap protection.
- V4.77 custom retro Back button.
- Attendee Reporter / See Something Say Something.
- Lost & Found.
- My Con, notifications, reminders, registration, interactive map, guests, schedules, Event Guide, directions, hotels, T-shirts, FAQ, PDF/print tools, and all prior attendee-app functionality.

CACHE
- PWA service-worker cache bumped to V4.80.
- Front-end cache-busting references bumped to V4.80.
- Old assets/cosplay-clinic.png may remain in the repository harmlessly, but it is no longer referenced or required by this build.

INSTALL
Upload the files inside this ZIP over the matching files in the ATTENDEE repository only:
scifivalleycon/scifi-valley-program

Do NOT upload this ZIP to scifi-valley-admin or scifi-valley-notify.
No Admin App or Notify Worker update is required.
