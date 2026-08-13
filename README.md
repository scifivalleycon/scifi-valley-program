# Sci-Fi Valley Con Digital Program — V3.7.3

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


## V3.7.2 — Event Alerts opt-in banner

Adds a prominent Event Alerts banner near the top of the attendee app.

Behavior:
- only appears when Web Push is supported and this device is not already subscribed
- Enable Alerts uses the existing Web Push subscription flow
- disappears immediately after a successful subscription
- does not appear when notifications are blocked or unsupported
- Not Now dismisses the banner for 24 hours instead of permanently hiding it
- disabling Event Alerts from Settings makes the banner eligible to appear again

The banner explains that notifications are used for schedule changes, room updates,
delays, cancellations, and other important convention announcements.

All V3.7.1 features remain intact.


## V3.7.3 — persistent notification encouragement

Notification opt-in behavior now works in two stages:

1. Every fresh app/browser session checks whether this device has an active Event
   Alerts push subscription. If it does not, an Event Alerts modal appears shortly
   after the app loads.
2. Choosing Not Now closes the modal for only that current app session.
3. If the attendee keeps the app open for 30 continuous minutes without subscribing,
   the Event Alerts banner appears at the top of the app.
4. A successful push subscription closes the modal, hides the banner, and cancels
   the 30-minute reminder timer.
5. Unsupported browsers and devices with notifications explicitly blocked receive
   explanatory modal text rather than an unusable Enable button.

No permanent dismissal is stored for the every-open modal. It is intentionally
shown again on the next fresh app open while Event Alerts remain disabled.

All V3.7.2 features remain intact.
