Sci-Fi Valley Con Attendee App V4.59 — Guest Name Fit + Stable Guest Detail Scroll

Rolled forward cumulatively from Program V4.58 Program Tools Close Button Scaling Fix.

Changes:
- Celebrity guest names now stay on one line at enlarged accessibility Text Size settings, including 200%.
- Each guest name uses the largest enlarged font size that fits the actual available card width, so short names can remain larger while long names automatically reduce only as much as needed.
- The same one-line auto-fit protection is applied to the celebrity name inside the Guest Details popup.
- Guest-name wrapping, mid-name line breaks, and clipping are explicitly disabled.
- Guest Details now uses a stationary dialog shell with one dedicated internal scrolling region.
- The close button is removed from the scrolling flow, which prevents sticky-position jumping while scrolling long guest bios.
- Mobile dialog height uses the stable viewport so iPhone browser chrome changes do not make the popup bounce up and down during scrolling.
- Overscroll containment and momentum scrolling are applied to the Guest Details content area.
- Bumped stylesheet/app cache-busting query strings and service-worker cache to V4.59 so installed PWAs pull the update.
- All V4.58 fixes and prior app functionality remain intact.

No V4.58 functionality was removed.
