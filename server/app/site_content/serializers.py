from rest_framework import serializers
from .models import Image, WideImage, Place, ContentPage, GridImage
from main.models import Room


class ContentPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentPage
        fields = ["slug", "title", "body"]


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["order", "variants", "alt_text"]


class ImageGridSerializer(serializers.ModelSerializer):
    class Meta:
        model = GridImage
        fields = ["order", "variants", "alt_text", "format_in_grid"]


class ImageWideSerializer(serializers.ModelSerializer):
    class Meta:
        model = WideImage
        fields = ["order", "variants", "alt_text"]


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
            "price",
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
            "geoloc",
            "info_link",
        ]
