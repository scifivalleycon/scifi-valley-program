/* Event schedule calculations always use the venue's Eastern Time, not the phone's zone. */
(() => {
  "use strict";
  const TIME_ZONE = "America/New_York";
  const RETENTION_MS = 2 * 60 * 60 * 1000;
  const DAYS = ["Friday", "Saturday", "Sunday"];
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  });
  function parts(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return null;
    return Object.fromEntries(formatter.formatToParts(date)
      .filter(p => p.type !== "literal").map(p => [p.type, Number(p.value)]));
  }
  function dateKey(value = Date.now()) {
    const p = parts(value);
    return p ? `${p.year}-${String(p.month).padStart(2,"0")}-${String(p.day).padStart(2,"0")}` : "";
  }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
    const ms = Date.parse(value + "T12:00:00Z");
    return Number.isFinite(ms) && new Date(ms).toISOString().slice(0,10) === value;
  }
  function addDays(date, count) {
    return validDate(date) ? new Date(Date.parse(date + "T12:00:00Z") + count * 86400000).toISOString().slice(0,10) : "";
  }
  function dayDates(settings) {
    return Object.fromEntries(DAYS.map((day,i) => [day, addDays(settings?.startDate,i)]));
  }
  function defaultDay(settings, now = Date.now()) {
    const dates = dayDates(settings), today = dateKey(now);
    if (!today || !dates.Friday || today < dates.Saturday) return "Friday";
    return today < dates.Sunday ? "Saturday" : "Sunday";
  }
  function minutes(value, inheritedPeriod = "") {
    const text = String(value || "").trim();
    if (/^noon$/i.test(text)) return 720;
    if (/^midnight$/i.test(text)) return 0;
    const m = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (!m) return null;
    let h = Number(m[1]);
    const min = Number(m[2] || 0), period = (m[3] || inheritedPeriod).toUpperCase();
    if (min > 59 || (period ? h < 1 || h > 12 : h > 23)) return null;
    if (!period && !m[2]) return null; // Never interpret an unexplained number as a time.
    if (period) h = h % 12 + (period === "PM" ? 12 : 0);
    return h * 60 + min;
  }
  function timeRange(value) {
    const normalized = String(value || "").replace(/[\u2013\u2014]/g,"-");
    const m = normalized.match(/(\d{1,2}:\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)\b/i);
    return m ? {start:minutes(m[1],m[2]||m[4]),end:minutes(m[3],m[4])} : null;
  }
  function zonedTime(date, minute) {
    if (!validDate(date) || !Number.isInteger(minute) || minute < 0 || minute >= 1440) return null;
    const [y,m,d] = date.split("-").map(Number);
    const target = Date.UTC(y,m-1,d,Math.floor(minute/60),minute%60);
    let candidate = target;
    for (let i=0;i<4;i++) {
      const p = parts(candidate);
      const observed = Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);
      const correction = target-observed;
      if (!correction) return candidate;
      candidate += correction;
    }
    return null; // Invalid/nonexistent local time: preserve the saved event instead of guessing.
  }
  function startMinutes(event) {
    const value = event?.time || event?.startTime || "";
    return timeRange(value)?.start ?? minutes(value);
  }
  function startAt(event, settings) {
    const date = dayDates(settings)[event?.day];
    return zonedTime(date, startMinutes(event));
  }
  function publishedGuideEnd(event, entries) {
    // These guide sections publish ranges for schedule rows that only show a start.
    // Match the day AND exact start so one session cannot borrow another's end.
    const rules = [
      [/^Charity Quick Sketches$/i,"quick-sketches"],
      [/^Medieval Combat Demo(?:s)?$/i,"medieval-combat"],
      [/^(?:Official|Saturday Night) After Party$/i,"after-party"],
      [/^Magic: The Gathering/i,"tabletop-gaming"],
      [/^HeroClix/i,"tabletop-gaming"],
      [/^Paint & Take \/ Build & Battle Opens$/i,"workshops"]
    ];
    const id = rules.find(([pattern]) => pattern.test(event?.title || ""))?.[1];
    if (!id || !DAYS.includes(event?.day)) return null;
    const guide = (entries || []).find(item => item?.id === id);
    const matches = new Set();
    for (const block of guide?.content || []) {
      if (block.type !== "schedule") continue;
      for (const row of block.items || []) {
        if (typeof row !== "string" || !new RegExp("\\b"+event.day+"\\b","i").test(row)) continue;
        const range = timeRange(row);
        if (range && range.start === startMinutes(event) && range.end !== range.start) matches.add(range.end);
      }
    }
    return matches.size === 1 ? [...matches][0] : null;
  }
  function timing(event, settings, guideEntries = []) {
    const date = dayDates(settings)[event?.day], start = startAt(event, settings);
    if (!Number.isFinite(start)) return {startAt:null,endAt:null,basis:"unknown"};
    const range = timeRange(event.time || event.startTime);
    let end = minutes(event.endTime), basis = "published-end";
    if (end === null && range) end = range.end;
    const startMinute = startMinutes(event);
    if (end !== null && end === startMinute) return {startAt:start,endAt:null,basis:"unknown"};
    if (end === null) {
      const duration = Number(event.durationMinutes);
      if (Number.isFinite(duration) && duration > 0 && duration <= 1440) {
        return {startAt:start,endAt:start+duration*60000,basis:"duration"};
      }
      end = publishedGuideEnd(event,guideEntries);
      basis = "guide-end";
    }
    if (end !== null) {
      return {startAt:start,endAt:zonedTime(end < startMinute ? addDays(date,1) : date,end),basis};
    }
    // An unpublished end is NOT the start. Keep start-only entries for the
    // whole scheduled day rather than prematurely claiming a session is over.
    return {startAt:start,endAt:zonedTime(addDays(date,1),0),basis:"day-end"};
  }
  function status(endAt, now = Date.now()) {
    const valid = typeof endAt === "number" && Number.isFinite(endAt);
    return {ended:valid && now >= endAt, expired:valid && now >= endAt + RETENTION_MS};
  }
  window.SFVCScheduleTime = Object.freeze({TIME_ZONE,RETENTION_MS,dateKey,dayDates,defaultDay,minutes,timeRange,zonedTime,startAt,timing,status});
})();
