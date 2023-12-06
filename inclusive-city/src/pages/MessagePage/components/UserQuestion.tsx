import { Avatar, Typography } from "@mui/joy";
import { Box } from "@mui/material";

export const UserQuestion = () => {

    return(
        <div>
            <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 3,
            marginTop: 3
        }}>
        <Typography level="h2">
          The latest your questions:
          </Typography> 
        <Box sx={{marginLeft: 2, marginTop: 3, marginBottom: 4}}>  
        <Typography
        startDecorator={<Avatar component="span" size="lg" variant="outlined" />}
        sx={{ '--Typography-gap': '12px' }}
      >
        <b>John Seed</b>, jonh.seed@gmail.com
      </Typography>
      <Typography sx={{marginTop: 2}}>
      <i>16 June 2023</i>, <b style={{color: 'red'}}>Waiting for answer</b>
      </Typography>
        <Typography textColor="text.secondary" sx={{marginTop: 2, marginRight: 5}}>
        The resource and tips in Frames X are worth a fortune. My team loves the
        design kits.
      </Typography>
      <Typography sx={{marginLeft: 3, marginTop: 2}} level="h4">
          Response:
          </Typography> 
      <Box sx={{marginLeft: 5, marginTop: 3, marginBottom: 4, backgroundColor: 'lightgrey', border: 1, borderBlockColor: 'lightgrey', borderRadius: 2, width: '70%', paddingLeft: 3}}>  
        <Typography
        startDecorator={<Avatar component="span" size="lg" variant="outlined" />}
        sx={{ '--Typography-gap': '12px' }}
      >
        <b>John Seed</b>, jonh.seed@gmail.com
      </Typography>
      <Typography sx={{marginTop: 2}}>
      <i>16 June 2023</i>
      </Typography>
        <Typography textColor="text.secondary" sx={{marginTop: 2, marginRight: 5}}>
        The resource and tips in Frames X are worth a fortune. My team loves the
        design kits.
      </Typography>
      </Box>
      </Box>
      </Box>
        </div>
    );
}