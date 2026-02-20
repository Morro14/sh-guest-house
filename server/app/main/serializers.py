from rest_framework import serializers
from .models import Room, RoomReserved, Reservation
from django.db import transaction
from site_content.serializers import ImageSerializer


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


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ["check_in", "check_out", "email", "guest_name", "message"]

    @transaction.atomic
    def create(self, validated_data):
        rooms_data = self.context["token_content"]["rooms_selected"]
        reservation = Reservation.objects.create(**validated_data)
        room_instances = [
            RoomReserved(
                adults=int(room["guests"]["adults"]),
                children=int(room["guests"]["children"]),
                room=Room.objects.get(slug=room["slug"]),
                reservation=reservation,
            )
            for room in rooms_data
        ]
        RoomReserved.objects.bulk_create(room_instances)
        return reservation
