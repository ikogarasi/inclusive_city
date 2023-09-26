import { Button } from "@mui/joy";
import { Box, Grid } from "@mui/material";

export const CantFind = () => {
    return(
        <Box display="flex"
        justifyContent="center"
        margin={'auto'}
        flexDirection="column"
        sx={{boxShadow: 15, 
        height: 500, width: 1300,
        marginBottom: 5}}>
         <Grid container spacing={1} columns={2}
         marginLeft={10}>
            <Grid item xs={1} direction={'column'}>
            <Box sx={{display: "flex", flexDirection: 'column', gap: '0', textAlign: 'start', height: 'fit-content'}}> 
            <h1 style={{fontWeight: 'bold', fontSize: 50}}>Can`t find what you are looking for?</h1>    
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo nobis aliquam mollitia asperiores. Velit nisi excepturi ex provident, culpa labore quaerat illo numquam itaque aspernatur reprehenderit, voluptatum et ab. Dolor. </span>
            </Box>  
            <Button size="lg" color="success" sx={{marginTop: 5}}>Sign in</Button> 
            </Grid>
            <Grid item>
            <Box display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}>
            <Box
            marginLeft={20}
  component="img"
  sx={{
    height: 400,
    width: 350,
    maxHeight: { xs: 500, md: 500 },
    maxWidth: { xs: 400, md: 400 }
  }}
  alt="Instruction"
  src={'/src/Images/PublicImages/qa.jpg'}
/>
</Box>   
            </Grid>
            </Grid>
        </Box>

    );
}