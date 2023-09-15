import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Box, Stack} from "@mui/joy";
import { AppBar, Toolbar, createTheme, Button } from "@mui/material";
import React from "react";
import { ThemeProvider} from '@mui/material/styles';

export const Navbar = () => {
  
  const greenTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#aaba5d',
      },
    },
  });
  
    return(
        <Box sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={greenTheme}>    
        <AppBar position="static">
          <Toolbar>
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
      <Stack direction='row' spacing={1} sx = {{ flexGrow: 1}}>
      <Button href="/home" sx={{ color: '#fff', fontSize: 18, textTransform: 'none' }}>
                Home
              </Button>
              <Button href="/home" sx={{ color: '#fff', fontSize: 18, mr: 50, textTransform: 'none' }}>
                Map
              </Button>
      </Stack>
            
      <Button variant="contained" sx={{color: '#fff'}}>Login</Button>
          </Toolbar>
        </AppBar>
        </ThemeProvider>
      </Box>
    );
};