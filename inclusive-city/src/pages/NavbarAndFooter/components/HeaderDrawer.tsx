import { Box, Button, List, ListItem, SwipeableDrawer, Toolbar } from "@mui/material";
import React from "react";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";

export const HeaderDrawer = (props: { value: boolean }) => {

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
        <Box sx={{ overflow: "auto", marginTop: 5}}>
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
                  </Button></ListItem>
                  <ListItem ><Button
                  href="/login"
                  sx={{ color: "white", border:'white' }}
                  variant="contained"
                  color='success'
                >
                  Login
                </Button></ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
      </ThemeProvider>
    </>
  );
};
