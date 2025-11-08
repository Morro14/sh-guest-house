from rest_framework import serializers
from .models import Room, RoomImage, Place, PlaceImage


class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['order', 'variants']


class RoomSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(source='image', many=True, read_only=True)

    class Meta:
        model = Room
        fields = ['slug', 'name', 'adults_num', 'children_num', 'images']


class PlaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceImage
        fields = ['order', 'variants']


class PlaceSerializer(serializers.ModelSerializer):
    images = PlaceImageSerializer(source='image', many=True, read_only=True)

    class Meta:
        model = Place
        fields = ['slug', 'name', 'description',
                  'distance', 'distance_comment', 'images']
