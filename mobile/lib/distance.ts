/*
  Haversine distance utility.

  Calculates the great-circle distance between two geographic coordinates
  and returns a human-readable string (e.g. "0.3 mi" or "12.4 mi").

  Used by the forum feed to show how far each post's location is from the user.
*/

const EARTH_RADIUS_MILES = 3958.8; // Mean Earth radius in miles

/**
 * Returns the distance in miles between two lat/lng pairs using the Haversine formula.
 */
export function haversineDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_MILES * c;
}

/**
 * Formats a distance in miles into a short readable string.
 *   < 0.1 mi  → "Nearby"
 *   < 10 mi   → "X.X mi"
 *   >= 10 mi  → "XX mi"
 */
export function formatMiles(miles: number): string {
  if (miles < 0.1) return 'Nearby';
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}