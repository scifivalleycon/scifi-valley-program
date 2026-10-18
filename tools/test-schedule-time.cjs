const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},Date,Intl};vm.createContext(ctx);vm.runInContext(fs.readFileSync('schedule-time.js','utf8'),ctx);
const t=ctx.window.SFVCScheduleTime,settings=JSON.parse(fs.readFileSync('data/settings.json'))[0],guide=JSON.parse(fs.readFileSync('data/events.json'));
const at=x=>Date.parse(x);let count=0;
function check(name,fn){fn();count++;console.log('PASS '+name);}
check('Correct day before, during and after the con using Eastern midnight',()=>{
 for(const [date,day] of [['2026-10-10T18:00:00Z','Friday'],['2026-10-16T05:00:00Z','Friday'],['2026-10-17T03:59:59.999Z','Friday'],['2026-10-17T04:00:00Z','Saturday'],['2026-10-18T03:59:59.999Z','Saturday'],['2026-10-18T04:00:00Z','Sunday'],['2026-10-26T10:00:00Z','Sunday']])assert.equal(t.defaultDay(settings,at(date)),day);
 assert.equal(t.defaultDay({startDate:'2027-06-11',endDate:'2027-06-13'},at('2027-06-12T15:00:00Z')),'Saturday');
});
check('Actual end and exactly two hours, not start time',()=>{
 const x=t.timing({day:'Sunday',time:'12:00 PM',endTime:'1:00 PM'},settings);
 assert.equal(x.startAt,at('2026-10-18T16:00:00Z'));assert.equal(x.endAt,at('2026-10-18T17:00:00Z'));
 assert.equal(t.status(x.endAt,x.endAt-1).ended,false);assert.equal(t.status(x.endAt,x.endAt).ended,true);
 assert.equal(t.status(x.endAt,x.endAt+7199999).expired,false);assert.equal(t.status(x.endAt,x.endAt+7200000).expired,true);
 assert.equal(t.status(t.timing({day:'Sunday',time:'1:00 PM',endTime:'4:00 PM'},settings).endAt,at('2026-10-18T18:30:00Z')).ended,false);
});
check('Time ranges, noon/midnight, explicit duration and invalid times',()=>{
 for(const time of ['2:00-3:00 PM','2:00 PM-3:00 PM','2:00\u20133:00 PM'])assert.equal(t.timing({day:'Sunday',time},settings).endAt,at('2026-10-18T19:00:00Z'));
 assert.equal(t.minutes('12:00 AM'),0);assert.equal(t.minutes('12:00 PM'),720);assert.equal(t.minutes('23:59'),1439);
 assert.equal(t.timing({day:'Sunday',time:'1:00 PM',durationMinutes:45},settings).endAt,at('2026-10-18T17:45:00Z'));
 for(const time of ['TBD','25:90 PM','13:00 PM',''])assert.equal(t.timing({day:'Sunday',time},settings).endAt,null);
 for(const end of [null,undefined,NaN,'1792342800000'])assert.equal(t.status(end,at('2030-01-01')).expired,false);
 assert.equal(t.timing({day:'Sunday',time:'1:00 PM',endTime:'1:00 PM'},settings).endAt,null);
});
check('Cross-midnight events use next-day end',()=>{
 const x=t.timing({day:'Saturday',time:'10:00 PM',endTime:'2:00 AM'},settings);
 assert.equal(x.endAt,at('2026-10-18T06:00:00Z'));assert.equal(t.status(x.endAt,at('2026-10-18T05:00:00Z')).ended,false);
 assert.equal(t.status(x.endAt,at('2026-10-18T08:00:00Z')).expired,true);
});
check('Published guide ranges are used without changing program data',()=>{
 const before=JSON.stringify(guide);
 for(const [day,time,title,date] of [['Saturday','10:00 PM','Official After Party','2026-10-18T06:00:00Z'],['Sunday','1:30 PM','Charity Quick Sketches','2026-10-18T18:30:00Z'],['Sunday','10:00 AM','Paint & Take / Build & Battle Opens','2026-10-18T19:00:00Z'],['Sunday','1:00 PM','HeroClix \u2013 Battle Royale','2026-10-18T20:00:00Z']]){
 const x=t.timing({day,time,title},settings,guide);assert.equal(x.basis,'guide-end');assert.equal(x.endAt,at(date));}
 assert.equal(JSON.stringify(guide),before);
});
check('Start-only listings stay through scheduled day',()=>{
 const x=t.timing({day:'Sunday',time:'11:10 AM',title:'Mike Vogel Photo Op'},settings,guide);
 assert.equal(x.basis,'day-end');assert.equal(x.endAt,at('2026-10-19T04:00:00Z'));
 assert.equal(t.status(x.endAt,at('2026-10-18T20:00:00Z')).ended,false);
});
check('DST, calendar validation, and nonexistent times',()=>{
 assert.equal(t.zonedTime('2026-01-18',720),at('2026-01-18T17:00:00Z'));
 assert.equal(t.zonedTime('2026-07-18',720),at('2026-07-18T16:00:00Z'));
 assert.equal(t.zonedTime('2026-02-30',720),null);assert.equal(t.zonedTime('2026-03-08',150),null);
});
console.log(JSON.stringify({result:'passed',groups:count,timezone:process.env.TZ||'default'}));
