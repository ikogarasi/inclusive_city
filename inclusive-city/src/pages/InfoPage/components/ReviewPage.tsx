import { Star } from "@mui/icons-material";
import { Avatar, Button, Typography } from "@mui/joy";
import { Box } from "@mui/material";
import React from "react";
import TwoSidedLayout from "./TwoSlideLayout";
import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { StarRating } from "./StarRating";

export const ReviewPage = () => {
    return (
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
       <StarRating/>
      <Typography textColor="text.secondary">
        The resource and tips in Frames X are worth a fortune. My team loves the
        design kits.
      </Typography>
      <Typography
        startDecorator={<Avatar component="span" size="lg" variant="outlined" />}
        sx={{ '--Typography-gap': '12px' }}
      >
        <b>John Seed</b>, Apple Inc.
      </Typography>  
        </Box>
        </TwoSidedLayout>
    );
}