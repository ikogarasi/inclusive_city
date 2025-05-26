import { MapContainer } from "react-leaflet/MapContainer";
import { Popup, TileLayer, useMap, Marker, Polyline } from "react-leaflet";
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
  inclusiveCoordinates?: InclusiveCoordinate[];
  inclusivePlaces?: InclusivePlace[];
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

export const Map = ({
  location,
  structures,
  inclusiveCoordinates = [],
  inclusivePlaces = [],
}: props) => {
  const [polylines, setPolyline] = React.useState<L.LatLngExpression[]>([]);
  const [isActive, setActivePlace] = React.useState<InclusivePlace | null>(
    null
  );
  const api_key = "7c9099e3-b0b8-405d-8ad5-ee9eb8c01bd4";
  const [routeCenter, setRouteCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const routeDataString = sessionStorage.getItem("routeData");

    if (routeDataString) {
      try {
        const decodedRoute: L.LatLngExpression[] = JSON.parse(routeDataString);
        console.log("✅ Loaded route from sessionStorage:", decodedRoute);

        if (decodedRoute.length > 0) {
          setPolyline(decodedRoute);

          // Центруємо карту на середню точку маршруту
          const midIndex = Math.floor(decodedRoute.length / 2);
          const midPoint = decodedRoute[midIndex] as [number, number];
          setRouteCenter({ lat: midPoint[0], lng: midPoint[1] });
        } else {
          console.warn("⚠️ Route array is empty.");
        }

        // Очищуємо збережені дані, щоб маршрут не з’являвся знову при перезавантаженні
        sessionStorage.removeItem("routeData");
      } catch (error) {
        console.error("❌ Error parsing route from sessionStorage:", error);
      }
    }
  }, []);

  async function Way(latitude: number, longitude: number) {
    const options_: RequestInit = {
      body: JSON.stringify({
        points: [
          [longitude, latitude],
          [location.longitude, location.latitude],
        ],
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    fetch("https://graphhopper.com/api/1/route?key=" + api_key, options_).then(
      function (response) {
        response.json().then(function (result) {
          setPolyline(polyline.decode(result.paths[0].points));
          console.log(polylines);
        });
      }
    );
  }

  // Знаходження інклюзивного місця за його координатами
  const findInclusivePlaceById = (id: number) => {
    return inclusivePlaces.find((place) => place.id === id);
  };

  return (
    <div style={{ height: "100vh" }}>
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
        {polylines.length > 0 && <Polyline positions={polylines}></Polyline>}

        <Marker position={[location.latitude, location.longitude]}>
          <Popup>You</Popup>
        </Marker>

        {/* Відображення існуючих структур */}
        {structures
          .filter((value) => value.lat != null && value.lon != null)
          .map((value) => (
            <Marker
              key={`structure-${value.id}`}
              position={[value.lat, value.lon]}
            >
              <Popup>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <img
                    alt=""
                    src={value.imageUrls?.[0] || "/placeholder.png"}
                    style={{ height: "100px", width: "150px" }}
                  />
                  {value.tags && value.tags["name"] ? value.tags["name"] : ""}
                  <Button
                    onClick={async () => {
                      await Way(value.lat!, value.lon!);
                    }}
                  >
                    GO
                  </Button>
                </Box>
              </Popup>
            </Marker>
          ))}

        {/* Відображення інклюзивних місць з координатами */}
        {inclusiveCoordinates &&
          inclusiveCoordinates
            .filter((coord) => coord.lat && coord.lon)
            .map((coordinate) => {
              // Використовуємо дані з inclusivePlaces для деталей, якщо вони є
              const place = findInclusivePlaceById(coordinate.id);

              return (
                <Marker
                  key={`inclusive-${coordinate.id}`}
                  position={[coordinate.lat || 0, coordinate.lon || 0]}
                  // Використовуємо спеціальну іконку або CSS стиль для інклюзивних місць
                  //icon={inclusiveIcon}
                >
                  <Popup>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {place ? (
                        <>
                          <div style={{ fontWeight: "bold" }}>
                            Інклюзивне місце
                          </div>
                          <div>{place.address}</div>
                          {place.tags && place.tags.name && (
                            <div>{place.tags.name}</div>
                          )}
                          {place.tags && place.tags.wheelchair && (
                            <div>
                              Доступність:{" "}
                              {place.tags.wheelchair === "yes"
                                ? "Повна"
                                : "Обмежена"}
                            </div>
                          )}
                        </>
                      ) : (
                        <div>Інклюзивне місце</div>
                      )}
                      <Button
                        onClick={async () => {
                          try {
                            const route = await buildRoute(
                              coordinate.lat!,
                              coordinate.lon!,
                              location.latitude,
                              location.longitude
                            );
                            setPolyline(route); // тут setPolyline із useState в компоненті
                            console.log(route.length);
                          } catch (error) {
                            console.error("Помилка побудови маршруту:", error);
                          }
                        }}
                      >
                        GO
                      </Button>
                    </Box>
                  </Popup>
                </Marker>
              );
            })}
      </MapContainer>
    </div>
  );
};
