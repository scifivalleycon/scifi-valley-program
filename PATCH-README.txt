Sci-Fi Valley Con Attendee App V4.65 — Event Guide Viewport Centering

Rolled forward cumulatively from V4.64 Retro Arcade In-App Wikipedia Reader.

FIXED
- Events & Activities detail popups now open centered in the attendee's CURRENT screen view, even when the Event Guide page is scrolled far down.
- Fixes the V4.64 regression where the Event Guide dialog was changed to position:relative for the Wikipedia reader. On iOS that caused the dialog to be laid out near the top of the underlying page instead of the viewport, leaving users staring at the blurred backdrop.
- Restores explicit fixed/top-layer-style viewport positioning while preserving the Wikipedia reader's absolute positioning inside the dialog.
- Newly opened event details reset their internal scroll position to the top so every activity opens at its title and summary rather than retaining the previous event's scroll position.
- Keeps the existing 90svh mobile height and anti-overscroll protections for enlarged accessibility text.

PRESERVED
- V4.64 in-app Wikipedia console reader.
- V4.63 console year layout.
- V4.62 global icon alignment protections.
- V4.61 overlay-scroll stabilization and Program Tools 175% cap.
- V4.60 two-line guest-name fitting.
- All reporting, schedule, map, guest, notification, Event Guide, and PWA features.

CACHE
- Stylesheet, Event Guide renderer, app query string, and service-worker cache bumped to V4.65.

Upload the files inside this ZIP over the existing attendee-app repository files.
