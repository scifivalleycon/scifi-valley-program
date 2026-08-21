SCI-FI VALLEY CON PROGRAM APP - VENDOR PORTAL INTEGRATION PATCH V1.0

PURPOSE
- Adds a VENDOR? MANAGE YOUR BOOTH button to the attendee Program app.
- Opens vendor.scifivalleycon.com inside the Program app.
- Passes the Program app device ID through a short-lived one-time handoff token.
- Enhances visible vendor/map dialogs with the Vendor Portal public profile feed when a Table/Booth number can be detected.
- Public profile enhancements can include website, public notes, products/categories and up to 5 vendor photos.

PRIVACY
This integration requests only the Vendor Portal PUBLIC API. First name, last name, purchase email, badge count, table count, claim IDs and verification data are never returned to the Program app.

INSTALL (after unzipping this patch)
1. Place this patch folder next to your current attendee Program app source.
2. In PowerShell, run:
   node .\install-program-patch.mjs "C:\PATH\TO\YOUR\CURRENT\PROGRAM-APP"
3. Upload/deploy the current Program app normally.

IMPORTANT
This is an additive patch. It does not replace app.js or your existing attendee data. This was intentionally designed that way because the live GitHub source was not available to this build session.
