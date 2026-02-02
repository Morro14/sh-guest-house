def get_room_total_price(room, guests):
    adults = int(guests["adults"])
    children = int(guests["children"])

    price = adults * room.price + children * room.price

    return price


def get_reservation_price_total(rooms, rooms_guests, nights: int):
    rooms_price_per_night = 0
    for room in rooms:
        guests_in_room = next(
            (
                room_guests
                for room_guests in rooms_guests
                if room_guests["slug"] == room.slug
            ),
            None,
        )

        room_price = get_room_total_price(room, guests_in_room["guests"])
        rooms_price_per_night += room_price

    total_price = nights * rooms_price_per_night
    return total_price
