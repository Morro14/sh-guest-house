from rest_framework import serializers
from .models import Room, Reservation, RoomImage


class RoomImageSerializer(serializers.ModelSerializer):
	class Meta:
		model = RoomImage
		fields = ['order','variants']

class RoomSerializer(serializers.ModelSerializer):
	images = RoomImageSerializer(source='image', many=True, read_only=True )
	class Meta:
		model = Room
		fields = ['slug', 'name', 'adults_num', 'children_num', 'images']