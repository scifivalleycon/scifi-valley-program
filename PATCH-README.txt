Sci-Fi Valley Con Attendee App V4.66 — Stacked Wikipedia Modal

Rolled forward cumulatively from V4.65 Event Guide Viewport Centering.

FIXED / CHANGED
- Wikipedia no longer replaces or fills the Events & Activities popup.
- Tapping READ WIKIPEDIA now opens a SECOND native popup above the existing Event Guide popup.
- The original Event Guide popup remains open underneath at the exact same scroll position.
- Wikipedia has its own dedicated orange X close button. Closing it returns the attendee directly to the console list/event details underneath.
- Tapping the dark area outside the Wikipedia popup also closes only the Wikipedia layer.
- The Wikipedia popup is centered in the current viewport and uses its own isolated vertical scroller.
- The popup opens immediately with a loading message while the correct article is resolved, preventing the tap from appearing to do nothing on a slower connection.
- Related Wikipedia links continue opening inside the same second popup rather than navigating away from the app.
- The existing OPEN ORIGINAL PAGE fallback remains available.

ACCESSIBILITY / MOBILE
- Wikipedia article text still follows the app's accessibility text scaling.
- The Wikipedia X remains fixed-size and centered.
- Overscroll and enlarged-text anti-bounce protections remain active.
- The Events & Activities viewport-centering fix from V4.65 remains intact.

CACHE
- Stylesheet, Event Guide renderer, app query string, and service-worker cache bumped to V4.66.

Upload the files inside this ZIP over the existing attendee-app repository files.
