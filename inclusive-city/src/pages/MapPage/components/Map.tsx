import { MapContainer } from "react-leaflet/MapContainer";
import { Popup, TileLayer, useMap, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { GetStructureDto } from "../../../app/api/structureApi";
import { GraphHopperOptimization } from "graphhopper-ts-client";
import L from "leaflet";
import { Button } from "@mui/joy";
import React from "react";
// @ts-ignore
import * as polyline from "@mapbox/polyline";
import { Box, Card } from "@mui/material";

interface CurrentLocation {
  latitude: number;
  longitude: number;
  display_name: string;
}

interface props {
  location: CurrentLocation;
  structures: GetStructureDto[];
}

const Recenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
};

export const Map = ({ location, structures }: props) => {
  const [polylines, setPolyline] = React.useState<L.LatLngExpression[]>([]);
  const api_key = "7c9099e3-b0b8-405d-8ad5-ee9eb8c01bd4";
  //const startLonLat = [111.352111, 1.136299];
  //const endLonLat = [111.299744, -1.255431];

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

  return (
    <div>
      <MapContainer
        center={[49.84309611110559, 24.030603315948206]}
        zoom={17}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter lat={location.latitude} lng={location.longitude} />
        {polylines.length && <Polyline positions={polylines}></Polyline>}
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>You</Popup>
        </Marker>
        {structures.map((value) => (
          <Marker position={[value.latitude, value.longitude]}>
            <Popup>
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <img alt="" src={value.imageUrl} style={{height: '100px', width: '150px'}}/>
              {value.name}{" "}
              <Button
                onClick={async () => {
                  await Way(value.latitude, value.longitude);
                }}
              >
                GO
              </Button>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
