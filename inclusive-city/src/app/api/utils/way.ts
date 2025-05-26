// app/api/utils/way.ts

import L from "leaflet";
// @ts-ignore
import * as polyline from "@mapbox/polyline";

/**
 * Створює маршрут між координатами користувача та об'єкта
 * @param destLat Широта пункту призначення
 * @param destLon Довгота пункту призначення
 * @param userLat Широта користувача
 * @param userLon Довгота користувача
 * @returns масив координат маршруту
 */
export async function buildRoute(
  destLat: number,
  destLon: number,
  userLat: number,
  userLon: number
): Promise<L.LatLngExpression[]> {
  try {
    const api_key = "7c9099e3-b0b8-405d-8ad5-ee9eb8c01bd4";

    console.log(`Building route from [${userLat}, ${userLon}] to [${destLat}, ${destLon}]`);

    const options_: RequestInit = {
      body: JSON.stringify({
        points: [
          [userLon, userLat],
          [destLon, destLat], 
        ],
        vehicle: "foot", 
        // locale: "uk", // Use Ukrainian locale
        instructions: true,
        calc_points: true,
        points_encoded: true,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const response = await fetch(
      "https://graphhopper.com/api/1/route?key=" + api_key,
      options_
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GraphHopper API error:", errorText);
      throw new Error("Не вдалося отримати маршрут з GraphHopper: " + response.status);
    }

    const result = await response.json();
    
    if (!result.paths || !result.paths[0] || !result.paths[0].points) {
      console.error("Unexpected GraphHopper response format:", result);
      throw new Error("Неочікуваний формат відповіді від GraphHopper");
    }
    
    console.log("Route received, distance:", result.paths[0].distance, "m, time:", result.paths[0].time / 1000, "s");
    
    // Decode the polyline
    const decodedPath = polyline.decode(result.paths[0].points);
    console.log("Decoded path points:", decodedPath.length);
    console.log("Decoded path points:", decodedPath);
    
    return decodedPath;
  } catch (error) {
    console.error("Error in buildRoute:", error);
    throw error;
  }
}