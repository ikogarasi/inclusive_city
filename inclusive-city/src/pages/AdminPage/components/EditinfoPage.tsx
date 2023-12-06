import { Typography } from "@mui/joy";
import { Box, Button, Grid } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export const EditInfoPage = () => {

    return(
        <div>
            <Box border={2}  width={'94%'} marginBottom={10} borderRadius={'16px'} sx={{border: 2, borderColor: 'lightgray', margin: 3}}>
            <Box sx={{margin: 1}}>
                <Grid container spacing={1} direction="row">
                    <Grid container item spacing={3}>
                        <Grid item xs={5}>
                        <img
          src="/src/Images/Publicimages/pandus.jpg"
          alt="Photo of ramp"
          width={'100%'}
          height={'100%'}
          style={{ borderRadius: '10px'}}
        />
                        </Grid>
                        <Grid item xs={5} marginTop={2}>
                        <Typography
        level="h1"
        fontWeight="xl"
        fontSize={{xs: '20px', md: '40px'}}
        marginBottom={1}
      >
        Ramp on st. Stepana Bandera 18
      </Typography>
      <Typography fontSize={{xs: '10px', md: '15px'}} textColor="text.secondary" lineHeight="lg" marginBottom={2}>
        Category: Ramp
      </Typography>
      <Typography fontSize={{xs: '10px', md: '23px'}} textColor="text.secondary" lineHeight="lg" marginBottom={3}>
        A descriptive secondary text placeholder. Use it to explain your business
        offer better.
      </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{display: 'flex', flexDirection:'column', justifyContent: 'center'}}>
                         <Button color="warning" size="large" sx={{width: '50%', height: '25%', marginBottom: 3}}>
                         <CreateIcon sx={{fontSize: {xs: '30px', md: '50px'}}}/>
                         </Button>
                         <Button color="error" sx={{ width: '50%', height: '25%'}}>
                            <DeleteOutlineIcon sx={{fontSize: {xs: '30px', md: '50px'}}}/>
                         </Button>
                        </Grid>
                    </Grid> 
                </Grid>
                </Box>    
            </Box>
            <Box border={2}  width={'94%'} marginBottom={10} borderRadius={'16px'} sx={{border: 2, borderColor: 'lightgray', margin: 3}}>
            <Box sx={{margin: 1}}>
                <Grid container spacing={1} direction="row">
                    <Grid container item spacing={3}>
                        <Grid item xs={5}>
                        <img
          src="/src/Images/Publicimages/pandus.jpg"
          alt="Photo of ramp"
          width={'100%'}
          height={'100%'}
          style={{ borderRadius: '10px'}}
        />
                        </Grid>
                        <Grid item xs={5} marginTop={2}>
                        <Typography
        level="h1"
        fontWeight="xl"
        fontSize={{xs: '20px', md: '40px'}}
        marginBottom={1}
      >
        Ramp on st. Stepana Bandera 18
      </Typography>
      <Typography fontSize={{xs: '10px', md: '15px'}} textColor="text.secondary" lineHeight="lg" marginBottom={2}>
        Category: Ramp
      </Typography>
      <Typography fontSize={{xs: '10px', md: '23px'}} textColor="text.secondary" lineHeight="lg" marginBottom={3}>
        A descriptive secondary text placeholder. Use it to explain your business
        offer better.
      </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{display: 'flex', flexDirection:'column', justifyContent: 'center'}}>
                         <Button color="warning" size="large" sx={{width: '50%', height: '25%', marginBottom: 3}}>
                         <CreateIcon sx={{fontSize: {xs: '30px', md: '50px'}}}/>
                         </Button>
                         <Button color="error" sx={{ width: '50%', height: '25%'}}>
                            <DeleteOutlineIcon sx={{fontSize: {xs: '30px', md: '50px'}}}/>
                         </Button>
                        </Grid>
                    
        
                    </Grid>
                    
                </Grid>
            
                </Box>    
            
            </Box>
        </div>
    );
}