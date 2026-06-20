import type { Room } from "~/types/booking";
interface GuestPerRoomSelected {
  slug: string;
  guests: {
    adults: number;
    children: number;
  };
}

export interface LoaderData {
  guests_per_room_selected: GuestPerRoomSelected[];
  price_total: number;
  rooms: Room[];
  request_info: {
    adults: string;
    children: string;
    date: string;
    nights: string;
  };
}
