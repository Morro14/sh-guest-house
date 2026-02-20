from django.conf import settings
import os
import json

keys_path = os.path.join(settings.BASE_DIR, "site_content/translations.json")
keys = json.load(keys_path)

with open("frontend_tr_strings.py") as f:
    for key in keys:
        f.write("f_({key})\n")
