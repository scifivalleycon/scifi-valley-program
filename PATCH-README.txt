Sci-Fi Valley Con Attendee App V4.58 — Program Tools Close Button Scaling Fix

Rolled forward cumulatively from Program V4.57 Safe Scaling Exceptions.

Changes:
- Program Tools close X is now explicitly excluded from accessibility font scaling.
- The close button remains a fixed 36px circular control with a centered 22px X at 100% through 200% Text Size.
- Added an explicit data-font-scale lock to the Program Tools close button as an extra safeguard.
- Added CSS protection so the X cannot be enlarged by an inline font-size value.
- Bumped the stylesheet/app cache-busting query strings and service-worker cache to V4.58 so installed PWAs pull the fix.
- All V4.57 safe-scaling exceptions and prior app functionality remain intact.

No V4.57 functionality was removed.
