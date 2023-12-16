import { Box, Button, List, ListItem, SwipeableDrawer, Toolbar } from "@mui/material";
import React from "react";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { cleanUser } from "../../../api/userSlice";

export const HeaderDrawer = (props: { value: boolean }) => {

  const userData = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

    const greenTheme = createTheme({
        components: {
            MuiDrawer: {
              styleOverrides: {
                paper: {
                  background: "#aaba5d"
                }
              }
            }
          }
      });

  const theme = useTheme();
  const { value: isOpen } = props;
  const [state, setState] = React.useState({
    top: false
  });

  const toggleDrawer =
  ( open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, 'top': open });
    };

  return (
    <>
    <ThemeProvider theme={greenTheme}>
      <SwipeableDrawer
        anchor={"top"}
        open={isOpen}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
        sx={{
          flexShrink: 0,
        }}
      >
        <Toolbar/>
        <Box sx={{ overflow: "auto"}}>
          <List>
              <ListItem><Button
                    href="/"
                    sx={{ color: "#fff", fontSize: 18, textTransform: "none" }}>
                    Home
                  </Button></ListItem>
                  <ListItem><Button
                    href="/map"
                    sx={{
                      color: "#fff",
                      fontSize: 18,
                      textTransform: "none",
                    }}
                  >
                    Map
                  </Button>
                  </ListItem>
                  <ListItem>
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
                   {userData.userData.role === "User" && (
                    <Button
                      onClick={() => navigate("/message")}
                      sx={{
                        color: "#fff",
                        fontSize: 18,
                        textTransform: "none",
                      }}
                    >
                      Q/A
                    </Button>
                  )}
                  </ListItem>
                  <ListItem >
                  {!userData.isAuthenticated ? (
                    <Button
                      onClick={() => navigate("/login")}
                      variant="contained"
                      color="success"
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
                      color="success"
                      variant="contained"
                      sx={{ color: "#fff" }}
                    >
                      Log out
                    </Button>
                  )}</ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
      </ThemeProvider>
    </>
  );
};
