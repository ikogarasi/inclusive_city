import { Button, Typography } from "@mui/joy";
import { Box, Grid, Grow, useMediaQuery, useTheme} from "@mui/material";
import { useEffect, useState } from "react";

export const HowItWorks = () => {
    const [step, setStep] = useState<number>(0);
    const [active, setActive] = useState(true);

    const listOfImages = ['/src/Images/Img4.png',
        '/src/Images/Img2.png',
        '/src/Images/Img3.png'];   

        var time = true;


    const handleStepBtnClick = (stepNumber: number, bool: boolean) => {
        setStep(stepNumber);
        time = bool;
        setActive(true);
        setTimeout(() => {
         setActive(false);
     }, 10000);
           
    }    

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prevStep => prevStep < 2 ? prevStep + 1 : 0);
            setActive(true);
           setTimeout(() => {
            setActive(false);
        }, 8900);
        }, 10000);
        return () => clearInterval(interval);
    }, [time]);

    const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return(
        <Box sx={{ width: '100%' }}>
            
            <Typography
            level="body-lg"
            fontWeight="lg"
            fontSize={32}
            sx={{ textDecoration: 'outline', mt: 2, mb:4, fontWeight: 'bold'}}
            textAlign={'center'}
            mt={{ xs: 12, sm: -2}}
            >
                How it works?
            </Typography>
            {isMobile ? (  <Grid
            container spacing={0} 
            textAlign={'center'}
            justifyContent={'start'}
            >
            <Grid item direction={'column'} >
                <Grid item display={step === 0 ? 'block' : 'none'}>
                <Button onClick={() => handleStepBtnClick(0, false)}
                variant={'plain'} color="success" sx={{mb: 5}}>
                    <Box sx={{display: "flex", flexDirection: 'column', textAlign: 'start',height: 'fit-content', width: 300}}>
                    <span style={{fontWeight: 'bold', fontSize: 40, marginBottom: 10}}>1. Put your categories</span>
                <span style={{fontSize: 20, color: 'black'}}>What place you want to visit? Choose any category, that you needed
                </span>
                </Box>
                </Button>
                </Grid>
                <Grid item display={step === 1 ? 'block' : 'none'}>
                <Button onClick={() => handleStepBtnClick(1, false)}
                variant={'plain'} color='success' sx={{mb: 5}}>
                <Box sx={{display: "flex", flexDirection: 'column', gap: '0', textAlign: 'start', height: 'fit-content', maxWidth: 450}}>
                <span style={{fontWeight: 'bold', fontSize: 40, marginBottom: 10}}>2. Let us search for you</span>
                <span style={{fontSize: 20}}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi dolorum odio incidunt sequi modi! 
                </span>
                </Box>
                </Button>
                </Grid>
                <Grid item display={step === 2 ? 'block' : 'none'}>
                <Button onClick={() => handleStepBtnClick(2, false)}
                variant={'plain'} color='success' sx={{ mb: 5}}>
                    <Box sx={{display: "flex", flexDirection: 'column', gap: '0', textAlign: 'start', height: 'fit-content', maxWidth: 450}}>
                    <span style={{fontWeight: 'bold', fontSize: 40, marginBottom: 10}}>3. Choose the best option</span>
                    <span style={{fontSize: 20}}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi dolorum odio incidunt sequi modi!</span>
                    </Box></Button>
                    </Grid>
                </Grid>
                <Grid item>    
                <Box display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}>
                <Grow in={active} timeout={1000}>   
                {<Box
  component="img"
  marginLeft={8}
  marginBottom={3}
  sx={{
    height: 438,
    width: 245,
    maxHeight: { xs: 950, md: 650 },
    maxWidth: { xs: 950, md: 650 }
  }}
  alt="Instruction"
  src={listOfImages[step]}
/>}
</Grow> 
</Box>   
                </Grid>
            </Grid>): (  <Grid
            container spacing={1} columns={2}
            textAlign={'center'}
            justifyContent={'center'}
            >
            <Grid item xs={1} direction={'column'}>
                <Button onClick={() => handleStepBtnClick(0, false)}
                variant={step === 0 ? 'soft' : 'plain'} color="success" sx={{mb: 5, paddingBottom: 5}}>
                    <Box sx={{display: "flex", flexDirection: 'column', gap: '0', textAlign: 'start',height: 'fit-content', maxWidth: 450}}>
                    <span style={{fontWeight: 'bold', fontSize: 40, marginBottom: 10}}>1. Put your categories</span>
                <span style={{fontSize: 20, color: 'black'}}>What place you want to visit? Choose any category, that you needed
                </span>
                </Box>
                </Button>
                <Grid item>
                <Button onClick={() => handleStepBtnClick(1, false)}
                variant={step === 1 ? 'soft' : 'plain'} color='success' sx={{mb: 5, paddingBottom: 5}}>
                <Box sx={{display: "flex", flexDirection: 'column', gap: '0', textAlign: 'start', height: 'fit-content', maxWidth: 450}}>
                <span style={{fontWeight: 'bold', fontSize: 40, marginBottom: 10}}>2. Let us search for you</span>
                <span style={{fontSize: 20}}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi dolorum odio incidunt sequi modi! 
                </span>
                </Box>
                </Button>
                </Grid>
                <Button onClick={() => handleStepBtnClick(2, false)}
                variant={step === 2 ? 'soft' : 'plain'} color='success' sx={{ mb: 5, paddingBottom: 5}}>
                    <Box sx={{display: "flex", flexDirection: 'column', gap: '0', textAlign: 'start', height: 'fit-content', maxWidth: 450}}>
                    <span style={{fontWeight: 'bold', fontSize: 40, marginBottom: 10}}>3. Choose the best option</span>
                    <span style={{fontSize: 20}}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi dolorum odio incidunt sequi modi!</span>
                    </Box></Button>
                </Grid>
                <Grid item>    
                <Box display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}>
                <Grow in={active} timeout={1000}>   
                {<Box
                marginTop={2}
  component="img"
  sx={{
    height: 538,
    width: 345,
    maxHeight: { xs: 950, md: 650 },
    maxWidth: { xs: 950, md: 650 }
  }}
  alt="Instruction"
  src={listOfImages[step]}
/>}
</Grow> 
</Box>   
                </Grid>
            </Grid>)}
          
        </Box>
    );
};