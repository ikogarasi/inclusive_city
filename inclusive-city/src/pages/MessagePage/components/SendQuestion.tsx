import { Avatar, Typography } from "@mui/joy";
import { Box, Button, TextField } from "@mui/material";
import React from "react";

export const SendQuestion = () => {
  const [description, setDescription] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(false);
    return(
        <div>
             <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 3,
            marginTop: 3,
            
        }}>
        <Typography level="h2">
          Do you have any questions or suggestions?
          </Typography> 
        <Box sx={{marginLeft: 2, marginBottom: 4}}> 
        <Typography textColor='common.black' sx={{marginTop: 2, marginRight: 5, fontSize: '20px'}}>
        You can write your question or suggestion here. The admin will review your message and try to respond as soon as possible.
      </Typography>
      <TextField
  id="demo-helper-text-aligned-no-helper"
  label="Write your question here..."
  multiline
  rows={5}
  value={description}
  onChange={(event) => {
    setDescription(event.target.value)
  }}
  color={errorMessage ? 'error' : 'primary'}
  sx={{width:{sm: '82%', xs: '89%'}, marginBottom: {xs: 5}, marginTop: 2, color: `${errorMessage ? 'error' : 'primary'}`}}
/>
<Button variant='contained' color='success' sx={{ display: 'flex', justifyContent:'flex-start'}}
      >
        Send question
      </Button>
      </Box>
      </Box>
        </div>
    );
}