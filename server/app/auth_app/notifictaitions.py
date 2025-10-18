import smtplib
from smtp_config import server, username, password, port
from auth_app.utils.jwt_ import CustomJWT


class EmailNotification:
    def __init__(self, server=server, username=username, password=password, port=port):
        self.server = server
        self.username = username
        self.password = password
        self.port = port

    def send(self, msg, reciever):
        try:
            with smtplib.SMTP_SSL(self.server, self.port) as server:
                server.login(self.username, self.password)
                server.sendmail(
                    from_addr=self.username, to_addrs=reciever, msg=msg.as_string()
                )
        except Exception as e:
            print("Exception during attempt to send email:", e)

