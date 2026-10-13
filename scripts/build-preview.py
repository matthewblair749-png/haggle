"""Build a single self-contained HTML preview of the web app (bundle + fonts/sounds inlined).

Usage: npx expo export --platform web && python3 scripts/build-preview.py
Output: preview/haggle-preview.html (git-ignored), suitable for hosting at any path.
"""
import base64
import glob
import os
import re

MIME = {'ttf': 'font/ttf', 'wav': 'audio/wav', 'png': 'image/png'}

bundle = glob.glob('dist/_expo/static/js/web/entry-*.js')[0]
js = open(bundle).read()


def inline(m):
    path = m.group(1)
    f = 'dist' + path
    if not os.path.exists(f):
        return m.group(0)
    data = base64.b64encode(open(f, 'rb').read()).decode()
    return '"data:%s;base64,%s"' % (MIME[path.rsplit('.', 1)[1]], data)


js = re.sub(r'"(/assets/[^"]+\.(?:ttf|wav|png))"', inline, js).replace('</script', '<\\/script')

html = '''<title>Haggle</title>
<style>
/* Single light theme by design (the app is light-only for now): every color set explicitly. */
:root { --cream: #FFFBF2; --ink: #1D1D2B; color-scheme: light; }
html, body { height: 100%; }
body { margin: 0; overflow: hidden; background: var(--cream); color: var(--ink); }
#root { display: flex; height: 100%; flex: 1; }
</style>
<div id="root"></div>
<script>
// The router reads the URL path; start at home wherever the file is hosted.
try { history.replaceState(null, "", "/"); } catch (e) {}
</script>
<script>
''' + js + '''
</script>
'''
os.makedirs('preview', exist_ok=True)
open('preview/haggle-preview.html', 'w').write(html)
print('preview/haggle-preview.html', round(len(html) / 1e6, 2), 'MB')
