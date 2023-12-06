import { Avatar, Button, Typography } from "@mui/joy";
import { Box, Divider} from "@mui/material";
import TwoSidedLayout from "./TwoSlideLayout";
import { StarRating } from "./StarRating";

export const ReviewPage = () => {
    return (
      <Box sx={{paddingBottom: 5}}>
        <TwoSidedLayout>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%'
        }}>
        <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
        marginBottom={1}
      >
        Ramp on st. Stepana Bandera 18
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg" marginBottom={3}>
        A descriptive secondary text placeholder. Use it to explain your business
        offer better.
      </Typography>
      <Button size="lg" href="/map" color="success">Return to explore more</Button>
       <StarRating readonly={false} sizeText="30px" />
        </Box>
        </TwoSidedLayout>
        <Divider variant="middle"></Divider>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 2,
            marginTop: 3
        }}>
        <Typography level="h2">
          The latest comments:
          </Typography> 
        <Box sx={{marginLeft: 5, marginTop: 3}}>  
        <Typography
        startDecorator={<Avatar component="span" size="lg" variant="outlined" />}
        sx={{ '--Typography-gap': '12px' }}
      >
        <b>John Seed</b>, jonh.seed@gmail.com
      </Typography>
      <Typography sx={{marginTop: 2}}>
      <i>16 June 2023</i>
      </Typography>
      <StarRating readonly={true} sizeText="30px"/>
        <Typography textColor="text.secondary" sx={{marginTop: 2}}>
        The resource and tips in Frames X are worth a fortune. My team loves the
        design kits.
      </Typography>
      
      </Box> 
      </Box>
        </Box>
    );
}