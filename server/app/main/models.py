from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Q
from datetime import timedelta
from django.core.exceptions import ValidationError


User = get_user_model()


class Reservation(models.Model):
	user = models.ForeignKey(to=User, on_delete=models.CASCADE)
	check_in = models.DateField()
	check_out = models.DateField()
	rooms = models.ManyToManyField(to="Room")

	# add rooms to check for overlapping reservations before saving
	def __init__(self, *args, rooms=None,**kwargs):
		super().__init__(*args,  **kwargs)
		self._unsaved_rooms = rooms or []

	def get_stay_days(self):
		delta = self.check_out - self.check_in
		print(type(delta), delta.days)
		return delta.days
	
	def clean(self):
		print(getattr(self, "_unsaved_rooms", []))
		if self.check_in >= self.check_out:
			raise ValidationError("Check-out date must be after check-in date.")
		for room in getattr(self, "_unsaved_rooms", []):
			overlap = Reservation.objects.filter(
				rooms=room,
				check_in__lt=self.check_out,
				check_out__gt=self.check_in,
			).exclude(pk=self.pk).exists()
			if overlap:
				raise ValidationError(f"Room '{room.name}' is already booked.")
		

		
	def save(self, *args, **kwargs):
		self.clean()
		super().save(*args, **kwargs)
		if hasattr(self, "_unsaved_rooms"):
			self.rooms.set(self._unsaved_rooms)
			del self._unsaved_rooms
	

class Room(models.Model):
	name = models.CharField(max_length=255)
	adults_num = models.IntegerField()
	children_num = models.IntegerField()



