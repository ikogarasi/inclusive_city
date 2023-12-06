
import { Navbar } from "../NavbarAndFooter/Navbar";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Map } from './components/Map';
import { Box, Stack } from "@mui/joy";
import HeaderSection from "./components/HeaderSection";
import Filters from "./components/FilterSection";
import RampCard from "./components/RampCard";
import Search from "./components/Search";

export const MapPage = () => {

  const [ location, setLocation ] = useState({
    latitude: 49.84309611110559,
    longitude: 24.030603315948206,
    display_name: "",
  });
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      getCurrentCityName,
    );
  }, []);
  
  function getCurrentCityName(position : any) {
  
    const url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+ position.coords.latitude + '&lon=' +  
                          position.coords.longitude ;
     
    fetch(url, {
        method: "GET",
        mode: "cors",      
      }).then((response) => response.json())
        .then((data) => setLocation({ latitude: position.coords.latitude,
                                      longitude: position.coords.longitude,
                                      display_name:`${ data.address.city }, ${ data.address.country }` })    
        );
  }

    return(
      <>
      <div>
      <Navbar />
      <Box
        component="main"
        sx={{
          height: 'calc(100vh - 75px)', // 55px is the height of the NavBar
          display: 'grid',
          gridTemplateColumns: { xs: 'auto', md: '40% 20%' },
          gridTemplateRows: 'auto 1fr auto'
        }}
      >
        <Stack
          sx={{
            backgroundColor: 'background.surface',
            px: { xs: 2, md: 4 },
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <HeaderSection />
          <Search />
        </Stack>

        <Box
          sx={{
            gridRow: 'span 3',
            display: { xs: 'none', md: 'flex' },
            backgroundColor: 'background.level1',
            backgroundSize: 'cover',
            width: '100%'
          }}>
            <Map location={location}/>
          </Box>

        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
          <Filters />
          <Stack spacing={2} sx={{ overflow: 'auto' }}>
            <RampCard
              title="Ramp on st. Stepana Bandera 18"
              category="Ramp"
              theBest
              image="/src/Images/Publicimages/pandus.jpg"
            />
            <RampCard
              title="Designer NY style loft"
              category="Entire loft in central business district"
              liked
              image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400"
            />
            <RampCard
              title="5 minute walk from University of Melbourne"
              category="Entire rental unit in Carlton"
              image="https://images.unsplash.com/photo-1537726235470-8504e3beef77?auto=format&fit=crop&w=400"
            />
            <RampCard
              title="Magnificent apartment next to public transport"
              category="Entire apartment rental in Collingwood"
              image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400"
            />
            <RampCard
              title="Next to shoppng mall and public transport"
              category="Entire apartment rental in Collingwood"
              image="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=400"
            />
            <RampCard
              title="Endless ocean view"
              category="A private room in a shared apartment in Docklands"
              image="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400"
            />
            <RampCard
              title="A Stylish Apt, 5 min walk to Queen Victoria Market"
              category="one bedroom apartment in Collingwood"
              image="https://images.unsplash.com/photo-1481437156560-3205f6a55735?auto=format&fit=crop&w=400"
            />
          </Stack>
        </Stack>
      </Box>
    </div>
      </>
    
    );
}