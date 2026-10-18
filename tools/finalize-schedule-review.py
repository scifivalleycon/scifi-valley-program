from pathlib import Path

def once(s,a,b):
    assert s.count(a)==1,(a[:100],s.count(a))
    return s.replace(a,b,1)
p=Path('app.js');s=p.read_text()
s=once(s,'let savedScheduleLifecycleSignature="";','let savedScheduleLifecycleSignature="";\nlet savedScheduleInitialLoadComplete=false;')
s=once(s,'function expireSavedScheduleItems(now=Date.now()){','''function expireSavedScheduleItems(now=Date.now()){
  // Let startup load the latest end times before pruning older saved snapshots.
  if(!myConCatalogReady&&!myConDataLoaded&&!savedScheduleInitialLoadComplete)return 0;''')
s=once(s,'loadData().then(()=>{\n  startVisibleAppRefresh();','loadData().then(()=>{\n  savedScheduleInitialLoadComplete=true;\n  renderMySchedule();\n  startVisibleAppRefresh();')
s=once(s,'''}).catch(err=>{
  console.error(err);
  renderMySchedule();
  document.getElementById("happeningNow").innerHTML''','''}).catch(err=>{
  console.error(err);
  savedScheduleInitialLoadComplete=true;
  renderMySchedule();
  document.getElementById("happeningNow").innerHTML''')
p.write_text(s)
p=Path('tools/test-schedule-lifecycle.py');s=p.read_text()
s=once(s,' page.clock.install(time=datetime.fromisoformat(when.replace(\'Z\',\'+00:00\')))',''' page.clock.install(time=datetime.fromisoformat(when.replace('Z','+00:00')))
 # Keep unrelated delayed first-run prompts from intercepting real test clicks.
 # This override is test-only and is never part of the deployed app.
 page.add_init_script("const openDialog=HTMLDialogElement.prototype.showModal;HTMLDialogElement.prototype.showModal=function(){if(['pushPromptModal','myConSetupModal'].includes(this.id))return;return openDialog.call(this);};")''')
anchor="   ctx,page,errors=open_page(browser,'2026-10-18T17:15:00Z',width=320)"
extra='''   ctx,page,errors=open_page(browser,'2026-10-18T19:15:00Z',seed=False)
   page.evaluate("""() => {
     window.retainedPanels=state.panels;window.retainedSchedule=state.schedule;window.retainedOps=state.photoOps;
     myConCatalogReady=false;myConDataLoaded=false;savedScheduleInitialLoadComplete=false;
     state.panels=[];state.schedule=[];state.photoOps=[];
     const id='panel-panel-sunday-robin-lord-taylor-qanda-panel';state.mySchedule.add(id);
     savedScheduleSnapshots[id]={id,title:'Pending fresh schedule',day:'Sunday',time:'12:00 PM',endTime:'1:00 PM',endAt:Date.parse('2026-10-18T17:00:00Z'),endBasis:'published-end'};
     renderMySchedule();
   }""")
   assert ENDED in saved(page)
   page.evaluate("""() => {
     state.panels=window.retainedPanels;state.schedule=window.retainedSchedule;state.photoOps=window.retainedOps;
     state.panels.find(p=>p.id==='panel-sunday-robin-lord-taylor-qanda-panel').endTime='4:00 PM';
     myConCatalogReady=true;myConDataLoaded=true;reconcileMyCon();renderMySchedule();
   }""")
   assert ENDED in saved(page);assert page.locator('#schedulePreview .saved-event-ended').count()==0
   mark(engine+': startup waits for revised end time before removing stale snapshots');ctx.close()
'''
s=once(s,anchor,extra+anchor);p.write_text(s)
print('Startup preservation guard and test-only prompt isolation applied.')
