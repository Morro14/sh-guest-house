from rest_framework import serializers
from .models import Image, WideImage, Place, ContentPage, GridImage, Review, ImageGrid
from main.models import Room


class ContentPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentPage
        fields = ["tag", "title", "body"]


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["order", "variants", "alt_text"]


class GridImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GridImage
        fields = ["order", "variants", "alt_text", "format_in_grid"]


class ImageGridSerializer(serializers.ModelSerializer):
    grid_images = GridImageSerializer(source="grid_image", many=True, read_only=True)

    class Meta:
        model = ImageGrid
        fields = ["index", "grid_images"]


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


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
