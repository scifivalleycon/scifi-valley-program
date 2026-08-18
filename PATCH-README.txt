Sci-Fi Valley Con Attendee App V4.60 — Two-Line Guest Name Fit

Rolled forward cumulatively from V4.59 Guest Name Fit + Stable Guest Detail Scroll.

FIXED
- At enlarged accessibility text sizes, celebrity names are now intentionally split into no more than two name lines: first name on line one, remaining name on line two.
- Individual name lines are unbreakable. A surname such as GIUNTOLI can no longer become GIUNT / OLI.
- The app measures the actual available guest-card or guest-detail width and automatically reduces only the guest-name font size until the wider name line fits.
- Very long names may shrink below the normal 100% guest-name size when necessary, rather than breaking a name word.
- Multi-part names keep the first name on line one and the remaining name together on line two when enlarged.
- Resetting Text Size to 100% restores the original compact guest-name presentation.
- Added min-width protection to the guest-detail text column so grid sizing cannot force name overflow.

PRESERVED
- V4.59 stable guest-detail modal scrolling / iPhone bounce fix.
- V4.58 Program Tools close-button scaling fix.
- V4.57 Schedule 175% cap, map text lock, top-bar 130% cap, icon alignment fixes, and V4.56 page-header word fitting.
- All attendee reporting and existing app functionality.

CACHE
- Stylesheet/app query strings and service-worker cache bumped to V4.60.

Upload the files inside this ZIP over the existing attendee-app repository files.
