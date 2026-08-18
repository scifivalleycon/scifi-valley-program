Sci-Fi Valley Con Attendee App V4.57 — Safe Scaling Exceptions

Rolled forward cumulatively from Program V4.56 Large Header Word Fit.

Changes:
- Bottom navigation SCHEDULE label now stops enlarging at 175%, even when the global Text Size setting is 200%, preventing clipping.
- Interactive floor-plan SVG text and the on-map vendor pointer remain at their original font sizes so room/table label geometry is not distorted by accessibility scaling.
- Top-bar SCI-FI VALLEY CON event name now stops enlarging at 130%, preventing it from crowding or falling behind Program Tools on mobile.
- Icon glyphs are excluded from text scaling and their line boxes are explicitly centered so symbols remain visually centered inside circular icon containers as surrounding text grows.
- Existing V4.56 long-header word-fit behavior remains intact.
- All other app text continues to follow the selected accessibility percentage up to 200%.

No V4.56 functionality was removed.
