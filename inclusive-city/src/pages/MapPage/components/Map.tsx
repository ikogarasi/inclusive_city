import { MapContainer } from "react-leaflet/MapContainer";
import { Popup, TileLayer, useMap, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { GetStructureDto } from "../../../app/api/structureApi";

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
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>You</Popup>
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
