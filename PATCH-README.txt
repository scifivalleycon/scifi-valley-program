Sci-Fi Valley Con Attendee App V4.64 — Retro Arcade In-App Wikipedia Reader

Rolled forward cumulatively from V4.63 Retro Arcade Year Layout.

ADDED
- Every console in the Retro Video Game Arcade now has a READ WIKIPEDIA button.
- Tapping the button opens the matching English Wikipedia article INSIDE the Event Guide popup instead of sending the attendee out of the app.
- Console names that use convention shorthand are mapped to their canonical Wikipedia page, while newly added systems automatically fall back to Wikipedia search.
- Wikipedia article links can be followed inside the same in-app reader, so attendees can continue exploring related console/history pages without leaving the PWA.
- The reader strips Wikipedia navigation/template clutter and wide tables, keeps readable article text/headings/lists/images, and provides a separate OPEN ORIGINAL PAGE link for attribution and full-source access.
- Live Wikipedia content uses MediaWiki's public cross-origin Action API. An internet connection is required to load an article that has not already been fetched during the current app session.
- Wikipedia attribution/licensing notice is displayed inside the reader.

ACCESSIBILITY / MOBILE
- The Wikipedia reader inherits the app's accessibility text-size system.
- Its close X remains fixed-size and centered.
- The article has its own isolated vertical scroller with overscroll/scroll-anchor protections to avoid the enlarged-text bounce behavior addressed in earlier patches.
- The Retro Arcade console-name/year layout from V4.63 is preserved.

PRESERVED
- V4.63 console year on its own line.
- V4.62 global fixed-icon alignment protections.
- V4.61 overlay-scroll stabilization and Program Tools 175% cap.
- V4.60 two-line guest-name fitting.
- All attendee reporting, schedule, map, guests, notifications, Event Guide, and PWA functionality.

CACHE
- Stylesheet, Event Guide renderer, app query string, and service-worker cache bumped to V4.64.

Upload the files inside this ZIP over the existing attendee-app repository files.
