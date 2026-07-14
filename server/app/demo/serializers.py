from rest_framework import serializers
from .models import (
    ImageDemo,
    WideImageDemo,
    PlaceDemo,
    ContentPageDemo,
    GridImageDemo,
    ReviewDemo,
    ImageGridDemo,
    RoomDemo,
    ReservationDemo,
    RoomReservedDemo,
)

from django.db import transaction


class ContentPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentPageDemo
        fields = ["tag", "title", "body"]


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageDemo
        fields = ["order", "variants", "alt_text"]


class GridImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GridImageDemo
        fields = ["order", "variants", "alt_text", "format_in_grid"]


class ImageGridSerializer(serializers.ModelSerializer):
    grid_images = GridImageSerializer(source="grid_image", many=True, read_only=True)

    class Meta:
        model = ImageGridDemo
        fields = ["index", "grid_images"]


class ImageWideSerializer(serializers.ModelSerializer):
    class Meta:
        model = WideImageDemo
        fields = ["order", "variants", "alt_text"]


class RoomSerializer(serializers.ModelSerializer):
    images = ImageSerializer(source="image", many=True, read_only=True)

    class Meta:
        model = RoomDemo
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
        model = PlaceDemo
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
        model = ReviewDemo
        fields = "__all__"


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationDemo
        fields = ["check_in", "check_out", "email", "guest_name", "message"]

    @transaction.atomic
    def create(self, validated_data):
        rooms_data = self.context["token_content"]["rooms_selected"]
        reservation = ReservationDemo.objects.create(**validated_data)
        room_instances = [
            RoomReservedDemo(
                adults=int(room["guests"]["adults"]),
                children=int(room["guests"]["children"]),
                room=RoomDemo.objects.get(slug=room["slug"]),
                reservation=reservation,
            )
            for room in rooms_data
        ]
        RoomReservedDemo.objects.bulk_create(room_instances)
        return reservation
