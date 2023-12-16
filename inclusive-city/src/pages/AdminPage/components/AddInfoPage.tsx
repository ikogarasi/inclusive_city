import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import {
  useCreateStructureMutation,
  useGetAllCategoriesQuery,
} from "../../../api/structureRtkApi";

interface ValidationErrors {
  name: boolean;
  latitude: boolean;
  longitude: boolean;
  description: boolean;
  imageValid: boolean;
  category: boolean;
  newCategory: boolean;
}

// latitude regex
const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;

// longitude regex
const regexLon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;

// перевірка чи є текст валідація
export const AddInfoPage = () => {
  const [category, setCategory] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("");
  const [name, setName] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<ValidationErrors>();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [addStructure] = useCreateStructureMutation();
  const { data = [] } = useGetAllCategoriesQuery();

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const setBlank = () => {
    setCategory("");
    setName("");
    setLatitude("");
    setLongitude("");
    setDescription("");
    setImageUrl(null);
    setSuccess("");
    setNewCategory("");
  };

  const checkInfo = async () => {
    const validation: ValidationErrors = {
      name: false,
      latitude: false,
      longitude: false,
      description: false,
      imageValid: false,
      category: false,
      newCategory: false,
    };

    setErrorMessage(validation);

    if (name?.length < 4) {
      validation.name = true;
    }

    if (category === "New category" && newCategory?.length < 4) {
      validation.newCategory = true;
    }

    if (!regexLat.test(latitude)) {
      validation.latitude = true;
    }

    if (!regexLon.test(longitude)) {
      validation.longitude = true;
    }

    if (description?.length < 10) {
      validation.description = true;
    }

    console.log(validation);
    if (Object.values(validation).indexOf(true) >= 0) {
      setErrorMessage(validation);
    } else {
      console.log("lox");
      await addStructure({
        name: name,
        image: imageFile,
        description: description,
        category: category === "New category" ? newCategory : category,
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(file);

    if (imageUrl !== null) {
      setSuccess("You upload photo succesfuly!");
    } else {
      setSuccess("Try again!");
    }
    setImageFile(file);
  };

  const newInputCategory = () => {
    if (category === "New category") {
      return (
        <div>
          <TextField
            sx={{ width: 160, marginTop: 8 }}
            helperText={
              errorMessage?.newCategory
                ? "Please enter name of new category"
                : ""
            }
            id="demo-helper-text-aligned"
            label="Input new..."
            value={newCategory}
            error={errorMessage?.newCategory}
            onChange={(event) => {
              setNewCategory(event.target.value);
            }}
          />
        </div>
      );
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      margin={5}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexGrow: 1,
        flexWrap: { sm: "nowrap", xs: "wrap" },
      }}
    >
      <Grid container spacing={1} direction="row">
        <Grid container item spacing={3}>
          <Grid item sm={4}>
            <TextField
              helperText={errorMessage?.name ? "Please enter place name" : ""}
              id="demo-helper-text-aligned"
              label="Name"
              value={name}
              error={errorMessage?.name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Grid>
          <Grid item sm={4}>
            <TextField
              helperText={errorMessage?.latitude ? "Please enter latitude" : ""}
              id="demo-helper-text-aligned-no-helper"
              label="Latitude"
              value={latitude}
              error={errorMessage?.latitude}
              onChange={(event) => {
                setLatitude(event.target.value);
              }}
            />
          </Grid>
          <Grid item sm={4}>
            <TextField
              helperText={
                errorMessage?.longitude ? "Please enter longitude" : ""
              }
              id="demo-helper-text-aligned-no-helper"
              label="Longitude"
              value={longitude}
              error={errorMessage?.longitude}
              onChange={(event) => {
                setLongitude(event.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid container item marginTop={2}>
          <TextField
            helperText={
              errorMessage?.description ? "Please enter description" : ""
            }
            id="demo-helper-text-aligned-no-helper"
            label="Description"
            error={errorMessage?.description}
            multiline
            rows={5}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            sx={{
              width: { sm: "55%", xs: "89%" },
              marginBottom: { xs: 5 },
              color: `${errorMessage ? "error" : "primary"}`,
            }}
          />

          <Box
            sx={{ display: "flex", flexDirection: "column", marginLeft: "8%" }}
          >
            <label htmlFor="upload-image">
              <Button
                variant="contained"
                component="span"
                sx={{ backgroundColor: "grey" }}
              >
                Upload Photo
              </Button>
              <input
                id="upload-image"
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileUpload}
              />
            </label>
            <label style={{ marginTop: 10 }}>{success}</label>

            <FormControl sx={{ width: 160, marginTop: 3 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={category}
                label="Category"
                onChange={handleChange}
                error={errorMessage?.category}
              >
                <MenuItem value="New category">
                  <em>New category</em>
                </MenuItem>
                {data.map((category) => (
                  <MenuItem value={category.name}>{category.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {errorMessage?.category ? "Please choose category" : ""}
              </FormHelperText>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", marginLeft: 4 }}>
            {imageUrl !== null && (
              <div>
                <Button
                  variant="contained"
                  component="span"
                  sx={{
                    backgroundColor: "grey",
                    height: 37,
                    width: 130,
                    marginBottom: -1,
                  }}
                  onClick={handleClickOpen}
                >
                  View photo
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Image for web-site"}
                  </DialogTitle>
                  <DialogContent>
                    {imageUrl && (
                      <img src={imageUrl} alt="Uploaded Image" height="300" />
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}
            {newInputCategory()}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
              marginTop: 3,
            }}
          >
            <Button
              variant="contained"
              sx={{ marginRight: 5 }}
              size="large"
              onClick={setBlank}
            >
              RESET
            </Button>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={checkInfo}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
