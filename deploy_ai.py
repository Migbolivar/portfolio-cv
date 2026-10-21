#!/usr/bin/env python3
"""Deploy AI portfolio"""
import requests, os, zipfile, time
with open('/tmp/.nltok') as f: TOK = f.read().strip()
SITE_ID = "10e29a4e-3cca-49e7-85f9-9af82b077ed8"
with zipfile.ZipFile('/tmp/ai-deploy.zip','w',zipfile.ZIP_DEFLATED) as z:
    z.write('/tmp/ai-final2.html', 'index.html')
with open('/tmp/ai-deploy.zip','rb') as f:
    url = f"https://api.netlify.com/api/v1/sites/{SITE_ID}/deploys"
    r = requests.post(url, headers={'Authorization': f'Bearer {TOK}', 'Content-Type': 'application/zip'}, data=f, timeout=60)
    dep = r.json(); print(f"State: {dep.get('state')}")
    if dep.get('state') in ('ready','uploaded'):
        time.sleep(2)
        r2 = requests.post(f"{url}/{dep['id']}/restore", data='{}',
            headers={'Authorization': f'Bearer {TOK}', 'Content-Type': 'application/json'})
        print(f"Published: {r2.json()['state']}")
