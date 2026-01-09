import secrets
import string


pool = string.ascii_letters + string.digits
key = "".join(secrets.choice(pool) for _ in range(16))
print(key)
