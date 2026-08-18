Sci-Fi Valley Con Attendee App V4.67 — Lost & Found Inquiry

Rolled forward cumulatively from V4.66 Stacked Wikipedia Modal.

ADDED
- Dedicated LOST & FOUND button on the Home screen and Event Guide / More menu.
- Lost & Found form collects attendee name, phone, email, lost-item description, optional last-known location and one optional item photo.
- Name is required and at least one contact method (phone or email) is required so staff can follow up on a possible match.
- Existing registered attendee profile is used to prefill contact fields when available.
- Photo upload uses the existing secure attendee-report upload service and existing 5 MB image limit.
- Lost & Found submissions are sent as the new `lostfound` report category and receive the normal report/reference ID.
- Success screen confirms delivery and gives the attendee the inquiry ID.

ACCESSIBILITY
- New LF badges and upload/submit symbols are locked against global text scaling so they remain centered at 200% text size.
- The form reuses the existing accessible report field, upload and success layouts.

PRESERVED
- V4.66 stacked Wikipedia popup architecture.
- V4.65 Event Guide viewport centering.
- All previous text-scaling, scrolling, reporting, schedule, map, guest, notification and PWA features.

IMPORTANT
- Deploy Notify V1.17 before or at the same time as this attendee patch. The backend must recognize the `lostfound` category before the new form can submit successfully.
- Deploy Admin V2.27 so Lost & Found inquiries are labeled/filterable in the staff report inbox.
