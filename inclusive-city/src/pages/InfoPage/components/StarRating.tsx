import * as React from 'react';
import { styled } from '@mui/material/styles';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { Box, Button, TextField, Typography } from '@mui/material';

export const StarRating: React.FC<{readonly: boolean, sizeText: string}> = (props) => {
    
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

const [value, setValue] = React.useState<number >(5);
const [hover, setHover] = React.useState(-1);
const [visible, setVisible] = React.useState(false);

const updateLabel = (newLabel: any) => {
  setValue(newLabel);
}

const visibleDescription = (click: any) => {
  if(click) {
    return (
        <div>
          <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%'
    }}>
    <TextField
          id="outlined-multiline-static"
          label="Description"
          multiline
          rows={4}
          placeholder="Description (Optional)"
          sx={{marginTop: 2}}
        />
        </Box>
        <div style={{marginTop: 10, display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%'}}>
        <Button variant='outlined' color="success"
        >Share</Button>
        </div>
        </div>
    );
  }
}


  return (
    <div>
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
        setVisible(true);
      }}
      onChangeActive={(event, newHover) => {
        setHover(newHover);
      }}
      highlightSelectedOnly
      size='large'
      readOnly={props.readonly}
    />
    {value !== null && (
      <Typography
        fontSize={props.sizeText}
        fontWeight="md"
        marginLeft={2}
        sx={{ ml: 2 }}>
        {customIcons[hover !== -1 ? hover : value].label}
        </Typography>
      )}
      
      </Box>
      
        {visibleDescription(visible)}
      </div>
  );

}