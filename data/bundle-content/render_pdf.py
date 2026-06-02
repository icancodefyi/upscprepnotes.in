#!/usr/bin/env python3
import sys
import os
import subprocess

template_path = sys.argv[1]
content_path = sys.argv[2]
output_path = sys.argv[3]

with open(template_path, 'r') as f:
    template = f.read()

with open(content_path, 'r') as f:
    content = f.read()

html = template.replace('__CONTENT__', content)

tmp_html = output_path + '.tmp.html'
with open(tmp_html, 'w') as f:
    f.write(html)

env = os.environ.copy()
env['PATH'] = os.path.expanduser('~/.local/bin') + ':' + env.get('PATH', '')

result = subprocess.run(
    ['weasyprint', tmp_html, output_path],
    capture_output=True, text=True, env=env
)

os.remove(tmp_html)

if result.returncode != 0:
    print(f"Error: {result.stderr}")
    sys.exit(1)
else:
    print(f"Generated: {output_path}")
