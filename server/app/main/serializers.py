from rest_framework import serializers
from .models import Room, Reservation

class RoomSerializer(serializers.ModelSerializer):
	class Meta:
		model = Room
		fields = '__all__'