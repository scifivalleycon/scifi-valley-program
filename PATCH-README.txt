Sci-Fi Valley Con Attendee App V4.27 Home Guest Banner SAFE PATCH

Adds the current first celebrity-guest banner from the Sci-Fi Valley Con website
directly below the app's main retro hero.

Behavior:
- Whole banner is tappable and opens the native Celebrity Guests screen.
- Banner URL is controlled by data/home-banner.json.
- Admin V2.18 can manually replace the image or automatically detect the current
  first guest slider banner from https://scifivalleycon.com/.
- data/home-banner.json is the new source of truth for this banner.
- Static HTML also uses the supplied banner as a visual fallback before JSON loads.

This patch does NOT contain or overwrite current map, vendors, guests, schedule,
settings, events, sponsors, social links or other existing Admin-managed files.

UNZIP FIRST, then upload all files/folders inside this ZIP.
