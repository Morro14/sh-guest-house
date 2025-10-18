from django.test import TestCase as TestCaseDj
from django.contrib.auth import get_user_model


USER = get_user_model()



class LoginTest(TestCaseDj):
    def setUp(self):
        USER.objects.create(email="test@email.com", password="password123")

    def test_login(self):
        email = "test@email.com"
        password = "password123"
        response = self.client.post(
            "http://127.0.0.1:8000/auth/login",
            data={"email": email, "password": password},
        )
        print(response.json())
