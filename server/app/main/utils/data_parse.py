from collections import defaultdict
import re


def parse_rooms_selected(request):
    data = list(request.data.items())
    rooms = defaultdict(dict)
    rooms_selected = []
    for key, value in data:
        match = re.match(r"\[(.+)\]\[(.+)\]", key)
        if match and value.isdigit():
            room_slug, guest_type = match.groups()
            rooms[room_slug][guest_type] = int(value)
    for key in rooms.keys():
        if rooms[key]["adults"] != 0 or rooms[key]["children"] != 0:
            rooms_selected.append({"slug": key, "guests": rooms[key]})
    return rooms_selected
