import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

ROTATING_HTML = (
'\n'
'<!-- ===============================================================\n'
'     3D ROTATING TAGLINE STRIP\n'
'     =============================================================== -->\n'
'<section class="rotating-tagline-section" id="rotating-tagline-strip">\n'
'  <div class="rtl-ambient-glow" aria-hidden="true"></div>\n'
'  <div class="rtl-inner">\n'
'    <div class="rtl-left-label" aria-hidden="true">\n'
'      <span class="rtl-label-line"></span>\n'
'      <span class="rtl-label-text">WE DO</span>\n'
'      <span class="rtl-label-line"></span>\n'
'    </div>\n'
'    <div class="rtl-stage" id="rtlStage">\n'
'      <div class="rtl-perspective-wrap" id="rtlPerspWrap">\n'
'        <div class="rtl-slot rtl-slot-active" id="rtlSlotA">\n'
'          <div class="rtl-pill" id="rtlPillA">\n'
'            <div class="rtl-pill-icon-wrap" id="rtlIconA">\n'
'              <svg class="rtl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>\n'
'            </div>\n'
'            <span class="rtl-pill-text" id="rtlTextA">Videos That Engage.</span>\n'
'            <div class="rtl-pill-glare" id="rtlGlareA" aria-hidden="true"></div>\n'
'          </div>\n'
'        </div>\n'
'        <div class="rtl-slot rtl-slot-next" id="rtlSlotB">\n'
'          <div class="rtl-pill rtl-pill-b" id="rtlPillB">\n'
'            <div class="rtl-pill-icon-wrap" id="rtlIconB">\n'
'              <svg class="rtl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>\n'
'            </div>\n'
'            <span class="rtl-pill-text" id="rtlTextB">Marketing That Converts.</span>\n'
'            <div class="rtl-pill-glare" id="rtlGlareB" aria-hidden="true"></div>\n'
'          </div>\n'
'        </div>\n'
'      </div>\n'
'    </div>\n'
'    <div class="rtl-dots" id="rtlDots" aria-hidden="true">\n'
'      <span class="rtl-dot rtl-dot-active" data-idx="0"></span>\n'
'      <span class="rtl-dot" data-idx="1"></span>\n'
'      <span class="rtl-dot" data-idx="2"></span>\n'
'    </div>\n'
'  </div>\n'
'</section>\n'
'<!-- =============================================================== -->\n'
)

NEEDLE = '</svg></div></a></div></div></section>\n<section class="step-section"'
REPLACEMENT = '</svg></div></a></div></div></section>' + ROTATING_HTML + '<section class="step-section"'

if NEEDLE in content:
    new_content = content.replace(NEEDLE, REPLACEMENT, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS - rotating section inserted')
else:
    print('NEEDLE NOT FOUND')
    # debug: show surrounding area
    idx = content.find('</section>\n<section class="step-section"')
    print('Alt needle idx:', idx)
    if idx >= 0:
        print(repr(content[idx-30:idx+80]))
