import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import React from "react";
import { SendQuestion } from "./SendQuestion";
import { UserQuestion } from "./UserQuestion";

export const TwoChoice = () => {
    const [value, setValue] = React.useState(0);
    return(
        <div className='container'style={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'start', margin: 15}}>
           <Box sx={{ width: {xs: '86%', sm: '500px'}, display: 'flex', marginLeft: 5 }}
            marginTop={6}
            >
      <BottomNavigation
        showLabels
        value={value}
        sx={{position:'relative', zIndex: 'drawer', top: 2, width: 300}}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction sx={{border: 2, borderColor: `${value===0 ? '' : 'darkgray'}`, borderBottom: `${value===0 ? '1' : ''}`, borderBottomColor: `${value===0 ? 'white' : ''}`, borderRadius: '16px 16px 0px 0px'}} label="Надіслати запитання"/>
        <BottomNavigationAction sx={{border: 2, borderColor: `${value===1 ? '' : 'darkgray'}`, borderBottom: `${value===0 ? '1' : ''}`, borderBottomColor: `${value===1 ? 'white' : ''}`, borderRadius: '16px 16px 0px 0px'}} label="Мої питання" />
      </BottomNavigation>
      
    </Box>
    <Box width={'95%'} marginBottom={10} position={'relative'}
            zIndex={1} sx={{borderTop: 2, borderColor: 'darkgray'}}>
                <Box display={value===0 ? 'block' : 'none'}>
                <SendQuestion/>
                </Box>
                <Box display={value===1 ? 'block' : 'none'}>
                    <UserQuestion/>
                </Box>    
            </Box>
        </div>
    );
}