import { MapContainer } from "react-leaflet/MapContainer";
import {
  Popup,
  TileLayer,
  useMap,
  Marker,
  Polyline,
  Polygon,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { Button } from "@mui/joy";
import React from "react";
import { buildRoute } from "./../../../app/api/utils/way";
// @ts-ignore
import * as polyline from "@mapbox/polyline";
import { Box, Card } from "@mui/material";
import { ElementDto } from "../../../app/api/externalServicesApi";
import { useGetComputedRouteQuery } from "../../../api/externalServicesRktApi";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  busStopIcon,
  kerbIcon,
  rampIcon,
  tactilePavingIcon,
  toiletIcon,
  wheelchairIcon,
} from "./icons";

// Інтерфейс для координат інклюзивних місць
interface InclusiveCoordinate {
  id: number;
  lat?: number;
  lon?: number;
}

// Інтерфейс для повного інклюзивного місця
interface InclusivePlace {
  id: number;
  type: string;
  address: string;
  lat?: number;
  lon?: number;
  tags: {
    [key: string]: string;
  };
}

interface CurrentLocation {
  latitude: number;
  longitude: number;
  display_name: string;
}

interface RouteData {
  place: InclusivePlace;
  route: L.LatLngExpression[];
  userLocation: { lat: number; lon: number };
}

interface props {
  location: CurrentLocation;
  structures: ElementDto[];
  inclusivePlaces?: any[];
  inclusiveCoordinates?: InclusiveCoordinate[];
  inclusiveFeatures?: any[]; // Add this new prop
  showInclusiveFeatures?: boolean; // Add this new prop
  isLoadingInclusive?: boolean;
}

const Recenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
};

// Створення спеціальної іконки для інклюзивних місць
//const inclusiveIcon = new L.Icon({
//  iconUrl: "/path/to/inclusive-icon.png", // Замініть на шлях до вашої іконки для інклюзивних місць
//  iconSize: [25, 41],
//  iconAnchor: [12, 41],
//  popupAnchor: [1, -34],
//  shadowUrl: "leaflet/dist/images/marker-shadow.png",
//  shadowSize: [41, 41],
//  // Якщо у вас немає спеціальної іконки, можна використати стандартну з іншим кольором
//  className: "inclusive-marker", // Додайте CSS клас для стилізації
//});

const fetchStandardOsrmRoute = async (origin, destination) => {
  try {
    // Standard OSRM endpoint
    const url = `https://routing.openstreetmap.de/routed-foot/route/v1/walking/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=polyline&steps=true`;

    console.log("Fetching standard OSRM route:", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Standard OSRM response:", data);

    return data;
  } catch (error) {
    console.error("Error fetching standard OSRM route:", error);
    return null;
  }
};

export const Map = ({
  location,
  structures,
  inclusivePlaces = [],
  inclusiveCoordinates = [],
  inclusiveFeatures = [],
  showInclusiveFeatures = false,
  isLoadingInclusive = false,
}: props) => {
  const [routePoints, setRoutePoints] = useState<{
    origin: { lat: number; lon: number } | null;
    destination: { lat: number; lon: number } | null;
  }>({
    origin: null,
    destination: null,
  });

  const ENABLE_ROUTE_COMPARISON = true;

  const [polylines, setPolyline] = React.useState<L.LatLngExpression[]>([]);

  const [standardPolylines, setStandardPolyline] = useState<
    L.LatLngExpression[]
  >([]);
  // Add state to track which route is being displayed
  const [showStandardRoute, setShowStandardRoute] = useState(false);
  const [standardRouteInfo, setStandardRouteInfo] = useState({
    distance: 0,
    duration: 0,
  });

  const [routeCenter, setRouteCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { data: routeData, isLoading: isRouteLoading } =
    useGetComputedRouteQuery(
      routePoints.origin && routePoints.destination
        ? {
            originLatitude: routePoints.origin.lat,
            originLongitude: routePoints.origin.lon,
            destinationLatitude: routePoints.destination.lat,
            destinationLongitude: routePoints.destination.lon,
          }
        : skipToken
    );

  useEffect(() => {
    if (routeData && routeData.routes && routeData.routes.length > 0) {
      try {
        const route = routeData.routes[0];

        // Log the raw geometry for debugging
        console.log("Custom route geometry:", route.geometry);

        // Decode the polyline
        const decodedPolyline = polyline.decode(route.geometry);
        console.log("Decoded polyline:", decodedPolyline);

        // Process coordinates with proper scaling if needed
        const routeCoordinates = decodedPolyline.map((point) => {
          const lat = point[0] > 180 ? point[0] / 10 : point[0];
          const lng = point[1] > 180 ? point[1] / 10 : point[1];
          return [lat, lng];
        });

        console.log("Processed route coordinates:", routeCoordinates);

        // Set the polyline state
        setPolyline(routeCoordinates);

        // Calculate and set the route center for map centering
        if (routeCoordinates.length > 0) {
          const midIndex = Math.floor(routeCoordinates.length / 2);
          setRouteCenter({
            lat: routeCoordinates[midIndex][0],
            lng: routeCoordinates[midIndex][1],
          });
        }

        console.log(
          `Custom route loaded: ${route.distance}m, ${Math.round(
            route.duration / 60
          )} minutes`
        );
      } catch (error) {
        console.error("Error processing custom route data:", error);
      }
    }
  }, [routeData]);

  // In your useEffect for standard route
  useEffect(() => {
    // Check the feature flag before attempting to fetch
    if (!ENABLE_ROUTE_COMPARISON) return;

    // Only proceed if we have valid route points
    if (routePoints.origin && routePoints.destination) {
      fetchStandardOsrmRoute(routePoints.origin, routePoints.destination).then(
        (data) => {
          if (data && data.routes && data.routes.length > 0) {
            try {
              const standardRoute = data.routes[0];

              // Clearly label this as standard route in logs
              console.log("Standard route geometry:", standardRoute.geometry);

              const standardDecodedPolyline = polyline.decode(
                standardRoute.geometry
              );

              // Process the standard route (same scaling logic as custom route)
              const standardRouteCoordinates = standardDecodedPolyline.map(
                (point) => {
                  const lat = point[0] > 180 ? point[0] / 10 : point[0];
                  const lng = point[1] > 180 ? point[1] / 10 : point[1];
                  return [lat, lng];
                }
              );

              // Update ONLY standard polylines state
              setStandardPolyline(standardRouteCoordinates);

              // Store standard route metrics separately
              setStandardRouteInfo({
                distance: standardRoute.distance,
                duration: standardRoute.duration,
              });

              console.log(
                "Standard route loaded:",
                `${Math.round(standardRoute.distance)}m, ${Math.round(
                  standardRoute.duration / 60
                )} minutes`
              );
            } catch (error) {
              console.error("Error processing standard route data:", error);
            }
          }
        }
      );
    }
  }, [routePoints, ENABLE_ROUTE_COMPARISON]);

  const clearRoute = () => {
    setPolyline([]);
    // Only clear standard polylines if the feature is enabled
    if (ENABLE_ROUTE_COMPARISON) {
      setStandardPolyline([]);
      setShowStandardRoute(false);
    }
    setRoutePoints({ origin: null, destination: null });
    setRouteCenter(null);
  };

  const getStructurePosition = (structure): L.LatLngTuple | null => {
    // For node objects with direct coordinates
    if (
      structure.type === "node" &&
      structure.lat !== null &&
      structure.lon !== null
    ) {
      return [structure.lat, structure.lon];
    }

    // For way objects
    if (structure.type === "way") {
      // If the way has a pre-calculated center point
      if (structure.lat !== null && structure.lon !== null) {
        return [structure.lat, structure.lon];
      }

      // If the way has geometry (which it typically does from Overpass), use that
      if (structure.geometry && structure.geometry.length > 0) {
        const validPoints = structure.geometry.filter(
          (point) => point.lat !== null && point.lon !== null
        );

        if (validPoints.length > 0) {
          const sumLat = validPoints.reduce((sum, point) => sum + point.lat, 0);
          const sumLon = validPoints.reduce((sum, point) => sum + point.lon, 0);

          return [sumLat / validPoints.length, sumLon / validPoints.length];
        }
      }

      // If the way has bounds, use center of bounds
      if (structure.bounds) {
        const { minlat, minlon, maxlat, maxlon } = structure.bounds;
        return [(minlat + maxlat) / 2, (minlon + maxlon) / 2];
      }
    }

    // If no position could be determined
    return null;
  };

  // Toggle between routes (only if feature is enabled)
  const toggleRoute = () => {
    if (ENABLE_ROUTE_COMPARISON && standardPolylines.length > 0) {
      setShowStandardRoute((prev) => !prev);
    }
  };

  // Знаходження інклюзивного місця за його координатами
  const findInclusivePlaceById = (id: number) => {
    return inclusivePlaces.find((place) => place.id === id);
  };

  return (
    <div style={{ height: "100vh" }}>
      {/* Route info banner */}
      {isLoadingInclusive && (
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "8px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Завантаження інклюзивних об'єктів...
        </Box>
      )}
      {isRouteLoading && (
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "8px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Завантаження маршруту...
        </Box>
      )}

      {routeData && polylines.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "8px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div>
            {ENABLE_ROUTE_COMPARISON && showStandardRoute
              ? "Standard OSRM: "
              : "Custom OSRM: "}
            Distance:{" "}
            {ENABLE_ROUTE_COMPARISON &&
            showStandardRoute &&
            standardPolylines.length > 0
              ? Math.round(standardRouteInfo.distance) // Use actual standard route distance
              : Math.round(routeData.routes[0].distance)}
            m{" "}
            {/* Time display commented out for now
              | Time:{" "}
              {ENABLE_ROUTE_COMPARISON &&
              showStandardRoute &&
              standardPolylines.length > 0
                ? Math.round(standardRouteInfo.duration / 60) 
                : Math.round(routeData.routes[0].duration / 60)}{" "}
              min
            */}
          </div>

          {/* Only show toggle button if feature is enabled and we have standard route */}
          {ENABLE_ROUTE_COMPARISON && standardPolylines.length > 0 && (
            <Button size="sm" color="primary" onClick={toggleRoute}>
              {showStandardRoute ? "Show Custom Route" : "Show Standard Route"}
            </Button>
          )}

          <Button size="sm" color="danger" onClick={clearRoute}>
            Clear
          </Button>
        </Box>
      )}

      <MapContainer
        center={[49.84309611110559, 24.030603315948206]}
        zoom={17}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Центрування або на поточну позицію, або на середину маршруту */}
        {routeCenter ? (
          <Recenter lat={routeCenter.lat} lng={routeCenter.lng} />
        ) : (
          <Recenter lat={location.latitude} lng={location.longitude} />
        )}

        <Marker position={[location.latitude, location.longitude]}>
          <Popup>You</Popup>
        </Marker>

        {/* Відображення існуючих структур */}
        {structures.map((value) => {
          const position = getStructurePosition(value);
          if (!position) return null;

          return (
            <React.Fragment key={`structure-${value.id}`}>
              <Marker position={position}>
                <Popup>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <img
                      alt=""
                      src={value.imageUrls?.[0] || "/placeholder.png"}
                      style={{ height: "100px", width: "150px" }}
                    />
                    {value.tags && value.tags["name"] ? value.tags["name"] : ""}
                    <Button
                      onClick={() => {
                        setRoutePoints({
                          origin: {
                            lat: location.latitude,
                            lon: location.longitude,
                          },
                          destination: { lat: position[0], lon: position[1] },
                        });
                      }}
                    >
                      GO
                    </Button>
                  </Box>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {showInclusiveFeatures &&
          inclusiveFeatures.map((feature) => {
            const position = getStructurePosition(feature);
            if (!position) return null;

            // Function to determine icon based on feature type
            const getFeatureIcon = (feature) => {
              // You'll need to create appropriate icons for each feature type
              if (feature.tags && feature.tags.amenity === "toilets") {
                return toiletIcon; // Define these icons elsewhere
              } else if (feature.tags && feature.tags.highway === "bus_stop") {
                return busStopIcon;
              } else if (feature.tags && feature.tags.kerb === "flush") {
                return kerbIcon;
              } else if (
                feature.tags &&
                feature.tags.tactile_paving === "yes"
              ) {
                return tactilePavingIcon;
              } else if (feature.tags && feature.tags.ramp === "yes") {
                return rampIcon;
              } else {
                return wheelchairIcon;
              }
            };

            return (
              <React.Fragment key={`inclusive-${feature.id}`}>
                <Marker position={position} icon={getFeatureIcon(feature)}>
                  <Popup>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "250px",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                        {feature.tags?.name || "Інклюзивний об'єкт"}
                      </div>
                      {/* Show feature details */}
                      {feature.tags && (
                        <div>
                          {feature.tags.amenity === "toilets" && (
                            <div>Інклюзивний туалет</div>
                          )}
                          {feature.tags.highway === "bus_stop" && (
                            <div>Доступна автобусна зупинка</div>
                          )}
                          {feature.tags.kerb === "flush" && (
                            <div>Безбар'єрний бордюр</div>
                          )}
                          {feature.tags.tactile_paving === "yes" && (
                            <div>Тактильна плитка</div>
                          )}
                          {feature.tags.ramp === "yes" && <div>Пандус</div>}
                        </div>
                      )}
                      <Button
                        onClick={() => {
                          setRoutePoints({
                            origin: {
                              lat: location.latitude,
                              lon: location.longitude,
                            },
                            destination: { lat: position[0], lon: position[1] },
                          });
                        }}
                        sx={{ marginTop: "10px" }}
                      >
                        GO
                      </Button>
                    </Box>
                  </Popup>
                </Marker>

                {/* For ways (like ramps and tactile paving), show the area */}
                {feature.type === "way" && feature.geometry && (
                  <Polygon
                    positions={feature.geometry.map((p) => [p.lat, p.lon])}
                    pathOptions={{
                      color: "#3388ff",
                      weight: 2,
                      opacity: 0.7,
                      fillColor: "#3388ff",
                      fillOpacity: 0.3,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}

        {(!ENABLE_ROUTE_COMPARISON || !showStandardRoute) &&
          polylines.length > 0 && (
            <Polyline
              positions={polylines}
              pathOptions={{
                color: "blue",
                weight: 5,
                opacity: 0.7,
              }}
            />
          )}

        {/* Only render standard route if feature is enabled */}
        {ENABLE_ROUTE_COMPARISON &&
          showStandardRoute &&
          standardPolylines.length > 0 && (
            <Polyline
              positions={standardPolylines}
              pathOptions={{
                color: "red",
                weight: 5,
                opacity: 0.7,
                dashArray: "10, 5", // Make the standard route dashed for distinction
              }}
            />
          )}

        {/* Display comparison route with lower opacity */}
        {ENABLE_ROUTE_COMPARISON &&
          polylines.length > 0 &&
          standardPolylines.length > 0 && (
            <>
              {/* Show custom route with lower opacity when viewing standard */}
              {showStandardRoute && (
                <Polyline
                  positions={polylines}
                  pathOptions={{
                    color: "blue",
                    weight: 3,
                    opacity: 0.4,
                  }}
                />
              )}

              {/* Show standard route with lower opacity when viewing custom */}
              {!showStandardRoute && (
                <Polyline
                  positions={standardPolylines}
                  pathOptions={{
                    color: "red",
                    weight: 3,
                    opacity: 0.4,
                    dashArray: "10, 5",
                  }}
                />
              )}
            </>
          )}
      </MapContainer>
    </div>
  );
};
