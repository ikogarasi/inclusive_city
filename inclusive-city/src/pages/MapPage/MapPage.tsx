import { Navbar } from "../NavbarAndFooter/Navbar";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Map } from "./components/Map";
import { styled } from "@mui/material/styles";
import { Global } from "@emotion/react";
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CssBaseline from "@mui/material/CssBaseline";
import { Stack } from "@mui/joy";
import HeaderSection from "./components/HeaderSection";
import Filters from "./components/FilterSection";
import StructureCard from "./components/StructureCard";
import Search from "./components/Search";
import { useGetStructuresQuery } from "../../api/externalServicesRktApi";
import { skipToken } from "@reduxjs/toolkit/query";

// Інтерфейс для координат інклюзивних місць
interface InclusiveCoordinate {
  id: number;
  lat?: number;
  lon?: number;
}

// Ширина бічної панелі
const drawerWidth = 350;

// Стилізована "ручка" для перетягування
const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export const MapPage = () => {
  const [category, setCategory] = useState<string>("All");
  const [around, setAround] = useState<number>(2);
  const [searchInput, setSearchInput] = useState<string>(""); // local input state
  const [isWheelChair, setIsWheelChair] = useState<boolean>(false); // wheelchair filter

  const [searchParams, setSearchParams] = useState<{
    category: string;
    around: number;
    search: string;
    isWheelChair: boolean;
  } | null>(null);

  // Стан для зберігання інклюзивних місць
  const [inclusivePlaces, setInclusivePlaces] = useState<any[]>([]);
  // Стан для зберігання координат інклюзивних місць
  const [inclusiveCoordinates, setInclusiveCoordinates] = useState<
    InclusiveCoordinate[]
  >([]);
  // Стан для контролю відкриття/закриття бічної панелі
  const [open, setOpen] = useState(true);

  const [location, setLocation] = useState({
    latitude: 49.84309611110559,
    longitude: 24.030603315948206,
    display_name: "",
  });

  const { data = { elements: [] } } = useGetStructuresQuery(
    searchParams
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          around: searchParams.around * 1000,
          amenity: searchParams.category !== "All" ? searchParams.category : "",
          name: searchParams.search,
          isWheelChair: searchParams.isWheelChair,
          shouldRetrieveRating: true,
          shouldGetImages: true,
        }
      : skipToken, // <-- import { skipToken } from "@reduxjs/toolkit/query"
    {
      skip: !searchParams,
    }
  );

  const handleSearch = () => {
    setSearchParams({
      category,
      around,
      search: searchInput,
      isWheelChair,
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(getCurrentCityName);

    // Витягаємо дані про інклюзивні місця з sessionStorage
    const storedInclusivePlaces = sessionStorage.getItem("inclusivePlaces");
    if (storedInclusivePlaces) {
      try {
        const parsedPlaces = JSON.parse(storedInclusivePlaces);
        setInclusivePlaces(parsedPlaces);
      } catch (error) {
        console.error(
          "Error parsing inclusivePlaces from sessionStorage:",
          error
        );
      }
    }

    // Витягаємо координати інклюзивних місць з sessionStorage
    const storedCoordinates = sessionStorage.getItem("inclusiveCoordinates");
    if (storedCoordinates) {
      try {
        const parsedCoordinates = JSON.parse(storedCoordinates);
        setInclusiveCoordinates(parsedCoordinates);
        console.log(
          "Loaded inclusive coordinates from sessionStorage:",
          parsedCoordinates.length
        );
      } catch (error) {
        console.error(
          "Error parsing inclusiveCoordinates from sessionStorage:",
          error
        );
      }
    }
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

  // Функція для очищення даних інклюзивних місць з sessionStorage
  const clearInclusivePlaces = () => {
    sessionStorage.removeItem("inclusivePlaces");
    sessionStorage.removeItem("inclusiveCoordinates");
    setInclusivePlaces([]);
    setInclusiveCoordinates([]);
  };

  // Функції для відкриття/закриття панелі
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Navbar />

        {/* Головний контейнер для карти */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            position: "relative",
            height: "calc(100vh - 75px)",
          }}
        >
          {/* Карта займає весь простір */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "background.level1",
              backgroundSize: "cover",
            }}
          >
            <Map
              location={location}
              structures={data.elements || []}
              inclusivePlaces={inclusivePlaces}
              inclusiveCoordinates={inclusiveCoordinates}
            />
          </Box>

          {/* Кнопка для відкриття панелі - на великих екранах (десктоп) */}
          {!open && (
            <IconButton
              onClick={toggleDrawer(true)}
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                backgroundColor: "background.paper",
                borderRadius: "0 4px 4px 0",
                boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                display: { xs: "none", md: "flex" },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}

          {/* Налаштовуємо Global стилі для SwipeableDrawer */}
          <Global
            styles={{
              // Десктоп стилі - панель зліва
              "@media (min-width: 600px)": {
                ".MuiDrawer-root > .MuiPaper-root": {
                  width: drawerWidth,
                  height: "calc(100vh - 75px)",
                  position: "absolute",
                  overflow: "visible",
                },
              },
              // Мобільні стилі - панель знизу
              "@media (max-width: 599px)": {
                ".MuiDrawer-root > .MuiPaper-root": {
                  height: `calc(50% - 30px)`,
                  overflow: "visible",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                },
              },
            }}
          />

          {/* SwipeableDrawer - відображається по-різному на десктопі та мобільних */}
          <SwipeableDrawer
            anchor={window.innerWidth > 600 ? "left" : "bottom"}
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            swipeAreaWidth={30}
            disableSwipeToOpen={false}
            variant="persistent"
          >
            {/* Верхня панель з пулером для мобільних */}
            {window.innerWidth <= 600 && (
              <Box
                sx={{
                  position: "absolute",
                  top: -30,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  visibility: "visible",
                  right: 0,
                  left: 0,
                  height: 30,
                  backgroundColor: "background.paper",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Puller />
                <Typography sx={{ position: "absolute", textAlign: "center" }}>
                  {data.elements?.length} результатів
                </Typography>
              </Box>
            )}

            {/* Кнопка закриття для десктопа */}
            {window.innerWidth > 600 && (
              <IconButton
                onClick={toggleDrawer(false)}
                sx={{
                  position: "absolute",
                  right: -15,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "background.paper",
                  borderRadius: "0 4px 4px 0",
                  zIndex: 1,
                  boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}

            {/* Вміст панелі */}
            <Box sx={{ height: "100%", overflow: "auto" }}>
              {/* Заголовок та пошук */}
              <Stack
                sx={{
                  backgroundColor: "background.surface",
                  px: { xs: 2, md: 2 },
                  py: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <HeaderSection />
                <Search
                  len={data.elements?.length || 0}
                  onChange={setSearchInput}
                  onSearch={handleSearch}
                  value={searchInput}
                />
              </Stack>
              {/* Фільтри та список карток */}
              <Stack
                spacing={2}
                sx={{ px: { xs: 2, md: 2 }, pt: 2, minHeight: 0 }}
              >
                <Filters
                  category={category}
                  setCategory={setCategory}
                  around={around}
                  setAround={setAround}
                  isWheelChair={isWheelChair}
                  setIsWheelChair={setIsWheelChair}
                />
                <Stack spacing={2} sx={{ overflow: "auto", pb: 2 }}>
                  {(data.elements || []).map((value) => (
                    <StructureCard key={value.id} structure={value} />
                  ))}

                  {/* Індикатор наявності інклюзивних місць */}
                  {inclusiveCoordinates.length > 0 && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "background.level2",
                        borderRadius: "sm",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        Знайдено інклюзивних місць:{" "}
                        {inclusiveCoordinates.length}
                      </div>
                      <button onClick={clearInclusivePlaces}>Очистити</button>
                    </Box>
                  )}
                </Stack>
              </Stack>
            </Box>
          </SwipeableDrawer>
        </Box>
      </div>
    </>
  );
};
