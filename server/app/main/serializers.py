from rest_framework import serializers
from .models import Room, Image, Place, WideImage


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["order", "variants"]


class ImageWideSerializer(serializers.ModelSerializer):
    class Meta:
        model = WideImage
        fields = ["order", "variants"]


class RoomSerializer(serializers.ModelSerializer):
    images = ImageSerializer(source="image", many=True, read_only=True)

    class Meta:
        model = Room
        fields = [
            "slug",
            "name",
            "adults_num",
            "children_num",
            "images",
            "beds",
        ]


class PlaceSerializer(serializers.ModelSerializer):
    images = ImageSerializer(source="image", many=True, read_only=True)

    class Meta:
        model = Place
        fields = [
            "slug",
            "name",
            "description",
            "distance",
            "distance_comment",
            "images",
        ]
