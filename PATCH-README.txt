SFVC HIGH TRAFFIC OPTIMIZATION PATCH — V4.48

Included files:
- app.js
- data/version.json
- index.html
- styles.css
- service-worker.js

What changed:
1. The app no longer reloads every program JSON file every 60 seconds.
   It now checks data/version.json first and only performs a full reload when the
   version changes, with a 10-minute fallback refresh for safety.
2. Background/device sync is now mostly event-driven. A light safety sync runs on
   a longer interval instead of re-syncing on every data refresh.
3. App registration sync is no longer sent on every reload. It now syncs when the
   user changes registration details, plus an occasional safety sync.
4. Periodic timers now use jitter so 1,000 phones do not all call the backend at
   the exact same second.
5. Analytics traffic was reduced by removing the normal redundant second request.

IMPORTANT FOR FUTURE DATA CHANGES:
Whenever you publish updated attendee-app data, also update data/version.json.
Change either the version string or generatedAt value. That is what tells the app
that new program data is available.
