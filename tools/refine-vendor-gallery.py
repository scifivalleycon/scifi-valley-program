from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'vendor-gallery.css'
p.write_text(p.read_text()+'\n/* Keep the screen-reader announcement out of the visible grid layout. */\n#vendorGalleryAnnouncement{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important}\n')
p=ROOT/'vendor-gallery.js'
s=p.read_text().replace('LOOPS AUTOMATICALLY','LOOPS BACK TO START')
s=s.replace('    modal.addEventListener("close", () => {\n      ++loadNumber;', '    modal.addEventListener("close", () => {\n      // Ignore a queued close event if the viewer has already reopened.\n      if (modal.open) return;\n      ++loadNumber;')
p.write_text(s)
p=ROOT/'tools/test-vendor-gallery.py'
s=p.read_text()
s=s.replace("        page.wait_for_function('window.SFVCVendorGallery && myConDataLoaded')", "        page.wait_for_function('window.SFVCVendorGallery && myConDataLoaded')\n        # Allow the existing first-visit alerts prompt to finish before dismissing it.\n        page.wait_for_timeout(2000)")
s=s.replace("        assert viewer.evaluate('(el)=>el.scrollWidth<=el.clientWidth+1')", "        assert viewer.evaluate('(el)=>el.scrollWidth<=el.clientWidth+1')\n        assert viewer.locator('#vendorGalleryAnnouncement').bounding_box()['width'] <= 1")
s=s.replace("        failed.add('/test-vendor-photos/a4.webp')", "        # Use a never-loaded image so the browser cannot reuse decoded image memory.\n        failed.add('/test-vendor-photos/a4-failing.webp')\n        live[2]['photos'][0]=photos('a4-failing')[0]\n        page.evaluate('refreshLiveVendorDirectory(\"gallery-test\")')")
s=s.replace("        assert not page.evaluate('document.documentElement.classList.contains(\"vendor-gallery-open\")')", "        # Native dialog close events are queued after the open attribute is removed.\n        page.wait_for_function('!document.documentElement.classList.contains(\"vendor-gallery-open\")')")
p.write_text(s)
