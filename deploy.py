#!/usr/bin/env python3
import requests, os, zipfile, time

with open('/tmp/.nltok') as f:
    TOK = f.read().strip()

SITE_ID = "d19b33ad-226d-4596-90fe-0a36d1f72701"

with zipfile.ZipFile('/tmp/deploy.zip','w',zipfile.ZIP_DEFLATED) as z:
    for r,_,fs in os.walk('dist'):
        for f in fs:
            p = os.path.join(r, f)
            z.write(p, os.path.relpath(p, 'dist'))

print(f"Zip: {os.path.getsize('/tmp/deploy.zip')/1e6:.1f} MB")

with open('/tmp/deploy.zip','rb') as f:
    r = requests.post(
        f'https://api.netlify.com/api/v1/sites/{SITE_ID}/deploys',
        headers={'Authorization': f'Bearer {TOK}', 'Content-Type': 'application/zip'},
        data=f, timeout=180)
    dep = r.json()
    print(f"Status: {r.status_code}")
    for k in ['id','state','deploy_ssl_url','error','message']:
        if k in dep:
            print(f"  {k}: {dep[k]}")

    if dep.get('state') in ('ready','uploaded'):
        did = dep['id']
        time.sleep(3)
        r2 = requests.post(
            f'https://api.netlify.com/api/v1/sites/{SITE_ID}/deploys/{did}/restore',
            data='{}',
            headers={'Authorization': f'Bearer {TOK}', 'Content-Type': 'application/json'})
        pub = r2.json()
        print(f"Published: {pub.get('state')}  URL: {pub.get('deploy_ssl_url','?')}")
    elif dep.get('state'):
        # May already be processing
        print(f"State: {dep['state']} — waiting...")
        time.sleep(5)
        r2 = requests.get(
            f'https://api.netlify.com/api/v1/sites/{SITE_ID}/deploys?per_page=1',
            headers={'Authorization': f'Bearer {TOK}'})
        latest = r2.json()[0]
        print(f"Latest deploy: {latest['state']} — {latest.get('deploy_ssl_url','?')}")
