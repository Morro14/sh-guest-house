from django.core.management import BaseCommand, call_command
import json, os
from django.conf import settings


class Command(BaseCommand):
	help = 'Parse front-end strings for translation and add them to "django.po" by running "get_translations_string.py" script in addition to django translation strings.'

	def handle(self, *args, **kwargs):
		self.stdout.write('Generating frontend translation strings...')
		keys_path = os.path.join(settings.BASE_DIR, "main/translation.json")
		frontend_strins_path = os.path.join(settings.BASE_DIR, "main/utils/frontend_tr_strings.py")
		keys = json.load(open(keys_path))
		if keys_path:
			with open(frontend_strins_path, 'w', encoding='utf-8') as f:
				f.write('from django.utils.translation import gettext as _\n\n')
				for key in keys:
					f.write(f"_('{key}')\n")
				self.stdout.write(f'Created {frontend_strins_path} file with {len(keys)} keys')
		else:
				self.stdout.write('No translation key file found')
		self.stdout.write("Running makemessages...")
		for lang_code, _ in settings.LANGUAGES:
			self.stdout.write(f"Generating messages for {lang_code}...")
			call_command('makemessages', locale=[lang_code])
			