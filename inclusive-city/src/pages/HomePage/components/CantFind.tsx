import { Button } from "@mui/joy";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";

export const CantFind = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    
    return(
      <>
      {isMobile ? (
        <Box display="flex"
        justifyContent="center"
        margin={'auto'}
        flexDirection="column"
        sx={{boxShadow: 15, 
        height: 350, width: '95%',
        marginBottom: 5,
        }}>
              <Box sx={{textAlign: 'start', height: 'fit-content', marginLeft: 3, marginRight: 2}}>
            <Box > 
            <h1 style={{fontWeight: 'bold', fontSize: 30}}>Can`t find what you are looking for?</h1> 
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo nobis aliquam mollitia asperiores. Velit nisi excepturi ex provident, culpa labore quaerat illo numquam itaque aspernatur reprehenderit, voluptatum et ab. Dolor. </span>   
            </Box>  
<Button size="lg" color="success" sx={{marginTop: 2}}>Sign in</Button> 
</Box> 
</Box>  
        ) : (
          <Box display="flex"
        justifyContent="center"
        margin={'auto'}
        flexDirection="column"
        sx={{boxShadow: 15, 
        height: 500, width: '95%',
        marginBottom: 5,
        }}>
                <Grid container spacing={1} gap={10} justifyContent={"center"} columns={2}>
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
                   
         component="img"
         sx={{
           height: 400,
           width: 350,
         }}
         alt="Instruction"
         src={'/src/Images/PublicImages/qa.jpg'}
       />
       </Box>   
                   </Grid>
                   </Grid>
                   </Box>
            )}
</>
    );
}