import hashlib, os
from django.conf import settings


def get_translation_version():
	"""
    Automatically generate a version string based on modification times
    of all .mo files in the locale directory.
    """
	locale_path = os.path.join(settings.BASE_DIR, 'locale')
	hash_data = ''

	if not locale_path:
		return 'no locale'
	
	for root, dir, files in os.walk(locale_path):
		for file in files:
			if file.endswith('mo'):
				path = os.path.join(root, file)
				mtime = os.path.getmtime(path)
				hash_data += f"{file}:{mtime}"

	if not hash_data:
		return 'no translations'
	
	version = hashlib.md5(hash_data.encode()).hexdigest()[:8]
	return version
