from pathlib import Path
from datetime import datetime, timezone
import json, subprocess
root=Path(__file__).resolve().parents[1]
expected={'console-gallery.js':'34c309018ebb83efbec3fb9f4561fb71b9902358','console-gallery.css':'3b3e5d0ade835f5106c7b159b89e6e40f8301a29','app.js':'b7666131394fa3bd8111b4a88587aabd79bb65e0','index.html':'491327abf095dc60bc186315e93aee1c78453660','service-worker.js':'09cdb8ae53f15bc2174c1c45bf67aa7458f66d8f','data/version.json':'8c8fa60f881fec6b10074293b08860f27dda137b'}
for name,sha in expected.items():
 assert subprocess.check_output(['git','hash-object',str(root/name)],text=True).strip()==sha, 'Source changed: '+name
p=root/'console-gallery.js'
s=p.read_text()
s=s.replace('let modal, imageNode, stage, status, zoomButton, retryButton, returnFocus, activeImage;', 'let modal, imageNode, stage, surface, status, zoomButton, retryButton, returnFocus, activeImage;')
start=s.index('  function setZoom(value) {');end=s.index('\n  function loadImage()',start)
s=s[:start]+(root/'tools/console-reading-gestures.js').read_text()+s[end:]
s=s.replace('    imageNode?.remove();\n    status.hidden', '''    imageNode?.remove();
    geometry = null;
    gesture = null;
    surface.style.width = "100%";
    surface.style.height = "100%";
    stage.scrollLeft = 0;
    stage.scrollTop = 0;
    status.hidden''',1)
s=s.replace('    requestedImage.decoding = "async";', '    requestedImage.decoding = "async";\n    requestedImage.draggable = false;',1)
s=s.replace('      requestedImage.hidden = false;\n      status.hidden = true;', '      requestedImage.hidden = false;\n      layoutImage();\n      status.hidden = true;',1)
s=s.replace('    stage.append(requestedImage);','    surface.append(requestedImage);',1)
s=s.replace('    imageNode = null;\n    activeImage = null;', '''    imageNode = null;
    geometry = null;
    gesture = null;
    imageZoom = 1;
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = 0;
    activeImage = null;''',1)
start=s.index('      <div class="console-viewer-body">');end=s.index('`;\n    document.body.append(modal);',start)
s=s[:start]+'''      <div class="console-viewer-body">
        <div class="console-viewer-stage" tabindex="0" aria-label="Console poster. Pinch to zoom, then drag or scroll to read."><p class="console-viewer-status" role="status" aria-live="polite"></p><div class="console-viewer-surface"></div></div>
      </div>
      <footer class="console-viewer-footer">
        <div class="console-viewer-controls" role="group" aria-label="Console image controls">
          <button class="console-viewer-arrow console-viewer-previous" type="button" data-console-step="-1" data-font-scale="locked" aria-label="Previous console image" aria-controls="consoleImageTitle"><span aria-hidden="true">&#10094;</span></button>
          <button type="button" class="console-viewer-zoom" data-font-scale-max="1.5" aria-pressed="false">ZOOM IN</button>
          <span id="consoleImageProgress" class="console-viewer-progress" role="status" aria-live="polite" aria-atomic="true" data-font-scale="locked"></span>
          <button class="console-viewer-arrow console-viewer-next" type="button" data-console-step="1" data-font-scale="locked" aria-label="Next console image" aria-controls="consoleImageTitle"><span aria-hidden="true">&#10095;</span></button>
        </div>
        <button type="button" class="console-viewer-retry" hidden>RETRY IMAGE</button>
        <span class="console-viewer-hint">Pinch the poster to zoom. Drag to read.</span>
      </footer>''' +s[end:]
s=s.replace('    stage = modal.querySelector(".console-viewer-stage");', '    stage = modal.querySelector(".console-viewer-stage");\n    surface = modal.querySelector(".console-viewer-surface");',1)
s=s.replace('    retryButton.addEventListener("click", loadImage);','    retryButton.addEventListener("click", loadImage);\n    bindImageGestures();',1)
s=s.replace('      if (event.target === modal || event.target === stage) closeViewer();','      if (event.target === modal) closeViewer();',1)
p.write_text(s)
p=root/'console-gallery.css'
s=p.read_text();s=s[:s.index('/* Side controls stay fixed')]
s=s.replace('.console-viewer-stage{display:flex;align-items:center;justify-content:center;min-width:0;min-height:0;overflow:auto;padding:12px;box-sizing:border-box;overscroll-behavior:contain;touch-action:pan-x pan-y pinch-zoom}', '.console-viewer-stage{position:relative;display:block;min-width:0;min-height:0;overflow:auto;padding:0;box-sizing:border-box;overscroll-behavior:contain;touch-action:pan-x pan-y pinch-zoom;scroll-behavior:auto}')
s=s.replace('#consoleImageViewer .console-full-image{display:block;width:auto;height:auto;max-width:100%;max-height:100%;object-fit:contain;flex:0 0 auto}', '#consoleImageViewer .console-full-image{position:absolute;display:block;width:auto;height:auto;max-width:none;max-height:none;object-fit:contain;margin:0;user-select:none;-webkit-user-select:none;-webkit-user-drag:none}')
s=s.replace('#consoleImageViewer.console-zoomed .console-viewer-stage{display:block}\n#consoleImageViewer.console-zoomed .console-full-image{max-width:none;max-height:none;margin:0 auto;object-fit:initial}\n', '')
s=s.replace('.console-viewer-status{max-width:32em;text-align:center;font:16px/1.5 Arial,sans-serif}', '.console-viewer-status{position:absolute;inset:0;display:grid;place-items:center;margin:0;padding:20px;text-align:center;font:16px/1.5 Arial,sans-serif;pointer-events:none;box-sizing:border-box}')
s=s.replace('.console-viewer-footer{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:#242b2f;border-top:1px solid #485358}', '.console-viewer-footer{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-width:0;padding:8px max(12px,env(safe-area-inset-right,0px)) calc(8px + env(safe-area-inset-bottom,0px)) max(12px,env(safe-area-inset-left,0px));background:#242b2f;border-top:1px solid #485358}')
s+='''/* Navigation has its own row BELOW the poster, never over its text. */
.console-viewer-body{position:relative;min-width:0;min-height:0;overflow:hidden}
.console-viewer-body>.console-viewer-stage{width:100%;height:100%}
.console-viewer-surface{position:relative;width:100%;height:100%;overflow:hidden}
.console-viewer-stage.console-image-gestures{touch-action:none}
#consoleImageViewer.console-zoomed .console-viewer-stage{cursor:grab}
.console-viewer-controls{display:grid;grid-template-columns:44px minmax(0,1fr) 58px 44px;align-items:center;gap:8px;width:100%;max-width:430px;min-width:0}
#consoleImageViewer .console-viewer-arrow{position:static;display:grid;place-items:center;width:44px;height:44px;min-width:44px;min-height:44px;padding:0;border:1px solid #a8dadb;border-radius:6px;background:#171b1d;color:#fff;font-size:18px;line-height:1;box-shadow:none;transform:none;touch-action:manipulation}
#consoleImageViewer .console-viewer-arrow:hover{background:#34484e}
#consoleImageViewer .console-viewer-arrow:disabled{opacity:.4;cursor:default}
#consoleImageViewer .console-viewer-zoom{min-width:0;min-height:44px;padding:8px;white-space:normal;overflow-wrap:anywhere;line-height:1.2}
#consoleImageViewer .console-viewer-progress{display:block;min-width:0;text-align:center;font:700 13px/1.3 "Trebuchet MS",Arial,sans-serif;font-variant-numeric:tabular-nums;color:#a8dadb}
#consoleImageViewer .console-viewer-hint{display:block;text-align:center;font:12px/1.3 Arial,sans-serif;color:#d3d8da}
@media(max-height:450px){#consoleImageViewer .console-viewer-hint{display:none}.console-viewer-footer{padding-top:5px;padding-bottom:calc(5px + env(safe-area-inset-bottom,0px))}.console-viewer-header{padding-top:calc(5px + env(safe-area-inset-top,0px));padding-bottom:5px}}
'''
p.write_text(s)
for name in ['app.js','index.html','service-worker.js']:
 p=root/name;s=p.read_text();s=s.replace('4.111','4.112').replace('console-navigation-v4.112','console-reading-v4.112');p.write_text(s)
p=root/'data/version.json';data=json.loads(p.read_text());data.update(version='program-v4.112-console-reading-controls',generatedAt=datetime.now(timezone.utc).isoformat(),source='console-reading-controls-release');p.write_text(json.dumps(data,indent=2)+'\n')
print('Patched only console controls, image-only gestures, and release markers.')
