import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CSS link after custom-theme.css
css_needle = 'css/custom-theme.css?v=2.7'
if 'rotating-tagline.css' not in content:
    content = content.replace(
        css_needle + '" rel="stylesheet" type="text/css" />',
        css_needle + '" rel="stylesheet" type="text/css" />\n<link href="css/rotating-tagline.css?v=1.0" rel="stylesheet" type="text/css" />',
        1
    )
    print('CSS link added')
else:
    print('CSS link already exists')

# 2. Add JS before closing body
js_needle = 'js/hero-3d.js?v=1.5'
if 'rotating-tagline.js' not in content:
    content = content.replace(
        '<script src="' + js_needle + '"></script>',
        '<script src="' + js_needle + '"></script>\n<script src="js/rotating-tagline.js?v=1.0"></script>',
        1
    )
    print('JS link added')
else:
    print('JS link already exists')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('DONE')
