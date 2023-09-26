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
      }}
      component="footer"
    >
        <Grid container spacing={2} columns={2}>
            <Grid item xs={1} direction={'column'}>
        <Typography variant="body2" color="text.secondary" align="left">
          {"Copyright © "}
          <Link color="inherit" href="https://your-website.com/">
            InCity
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
        </Grid>
        <Grid item>
        <Typography variant="body2" color="text.secondary">
          <Link color="inherit" href="/home" sx={{marginRight: 4}}>
            Home
          </Link>{" "}
          <Link color="inherit" href="/map">
            Map
          </Link>{" "}
        </Typography>
        </Grid>
        </Grid>
    </Box>
    );
}