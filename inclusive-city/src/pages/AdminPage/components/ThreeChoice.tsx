import { Button } from "@mui/joy";
import { Box, BottomNavigation, BottomNavigationAction, Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import React from "react";
import CreateIcon from '@mui/icons-material/Create';
import EmailIcon from '@mui/icons-material/Email';
import AddIcon from '@mui/icons-material/Add';

import Image from '../../../Images/emoj.jpg'; // Import using relative path
import { AddInfoPage } from "./AddInfoPage";
import { EditInfoPage } from "./EditinfoPage";
import { MessageInfoPage } from "./MessageInfoPage";

export const ThreeChoice = () => {
    const [value, setValue] = React.useState(0);
return(
    <div className='container'style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
            <Box sx={{ width: {xs: '86%', sm: '500px'} }}
            marginTop={10}
            >
      <BottomNavigation
        showLabels
        value={value}
        sx={{position:'relative', zIndex: 'drawer', top: 2}}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction sx={{border: 2, borderColor: `${value===0 ? '' : 'darkgray'}`, borderBottom: `${value===0 ? '1' : ''}`, borderBottomColor: `${value===0 ? 'white' : ''}`, borderRadius: '16px 16px 0px 0px'}} label="Add new place" icon={<AddIcon/>} />
        <BottomNavigationAction sx={{border: 2, borderColor: `${value===1 ? '' : 'darkgray'}`, borderBottom: `${value===0 ? '1' : ''}`, borderBottomColor: `${value===1 ? 'white' : ''}`, borderRadius: '16px 16px 0px 0px'}} label="Edit" icon={<CreateIcon/>}/>
        <BottomNavigationAction sx={{border: 2, borderColor: `${value===2 ? '' : 'darkgray'}`, borderBottom: `${value===0 ? '1' : ''}`, borderBottomColor: `${value===2 ? 'white' : ''}`, borderRadius: '16px 16px 0px 0px'}} label="Questions" icon={<EmailIcon/>} />
      </BottomNavigation>
      
    </Box>
    <Box border={2} width={'85%'} marginBottom={10} position={'relative'}
            zIndex={'fab'} borderRadius={{xs: '0px 0px 16px 16px', sm: '16px'}} sx={{border: 2, borderColor: 'darkgray'}}>
                <Box display={value===0 ? 'block' : 'none'}>
                <AddInfoPage />
                </Box>
                <Box display={value===1 ? 'block' : 'none'}>
                    <EditInfoPage/>
                </Box>
                <Box display={value===2 ? 'block' : 'none'}>
                    <MessageInfoPage/>
                </Box>     
            </Box>
            
        </div>
);

}