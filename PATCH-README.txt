Sci-Fi Valley Con Attendee App V4.44 — Smart Collision-Safe Text Scaling

This revises the Program Tools TEXT SIZE feature introduced in V4.42.

WHY
The original scaler enlarged every independent text node by the same percentage.
That worked for body text, but it could break composed display graphics such as the
Sci-Fi Valley Con hero logo because SCI-FI, VALLEY and CON are individually positioned.

NEW ADAPTIVE SCALING
- Small body copy still receives the full readability increase up to 130%.
- Medium headings receive a moderate increase.
- Already-large display headings receive little or no extra growth.
- Absolutely/fixed-positioned decorative text is protected automatically.
- The Sci-Fi Valley Con hero logo is explicitly locked at its designed proportions.
- The giant event date, countdown clock, show-hours grid, top header, bottom nav,
  celebrity-banner CTA, floor-map graphics, and Program Tools controls are protected
  from independent font scaling because those are tightly composed layouts.
- Flexible content text is allowed to wrap instead of clipping.
- At the 130% setting, compact phone layouts receive extra responsive safeguards.

The visitor still sees the same 90%, 100%, 115%, and 130% choices. The preference
continues to use the same localStorage key, so existing users keep their selected size.

No Admin or Notify Worker update is required.
No backend-managed JSON files are included.

UNZIP FIRST, then upload the files inside this ZIP to the attendee GitHub repository.
