import type { MapLabelOptions } from "~/types/map";

export const placeLabelsData: { name: string; options: MapLabelOptions }[] = [
  { name: "spitakavor", options: { offsets: { x: 906, y: 462 } } },
  { name: "tanaat", options: { offsets: { x: 1167, y: 581 } } },
  { name: "areni", options: { offsets: { x: 239, y: 1083 } } },
  { name: "yeghegis", options: { offsets: { x: 944, y: 154 } } },
  { name: "tsahats", options: { offsets: { x: 904, y: 27 } } },
  { name: "yerevan", options: { offsets: { x: 64, y: 1036 }, dot: false } },

  {
    name: "sevan",
    options: { offsets: { x: 703, y: 49 }, dot: false },
  },
  {
    name: "goris",
    options: { offsets: { x: 2083, y: 1295 }, dot: false, group: "south-east" },
  },
  {
    name: "tatev",
    options: { offsets: { x: 2083, y: 1295 }, dot: false, group: "south-east" },
  },
  {
    name: "sisian",
    options: { offsets: { x: 2083, y: 1295 }, dot: false, group: "south-east" },
  },
  {
    name: "jermuk",
    options: { offsets: { x: 2083, y: 1295 }, dot: false, group: "south-east" },
  },
  {
    name: "dadal",
    options: { offsets: { x: 907, y: 1036 }, contentPosition: "bottom" },
  },
  {
    name: "noravank",
    options: { offsets: { x: 161, y: 1398 }, contentPosition: "bottom" },
  },
  { name: "surb_khach", options: { offsets: { x: 1505, y: 571 } } },
  { name: "vayotz_sar", options: { offsets: { x: 1888, y: 448 } } },
  {
    name: "yegheg museum",
    options: { offsets: { x: 922, y: 878 }, contentPosition: "bottom" },
  },
  { name: "ulgyur", options: { offsets: { x: 339, y: 727 } } },
];
