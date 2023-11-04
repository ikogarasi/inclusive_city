import { BottomNavigation, Box, Container, Grid, Link, ThemeProvider, Typography, createTheme } from "@mui/material";

export const Footer = () => {
    
    const greenTheme = createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#aaba5d',
          },
        },
      });

    return (
        <Box
      sx={{
        backgroundColor: '#b0bc5c',
        p: 7,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection:'row'
      }}
      component="footer"
    >

        <Typography variant="body2" color="text.secondary" align="left">
          {"Copyright © "}
          <Link color="inherit" href="https://your-website.com/">
            InCity
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{alignSelf:'flex-end'}}>
          <Link color="inherit" href="/" sx={{marginRight: 2}}>
            Home
          </Link>{" "}
          <Link color="inherit" href="/map">
            Map
          </Link>{" "}
        </Typography>
        
    </Box>
    );
}