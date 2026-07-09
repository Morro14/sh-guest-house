from django.core.management import BaseCommand
import json
import os
from django.conf import settings


class Command(BaseCommand):
    help = 'Parse front-end strings for translation and add them to "django.po" by running "get_translations_string.py" script in addition to django translation strings.'

    def handle(self, *args, **kwargs):
        print(settings.LANGUAGES)
        self.stdout.write("Generating frontend translation strings...")
        keys_paths = {
            lang[0]: f"locale/{lang[0]}/frontend_keys.json"
            for lang in settings.LANGUAGES
        }
        frontend_strings_path = {
            key[0]: os.path.join(
                settings.BASE_DIR,
                f"site_content/front_translations/{key[0]}/frontend_translations.py",
            )
            for key in settings.LANGUAGES
        }
        for lang, _ in settings.LANGUAGES:
            if not os.path.exists(keys_paths[lang]):
                self.stderr.write(f"Skipping {lang}: {keys_paths[lang]} not found.")
                continue
            print(f"generating translations for {lang}")
            keys = json.load(open(keys_paths[lang]))
            with open(frontend_strings_path[lang], "w", encoding="utf-8") as f:
                f.write("from django.utils.translation import gettext as _\n\n")
                for key in keys:
                    f.write(f"_('{key}')\n")
            # NEED MANUALLY SAVE THE OUTPUT FILE (NEED FIX)
            self.stdout.write(
                f"Created {frontend_strings_path[lang]} file with {len(keys)} keys"
            )

        self.stdout.write("Running makemessages...")
        self.stdout.write(
            f"Generating messages for {[key[0] for key in settings.LANGUAGES]}..."
        )
        # call_command("makemessages")
