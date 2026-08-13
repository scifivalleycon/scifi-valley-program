# Sci-Fi Valley Con Digital Program — V3.7.1

Cumulative update from V3.6.

## Show Schedule improvements

The Show Schedule now combines:
- regular schedule events
- celebrity guest panels
- professional photo-op times
- flexible celebrity autograph availability

The schedule automatically generates checkbox filters from the available content.
New backend categories such as Artist Panels automatically become new filters without
another app-code revision.

Special grouping includes:
- Celebrity Panels
- Photo Ops
- Autographs
- Artist Panels
- Event Room
- Gaming
- Workshops
- Costume & Cosplay
- Charity
- Activities
- After Party

Users can hide or show categories and their preferences remain saved locally.

Photo ops and panels remain eligible for My Schedule reminders. Flexible autograph
availability is displayed in the Show Schedule but is intentionally not treated as
a precise reminder time.

## Convention-wide Web Push

Notification Settings can now subscribe a device to true Web Push updates through
`settings.pushApiUrl` (default `https://notify.scifivalleycon.com`).

The service worker now handles background push events and notification clicks.

iPhone/iPad Web Push requires the web app to be added to the Home Screen. Other
browser/device support is feature-detected.

This build preserves the existing V3.6 features and data model.

## V3.7.1 correction

Corrected the future schedule category from **Artist Tables** to **Artist Panels**. All V3.7 schedule filters, push notifications, celebrity schedules, reminders, and existing content are otherwise unchanged.
