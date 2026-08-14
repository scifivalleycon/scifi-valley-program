# Sci-Fi Valley Con Digital Program — V4.14 Live Refresh + Reliable My Con

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


## V3.8 — anonymous usage analytics

The attendee app now sends a lightweight anonymous heartbeat to the existing
Sci-Fi Valley Con notification Worker while the app is visibly active.

Definitions:
- Active Now: unique anonymous app installations seen within the last 5 minutes
- Today's Users: unique anonymous installations seen during the current
  America/New_York calendar day
- Peak Active: highest Active Now count observed during that day

Implementation:
- a random opaque installation ID is generated locally and stored in localStorage
- no attendee name, email, IP address, favorites, My Schedule choices, or push message
  content is stored in the analytics tables
- a heartbeat is sent approximately every 2 minutes only while the app is visible
- analytics failure never blocks or changes the attendee experience

All V3.7.3 schedule, push notification, PWA and celebrity features remain intact.


## V3.8.1 — notification prompt reliability fix

Fixes the Event Alerts popup load order by placing the popup dialog in the page
before app.js executes.

Also:
- removes a stale duplicate push-banner function
- prompts again when a PWA/browser page is restored from memory
- treats returning after 30+ seconds in the background as a new app-use session
- preserves the 30-minute persistent top banner
- keeps the popup hidden for devices that already have an active push subscription
- adds a staff-only visual test URL parameter: `?forcePushPrompt=1`

The test parameter displays the popup without changing notification permission or
unsubscribing the device.


## V3.8.2 — analytics reliability fix

The original analytics heartbeat used cross-origin application/json, which required a
CORS preflight. It also updated its local throttle timestamp before confirming that
the analytics Worker actually accepted the request.

V3.8.2:
- sends analytics heartbeats as text/plain simple POST requests
- checks the HTTP response before considering a heartbeat successful
- retries a failed heartbeat after 10 seconds while the app remains visible
- sends an immediate heartbeat when the app opens, returns to the foreground, or
  regains network connectivity
- only throttles after a confirmed successful heartbeat
- prevents duplicate analytics initialization/listeners
- bumps the PWA cache

All notification prompt, schedule, celebrity and PWA features remain unchanged.


## V3.8.3 — CORS-independent activity tracking

Replaces the client-side analytics fetch with a tiny transparent image beacon at
`/v1/app/ping.svg`.

This is more reliable because:
- cross-origin images do not require JavaScript CORS permission
- the public client endpoint no longer includes the word "analytics"
- every successful image load confirms that the activity Worker responded
- failed beacons retry after 10 seconds
- the app still sends activity immediately on open/foreground/online and roughly
  every two minutes while visible

No attendee name, email, favorites, My Schedule data, or push content is sent.

All V3.8.2 notification prompt, schedule, celebrity, analytics ID, and PWA features
remain intact.


## V3.8.4 — independent analytics bootstrap

Manual testing proved Notify V1.4 and D1 successfully record `/v1/app/ping.svg`.
The remaining problem was isolated to automatic attendee-app delivery.

V3.8.4:
- starts analytics before `loadData()` instead of waiting for app data/rendering
- analytics can therefore continue even if another program feature throws an error
- appends a real hidden 1x1 image element to the DOM for each activity heartbeat
- also fires a redundant no-CORS GET to the same endpoint
- duplicate delivery does not inflate unique users because D1 deduplicates on
  calendar day + anonymous installation ID
- immediately pings on app startup, pageshow, foreground, online and periodic use
- retains the same anonymous local installation identifier
- bumps the PWA cache to V3.8.4

Notify V1.4 and Admin V1.8.1 require no changes for this revision.


## V3.8.5 — accidental double-tap zoom prevention

Rapid taps/double taps inside the attendee app no longer trigger browser zoom,
including taps on the top toolbar and bottom navigation.

Implementation:
- `touch-action: manipulation` is applied to the app shell and interactive controls
- a `dblclick` default-action guard covers the app chrome/content
- normal scrolling remains available
- intentional pinch-to-zoom remains available for accessibility
- no `user-scalable=no` or `maximum-scale=1` viewport restriction is used
- PWA cache bumped to V3.8.5

Current backend-managed JSON was checked against the live GitHub repository before
packaging so this revision does not roll back admin-managed content.


## V3.9 — Recent Event Alerts

Adds a Recent Event Alerts section to the attendee home screen.

Behavior:
- every broadcast sent through Admin automatically becomes a home-screen update
- newest updates appear first
- high-urgency broadcasts receive a stronger visual treatment
- the feed refreshes on app open, when the app returns to the foreground, when
  internet connectivity returns, and every 5 minutes while visible
- the public app filters out alerts older than 72 hours
- Notify V1.5 also filters the public feed at 72 hours, so expired alerts disappear
  even if the attendee app has remained open
- the Admin's longer internal broadcast history is not deleted
- optional broadcast destination URLs remain clickable when they point to the
  attendee app

No Admin update is required.


## V4.0 — interactive vector floor-plan foundation

Adds a true SVG floor plan built from vector shapes rather than embedding the uploaded JPG.

Features:
- detailed Main Level and Lower Level venue zones
- Patio outdoor vendor booths
- individual SVG table/booth objects with stable IDs such as `table-A1`
- crisp vector scaling at any zoom level
- app zoom controls and scroll/pan viewport
- color legend
- vendor/table search
- Main Level / Lower Level / Patio / Con-Quest filters
- click a table or booth to see its assigned vendor
- Con-Quest participants are shaded red from backend data
- `data/map-settings.json` controls publication
- `data/vendors.json` now supports map-aware assignments

Safety:
The uploaded source map contains the June 2026 celebrity lineup, so the initial map and directory are intentionally DRAFT / unpublished. Use `?mapPreview=1` on the attendee-app URL to preview it before publishing.

Seed directory contains 177 records transcribed from the uploaded map.


## V4.1 improvements

- replaced the one-off SVG asset with a data-driven `data/map-layout.json` layout
- refined table and booth placement to better follow the original floor-plan reference
- fixed room labels so they sit neatly inside the colored spaces
- attendee app now renders the map from editable layout data
- foundation added for admin-side live map editing


## V4.2
- no table-selection highlight by default
- NONE SELECTED clear/status button beside ALL
- vendor directory click highlights only that vendor's assigned table(s) and returns focus to the map
- table/booth numbers are rendered inside the physical SVG objects
- Con-Quest red fill remains independent from selected-table highlighting
- this update package intentionally excludes backend-managed data JSON so Admin map edits are never rolled back


## V4.3

- supports Admin Map Designer transformations for static SVG objects and irregular areas
- static rectangles can be moved/resized by updating their geometry
- path-based areas support translate/scale/rotation transforms
- hidden map objects are excluded from the attendee map
- this remains a CODE-ONLY package and does not overwrite live map-layout.json or vendors.json


## V4.4 full map baseline

Complete attendee package paired with Admin V2.4.

The package includes the full `data/map-layout.json` floor plan, vendor data,
map settings, all other event data, app code, PWA assets, and service worker.

This release intentionally provides a complete known baseline while the map
designer is being stabilized.


## V4.5 — table-number visibility

Table and booth codes remain centered inside their physical map objects and use a
slightly larger adaptive font for easier reading at normal map zoom levels.

This is a complete attendee package paired with Admin V2.5.


## V4.6 — simplified Interactive Floor Map controls

Removed the attendee-facing:
- All
- None Selected
- Main Level
- Lower Level
- Patio
- Con-Quest

chip/button row.

The directory is now driven by the vendor/table search field only.

Vendor locating still works:
- clicking a vendor highlights only that vendor's assigned table/booth
- choosing another vendor moves the highlight to that vendor
- clicking empty space on the SVG clears the current highlight

Con-Quest red table fills and the map color legend remain unchanged.


## V4.8 — map placement imported from ChatGPT backup

The floor-map geometry in `data/map-layout.json` was replaced with the exact
layout supplied in `sfvc-mapLayout-backup-2026-08-14.json`.

Imported:
- 252 location records
- 54 map elements / labels / areas

The V4.7 upright table-number rotation fix is included.


## V4.9 — full-map responsive display

The Interactive Floor Map no longer uses a 72vh internal scrolling window.

Default / Reset behavior:
- the entire SVG fits the available map-card width
- the map card grows vertically to contain the complete Main + Lower Level map
- no internal vertical scrollbar
- the vendor directory naturally begins after the complete floor plan

Zoom behavior:
- Reset = Fit Map to Space
- Zoom Out scales the complete map smaller
- Zoom In may create horizontal scrolling only when the user intentionally enlarges
  the SVG beyond the available width

The saved V4.8 map placement remains unchanged.


## V4.10 — Con-Quest spreadsheet roster

Vendor/table data was rebuilt from the supplied `Tables(1).xlsx`.

Spreadsheet columns:
- #
- Total Tables
- Business Name
- Con Quest

Imported:
- 176 vendor / guest / service roster rows
- 91 rows marked `Con Quest = Yes`
- 120 expanded physical table/booth codes marked for Con-Quest

`Con Quest = Yes` is stored as `conQuest: true`.

The Interactive Floor Map already uses `conQuest: true` to shade the associated
table/booth objects red. Blank/non-Yes Con Quest cells remain false.

The existing saved map geometry and placement were not changed by this roster import.


## V4.11 — persistent / self-healing event-alert status

Fixes an iOS/PWA issue where Settings could return to `ENABLE EVENT ALERTS`
even though iOS still showed Sci-Fi Valley Con notifications as allowed.

Previous behavior:
- Settings trusted only the immediate result of `PushManager.getSubscription()`
- a temporarily missing/unavailable subscription made the UI look disabled
- the already-saved `sfvc-push-enabled` state was not used by the status display

V4.11 behavior:
- iOS/browser `Notification.permission` remains the OS permission source
- a successful app opt-in is remembered persistently
- explicit in-app Disable is remembered separately
- if permission remains granted, Settings stays `EVENT ALERTS ENABLED`
- a missing PushManager subscription is silently recreated
- existing browser subscriptions are periodically re-posted to the notification
  backend so a pruned backend record can also self-repair
- repairs run on app load, foreground return, online return, pageshow, and service
  worker controller changes
- a temporary offline/iOS/service-worker failure no longer flips the button back
  to Enable

Explicitly pressing Disable Event Alerts still turns the app-level alert state off.


## V4.12 — background My Schedule reminders

The old 5 / 15 / 30 / 60 minute reminders were page timers. iOS can suspend those
timers when the Home Screen app is backgrounded.

V4.12 keeps the local timer as a foreground fallback and also sends future
reminders to Notify V1.6 for server-side Web Push delivery.

Notification Settings now includes TEST REMINDER IN 2 MINUTES so the full
closed-app delivery path can be tested directly.


## V4.13 — lock-screen reminder test

Pairs with Notify V1.7.

The new one-minute lock-screen test is staged directly into Cloudflare Queue with
a delivery delay. It does not depend on page JavaScript timers and does not depend
on Cron firing at the test time.

After reopening the app, Notification Settings also reports the last server-side
test state such as QUEUED or DELIVERED.

Normal My Schedule reminders within the next 23 hours are now staged in the same
delayed-Queue system.


## V4.14 — live refresh and resilient My Con

Fixes intermittent missing/delayed saved schedule cards.

Changes:
- program JSON refreshes on every app open/pageshow
- program JSON refreshes whenever the app returns to the foreground
- while open, program data refreshes every 60 seconds
- data requests use cache:no-store with timestamp cache-busting
- service worker treats data/*.json as network-first/no-store with offline fallback
- regular schedule items use stable content-derived IDs instead of array positions
- legacy array-position IDs are migrated automatically
- saved My Schedule items keep local snapshots so they remain visible during a
  slow/offline refresh
- each successful refresh rewrites snapshots with the newest time/location/title
- every refresh re-syncs the server-side reminder schedule, so a staff schedule
  time change updates the attendee's future reminder as soon as their app next
  gets current data

Pairs with Notify V1.8 for redundant Queue + direct Cron fallback delivery.
