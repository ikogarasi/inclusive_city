import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface CurrentLocation {
    latitude:number
    longitude:number,
    display_name:string
  }
  
  interface props {
    location: CurrentLocation
  }

  const Recenter = ({lat,lng}:{lat:number, lng: number}) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
}

export const Map = ({location} : props) => {

    return(
    <div>
    <MapContainer center={[49.84309611110559, 24.030603315948206]} zoom={ 17 } scrollWheelZoom={false} >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Recenter  lat={location.latitude} lng={location.longitude}/>
    </MapContainer>
    </div>
    );
}