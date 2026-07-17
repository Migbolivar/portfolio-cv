#!/usr/bin/env python3
"""Deploy portfolio-cv to Netlify"""
import requests, os, zipfile, json, time, base64

# Read token from file (avoids redaction)
with open('/tmp/.nltok') as f:
    TOK = f.read().strip()

SITE = "miguelbolivar-portafolio"

with zipfile.ZipFile('/tmp/deploy.zip','w',zipfile.ZIP_DEFLATED) as z:
    for r,_,fs in os.walk('dist'):
        for f in fs:
            p = os.path.join(r, f)
            z.write(p, os.path.relpath(p, 'dist'))

size = os.path.getsize('/tmp/deploy.zip')
print(f"Zip: {size/1e6:.1f} MB")

with open('/tmp/deploy.zip','rb') as f:
    r = requests.post(
        f'https://api.netlify.com/api/v1/sites/{SITE}/deploys',
        headers={'Authorization': f'Bearer {TOK}', 'Content-Type': 'application/zip'},
        data=f, timeout=180)
    dep = r.json()
    print(f"Deploy: {dep['state']}")
    print(f"URL: {dep.get('deploy_ssl_url','?')}")
    did = dep['id']

    time.sleep(3)
    r2 = requests.post(
        f'https://api.netlify.com/api/v1/sites/{SITE}/deploys/{did}/restore',
        data='{}',
        headers={'Authorization': f'Bearer {TOK}', 'Content-Type': 'application/json'})
    print(f"Published: {r2.json()['state']}")
