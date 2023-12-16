import { Navbar } from "../NavbarAndFooter/Navbar";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Map } from "./components/Map";
import { Box, Stack } from "@mui/joy";
import HeaderSection from "./components/HeaderSection";
import Filters from "./components/FilterSection";
import RampCard from "./components/RampCard";
import Search from "./components/Search";
import { useGetAllStructuresQuery } from "../../api/structureRtkApi";

export const MapPage = () => {
  const [category, setCategory] = useState<string>("All");
  const [count, setCount] = useState<number>(0);

  const [location, setLocation] = useState({
    latitude: 49.84309611110559,
    longitude: 24.030603315948206,
    display_name: "",
  });

  const { data = [] } = useGetAllStructuresQuery({
    latitude: location.latitude,
    longitude: location.longitude,
    count: count,
    category: category !== "All" ? category : null,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(getCurrentCityName);
  }, []);

  function getCurrentCityName(position: any) {
    const url =
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
      position.coords.latitude +
      "&lon=" +
      position.coords.longitude;

    fetch(url, {
      method: "GET",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) =>
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          display_name: `${data.address.city}, ${data.address.country}`,
        })
      );
  }

  return (
    <>
      <div>
        <Navbar />
        <Box
          component="main"
          sx={{
            height: "calc(100vh - 75px)", // 55px is the height of the NavBar
            display: "grid",
            gridTemplateColumns: { xs: "auto", md: "40% 20%" },
            gridTemplateRows: "auto 1fr auto",
          }}
        >
          <Stack
            sx={{
              backgroundColor: "background.surface",
              px: { xs: 2, md: 4 },
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <HeaderSection />
            <Search len={data.length} />
          </Stack>

          <Box
            sx={{
              gridRow: "span 3",
              display: { xs: "none", md: "flex" },
              backgroundColor: "background.level1",
              backgroundSize: "cover",
              width: "100%",
            }}
          >
            <Map location={location} structures={data} />
          </Box>

          <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
            <Filters category={category} setCategory={setCategory} />
            <Stack spacing={2} sx={{ overflow: "auto" }}>
              {data.map((value) => (
                <RampCard key={value.id} structure={value} />
              ))}
            </Stack>
          </Stack>
        </Box>
      </div>
    </>
  );
};
