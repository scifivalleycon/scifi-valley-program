Sci-Fi Valley Con Attendee App V4.47 — Share This Web App

Adds a new Program Tools option:

SHARE THIS WEB APP WITH A FRIEND

PRIMARY BEHAVIOR
On devices that support the Web Share API, tapping the button opens the device's
native share sheet. The attendee can choose any supported installed destination,
such as:
- Messages / text
- Email / Mail
- Messenger
- WhatsApp
- AirDrop
- social apps
- other installed share targets

The shared link is always:
https://app.scifivalleycon.com/

FALLBACK
If native sharing is unavailable, the app opens a fallback sharing popup with:
- TEXT MESSAGE
- EMAIL
- COPY APP LINK

Nothing is sent automatically. Text and email options only open the user's own
messaging/mail app with the SFVC app link prefilled.

This is an attendee CODE-ONLY patch.
No Admin or Notify Worker update is required.
No backend-managed JSON files are included.

UNZIP FIRST, then upload the files inside this ZIP to the attendee GitHub repository.
