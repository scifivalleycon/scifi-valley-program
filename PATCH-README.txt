Sci-Fi Valley Con Attendee App V4.61 — Icon / Program Tools / Overlay Scroll Stability

Rolled forward cumulatively from V4.60 Two-Line Guest Name Fit.

FIXED
- Celebrity photo lightbox close X is now permanently excluded from accessibility font scaling. Its 42px button and 26px X stay centered at every text-size setting.
- Reviewed the fixed-size symbol controls in the attendee UI and also locked other likely collision points: reminder/install close X buttons, notification prompt X, install-card dismiss X, guest favorite heart, and map zoom +/- controls.
- Program Tools closed-tab text is capped at 175% even when global Text Size is 200%. The handle, PROGRAM TOOLS label, and arrow share the same ceiling.
- On mobile, the Program Tools tab max width is tightened to 175px to further protect the top-bar SCI-FI VALLEY CON name from overlap.
- Removed the old whole-drawer swipe-to-close gesture. Scrolling inside Program Tools can no longer be mistaken for a drawer drag; drag/click control remains on the Program Tools handle.
- Enlarged popup/dropdown scroll surfaces now use stable svh viewport heights where appropriate, prevent scroll chaining/rubber-band overscroll, disable smooth-scroll travel, and disable scroll anchoring that can shift content while swiping.
- Guest-detail scrolling receives the stronger no-overscroll rule while retaining the isolated content scroller introduced in V4.59.

PRESERVED
- V4.60 two-line, unbreakable guest-name fitting.
- V4.59 guest-detail isolated scroll architecture.
- V4.58 Program Tools close-button lock.
- V4.57 Schedule 175% cap, map text lock, top-bar 130% cap, icon alignment, and page-title fitting.
- Attendee reporting and all existing attendee app features.

CACHE
- Stylesheet/app query strings and service-worker cache bumped to V4.61.

Upload the files inside this ZIP over the existing attendee-app repository files.
