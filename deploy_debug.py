#!/usr/bin/env python3
import requests, os, zipfile

with open('/tmp/.nltok') as f:
    TOK = f.read().strip()

SITE = "miguelbolivar-portafolio"

with zipfile.ZipFile('/tmp/deploy.zip','w',zipfile.ZIP_DEFLATED) as z:
    for r,_,fs in os.walk('dist'):
        for f in fs:
            p = os.path.join(r, f)
            z.write(p, os.path.relpath(p, 'dist'))

with open('/tmp/deploy.zip','rb') as f:
    r = requests.post(
        f'https://api.netlify.com/api/v1/sites/{SITE}/deploys',
        headers={'Authorization': f'Bearer {TOK}', 'Content-Type': 'application/zip'},
        data=f, timeout=180)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:500]}")
