import * as React from 'react';
import { styled } from '@mui/material/styles';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { Box, Typography } from '@mui/material';

export const StarRating = () => {
    
const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const customIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" fontSize='large'/>,
    label: 'Useless',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" fontSize='large'/>,
    label: 'Poor',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" fontSize='large'/>,
    label: 'Ok',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" fontSize='large'/>,
    label: 'Good',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" fontSize='large' />,
    label: 'Excellent',
  },
};



function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

const [value, setValue] = React.useState<number >(2);
const [hover, setHover] = React.useState(-1);

const updateLabel = (newLabel: any) => {
  setValue(newLabel);
}



  return (
    
    <Box sx={{
        display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 2
    }}>
    <StyledRating
      name="highlight-selected-only"
      defaultValue={value}
      IconContainerComponent={IconContainer}
      getLabelText={(value: number) => customIcons[value].label}
      onChange={(event, newValue) => {
        updateLabel(newValue);
      }}
      onChangeActive={(event, newHover) => {
        setHover(newHover);
      }}
      highlightSelectedOnly
      size='large'
    />
    {value !== null && (
      <Typography
        fontSize="30px"
        fontWeight="md"
        marginLeft={2}
        sx={{ ml: 2 }}>
        {customIcons[hover !== -1 ? hover : value].label}
        </Typography>
      )}
      
      
      </Box>
  );

}