import json
import os
import requests
import base64
from urllib.parse import urlparse
from tkinter import Tk
from tkinter.filedialog import askopenfilename

# Hide the root tkinter window
Tk().withdraw()

# Prompt for HAR file
har_path = askopenfilename(title="Select HAR file", filetypes=[("HAR files", "*.har")])
if not har_path:
    print("No HAR file selected. Exiting.")
    exit()

# Custom base directory
base_dir = r"C:\Users\wvfat\Documents\githubshenanigans\funwebsite"

# Load HAR file
with open(har_path, 'r', encoding='utf-8') as f:
    har_data = json.load(f)

files_saved = 0
files_skipped = 0

for entry in har_data['log']['entries']:
    url = entry['request']['url']

    if url.startswith('data:'):
        files_skipped += 1
        continue

    parsed = urlparse(url)
    if not parsed.path:
        files_skipped += 1
        continue

    path = parsed.path.lstrip('/')
    local_path = os.path.join(base_dir, path.replace('/', os.sep))
    local_path = local_path.replace(':', '_').replace(r"_\Users", r":\Users")  # Replace ':' with '_' for Windows compatibility

    os.makedirs(os.path.dirname(local_path), exist_ok=True)

    content = entry.get('response', {}).get('content', {})
    try:
        if content.get('text'):
            mode = 'wb' if content.get('encoding') == 'base64' else 'w'
            with open(local_path, mode, encoding=None if mode == 'wb' else 'utf-8') as f:
                if mode == 'wb':
                    f.write(base64.b64decode(content['text']))
                else:
                    f.write(content['text'])
            print(f"Saved: {local_path}")
            files_saved += 1
        else:
            r = requests.get(url)
            with open(local_path, 'wb') as f:
                f.write(r.content)
            print(f"Downloaded & saved: {local_path}")
            files_saved += 1
    except Exception as e:
        print(f"Error saving {url} -> {local_path}: {e}")
        files_skipped += 1

print("\n✅ All done!")
print(f"Files saved: {files_saved}")
print(f"Files skipped: {files_skipped}")
