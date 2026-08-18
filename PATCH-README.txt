Sci-Fi Valley Con Attendee App V4.62 — Global Fixed-Symbol Alignment

Rolled forward cumulatively from V4.61 Icon / Program Tools / Overlay Scroll Stability.

FIXED
- Corrects the 200% text-size misalignment shown on the Directions starting-location compass icon.
- Corrects the 200% text-size misalignment shown on the Newsletter envelope badge.
- Corrects the 200% text-size misalignment shown on the Follow Sci-Fi Valley Con @ badge.
- Audits the rest of the attendee app for the same failure mode: fixed-size icon/badge containers whose glyphs were still being treated as readable copy by the global text scaler.
- Locks additional fixed UI symbols including menu icons, alert bells, featured-event badges, newsletter button icon, T-shirt badges, FAQ numbers/chevrons, registration badge, schedule check mark, directions destination badges, report badges, map badge, Con-Quest step numbers, and standalone navigation chevrons/arrows.
- Also protects fixed visual placeholders and compact map location chips from inherited 175-200% parent font growth that could distort their artwork/geometry.
- Adds hard geometry/line-height overrides for the fixed symbol containers so the generic 175-200% button/text rules cannot shift their glyphs off-center.
- Preserves the intended smaller mobile destination badge size.

PRESERVED
- V4.61 175% Program Tools tab cap and overlay-scroll stabilization.
- V4.60 two-line unbreakable guest-name fitting.
- V4.59 guest-detail isolated scroll architecture.
- V4.58 Program Tools close-button lock.
- V4.57 Schedule 175% cap, map text lock, top-bar 130% cap, page-title fitting, and earlier icon alignment.
- Attendee reporting and all existing attendee app features.

CACHE
- Stylesheet/app query strings and service-worker cache bumped to V4.62.

Upload the files inside this ZIP over the existing attendee-app repository files.
