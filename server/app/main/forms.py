from django import forms


class ReservationReplyForm(forms.Form):
    email_body = forms.CharField(
        widget=forms.Textarea(attrs={"rows": 10, "cols": 80}),
        label="Custom Email Message",
        required=True,
    )

    def __init__(self, message_init, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email_body"].initial = message_init
