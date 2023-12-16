import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/joy";
import {
  AppBar,
  Toolbar,
  createTheme,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { HeaderDrawer } from "./components/HeaderDrawer";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { cleanUser } from "../../api/userSlice";

export const Navbar = () => {
  const greenTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#aaba5d",
      },
    },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const navigate = useNavigate();
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ display: "flex", paddingBottom: 7 }}>
      <ThemeProvider theme={greenTheme}>
        <AppBar
          position="absolute"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              color="common.white"
              sx={{ my: 2, fontSize: 22, flexGrow: 1, paddingRight: 2 }}
            >
              InCity
            </Typography>
            {isMobile ? (
              <Box>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="menu"
                  sx={{ mr: 2, alignItems: "flex-end", color: "white" }}
                  onClick={() => setIsMenuOpened(!isMenuOpened)}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box>
                  <Button
                    onClick={() => navigate("/")}
                    sx={{
                      color: "#fff",
                      fontSize: 18,
                      textTransform: "none",
                    }}
                  >
                    Home
                  </Button>
                  <Button
                    onClick={() => navigate("/map")}
                    sx={{
                      color: "#fff",
                      fontSize: 18,
                      textTransform: "none",
                    }}
                  >
                    Map
                  </Button>
                  {userData.userData.role === "Admin" && (
                    <Button
                      onClick={() => navigate("/admin")}
                      sx={{
                        color: "#fff",
                        fontSize: 18,
                        textTransform: "none",
                      }}
                    >
                      Admin
                    </Button>
                  )}
                </Box>
                <Box>
                  {!userData.isAuthenticated ? (
                    <Button
                      onClick={() => navigate("/login")}
                      variant="contained"
                      sx={{ color: "#fff" }}
                    >
                      Login
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        dispatch(cleanUser());
                        navigate("/login");
                      }}
                      variant="contained"
                      sx={{ color: "#fff" }}
                    >
                      Log out
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        {isMenuOpened && <HeaderDrawer value={isMenuOpened} />}
      </ThemeProvider>
    </Box>
  );
};
