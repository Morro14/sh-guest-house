type PlaceTranslatedField = "name" | "description" | "info_link";

export const getPlaceFieldTranslation = (
  slug: string,
  field: PlaceTranslatedField,
) => {
  return `places.${slug}.${field}`;
};
