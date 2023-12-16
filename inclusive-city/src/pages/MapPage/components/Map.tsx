import { MapContainer } from "react-leaflet/MapContainer";
import { Popup, TileLayer, useMap, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { GetStructureDto } from "../../../app/api/structureApi";
import { GraphHopperOptimization } from 'graphhopper-ts-client';
import { profile } from "console";
import L from 'leaflet';
import { Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";

interface CurrentLocation {
  latitude: number;
  longitude: number;
  display_name: string;
}

interface props {
  location: CurrentLocation;
  structures: GetStructureDto[];
}

interface Profile {
  type: string;
}

const carProfile: Profile = {
  type: 'car'
};

const polylineCoordinates: L.LatLngExpression[] = [
  [51.503634, -0.103512], // Point 1
  [51.503, -0.1],         // Point 2
  [51.504, -0.1],         // Point 3
  // Add more points as needed
];
const Recenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
};

const query = new URLSearchParams({
  profile: 'car',
  point: 'string',
  point_hint: 'string',
  snap_prevention: 'string',
  curbside: 'any',
  locale: 'en',
  elevation: 'false',
  details: 'string',
  optimize: 'false',
  instructions: 'true',
  calc_points: 'true',
  debug: 'false',
  points_encoded: 'true',
  'ch.disable': 'false',
  heading: '0',
  heading_penalty: '120',
  pass_through: 'false',
  algorithm: 'round_trip',
  'round_trip.distance': '10000',
  'round_trip.seed': '0',
  'alternative_route.max_paths': '2',
  'alternative_route.max_weight_factor': '1.4',
  'alternative_route.max_share_factor': '0.6',
  key: 'YOUR_API_KEY_HERE'
}).toString();

const resp = await fetch(
  `https://graphhopper.com/api/1/route?${query}`,
  {method: 'GET'}
);

const data = await resp.text();
console.log(data);

export const Map = ({ location, structures }: props) => {
  
  const navigate = useNavigate();


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
        <Polyline positions={[]}>

        </Polyline>
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>You
            <Button onClick={() => (optimizeAndRetrieveCoordinates)}>
               Click
            </Button>
          </Popup>
        </Marker>
        {structures.map((value) => (
          <Marker position={[value.latitude, value.longitude]}>
            <Popup>{`${value.name}, ${value.distanceInKm?.toFixed(
              2
            )}km.`}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
