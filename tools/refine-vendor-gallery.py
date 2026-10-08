from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'vendor-gallery.css'
p.write_text(p.read_text()+'\n/* Keep the screen-reader announcement out of the visible grid layout. */\n#vendorGalleryAnnouncement{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important}\n')
p=ROOT/'vendor-gallery.js'
p.write_text(p.read_text().replace('LOOPS AUTOMATICALLY','LOOPS BACK TO START'))
p=ROOT/'tools/test-vendor-gallery.py'
s=p.read_text()
s=s.replace("        page.wait_for_function('window.SFVCVendorGallery && myConDataLoaded')", "        page.wait_for_function('window.SFVCVendorGallery && myConDataLoaded')\n        # Allow the existing first-visit alerts prompt to finish before dismissing it.\n        page.wait_for_timeout(2000)")
s=s.replace("        assert viewer.evaluate('(el)=>el.scrollWidth<=el.clientWidth+1')", "        assert viewer.evaluate('(el)=>el.scrollWidth<=el.clientWidth+1')\n        assert viewer.locator('#vendorGalleryAnnouncement').bounding_box()['width'] <= 1")
p.write_text(s)
