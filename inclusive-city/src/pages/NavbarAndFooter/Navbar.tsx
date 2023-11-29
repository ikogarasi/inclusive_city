import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/joy";
import {
  AppBar,
  Toolbar,
  createTheme,
  Button,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { HeaderDrawer } from "./components/HeaderDrawer";

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

  return (
    <Box>
      <ThemeProvider theme={greenTheme}>
        <AppBar
          position="absolute"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: { xs: "space-between" },
              flexDirection: "row",
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Typography color="common.white" sx={{ my: 2, fontSize: 22 }}>
                InCity
              </Typography>
            </IconButton>
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
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Button
                  href="/"
                  sx={{
                    color: "#fff",
                    fontSize: 18,
                    textTransform: "none",
                  }}
                >
                  Home
                </Button>
                <Button
                  href="/map"
                  sx={{
                    color: "#fff",
                    fontSize: 18,
                    textTransform: "none",
                  }}
                >
                  Map
                </Button>
                <Button
                  href="/login"
                  variant="contained"
                  sx={{ color: "#fff" }}
                >
                  Login
                </Button>
              </Grid>
            )}
          </Toolbar>
        </AppBar>
        {isMenuOpened && <HeaderDrawer value={isMenuOpened} />}
      </ThemeProvider>
    </Box>
  );
};
