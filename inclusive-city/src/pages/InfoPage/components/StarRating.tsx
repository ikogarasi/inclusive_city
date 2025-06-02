import * as React from "react";
import { styled } from "@mui/material/styles";
import Rating, { IconContainerProps } from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAddReviewMutation } from "../../../api/externalServicesRktApi";

export const StarRating: React.FC<{
  readonly: boolean;
  sizeText: string;
  idStructure: number;
  osmType: string;
  imageBase64: string | null;
  createdBy: number;
  username: string;
  rating: number;
}> = (props) => {
  const StyledRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
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
      icon: <SentimentVeryDissatisfiedIcon color="error" fontSize="large" />,
      label: "Useless",
    },
    2: {
      icon: <SentimentDissatisfiedIcon color="error" fontSize="large" />,
      label: "Poor",
    },
    3: {
      icon: <SentimentSatisfiedIcon color="warning" fontSize="large" />,
      label: "Ok",
    },
    4: {
      icon: <SentimentSatisfiedAltIcon color="success" fontSize="large" />,
      label: "Good",
    },
    5: {
      icon: <SentimentVerySatisfiedIcon color="success" fontSize="large" />,
      label: "Прекрасно",
    },
  };

  function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  const [value, setValue] = React.useState<number>(
    props.rating === 0 ? null : props.rating
  );
  const [hover, setHover] = React.useState(-1);
  const [visible, setVisible] = React.useState(false);
  const [description, setDescription] = React.useState("");

  const updateLabel = (newLabel: any) => {
    setValue(newLabel);
  };

  React.useEffect(() => {}, []);

  const visibleDescription = (click: any) => {
    if (click) {
      return (
        <div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "100%",
            }}
          >
            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="Description (Optional)"
              sx={{ marginTop: 2 }}
            />
          </Box>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              maxWidth: "100%",
            }}
          >
            <Button
              variant="outlined"
              color="success"
              onClick={addReviewButton}
            >
              Share
            </Button>
          </div>
        </div>
      );
    }
  };

  const [addReview] = useAddReviewMutation();

  async function addReviewButton(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (value == 0) {
      console.log("Rate can`t be 0");
    } else {
      await addReview({
        osmId: props.idStructure,
        osmType: props.osmType,
        username: props.username,
        imageBase64: props.imageBase64,
        createdBy: props.createdBy,
        comment: description,
        rate: value,
      });

      console.log(
        props.osmType,
        props.username,
        props.createdBy,
        props.imageBase64
      );
    }
  }

  console.log("StarRating props:", props);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 2,
        }}
      >
        <StyledRating
          name="highlight-selected-only"
          value={value}
          IconContainerComponent={IconContainer}
          getLabelText={(v: number) => customIcons[v]?.label || "Not rated"}
          onChange={(event, newValue) => {
            updateLabel(newValue);
            setVisible(true);
          }}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          highlightSelectedOnly
          size="large"
          readOnly={props.readonly}
        />
        {value !== null && customIcons[hover !== -1 ? hover : value] ? (
          <Typography
            fontSize={props.sizeText}
            fontWeight="md"
            marginLeft={2}
            sx={{ ml: 2 }}
          >
            {customIcons[hover !== -1 ? hover : value].label}
          </Typography>
        ) : (
          <Typography
            fontSize={props.sizeText}
            fontWeight="md"
            marginLeft={2}
            sx={{ ml: 2 }}
            color="text.secondary"
          >
            Не оцінено
          </Typography>
        )}
      </Box>

      {visibleDescription(visible)}
    </div>
  );
};
