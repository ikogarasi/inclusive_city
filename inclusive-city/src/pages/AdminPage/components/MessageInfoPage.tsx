import { Typography, Avatar, Button } from "@mui/joy";
import { Box, TextField } from "@mui/material";
import React from "react";

export const MessageInfoPage = () => {

    const [visible, setVisible] = React.useState(false);

    const visibleDescription = (click: any) => {
        if(click) {
          return (
              <div>
                <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '70%'
          }}>
          <TextField
                id="outlined-multiline-static"
                label="Answer..."
                multiline
                rows={4}
                placeholder="Enter your answer here"
                sx={{marginTop: 2}}
              />
              </Box>
              
              </div>
          );
        }
      }

    return(
        <div>
            <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 3,
            marginTop: 3
        }}>
        <Typography level="h2">
          The latest questions:
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
      {visibleDescription(visible)}
      <Button sx={{marginTop: 3}}
      onClick={() => {
        setVisible(true);
      }}
      >
        ANSWER
      </Button>
      </Box>
      <Box sx={{marginLeft: 2, marginTop: 3, marginBottom: 4}}>  
        <Typography
        startDecorator={<Avatar component="span" size="lg" variant="outlined" />}
        sx={{ '--Typography-gap': '12px' }}
      >
        <b>John Seed</b>, jonh.seed@gmail.com
      </Typography>
      <Typography sx={{marginTop: 2}}>
      <i>12 June 2022</i>, <b style={{color: 'green'}}>Answered</b>
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