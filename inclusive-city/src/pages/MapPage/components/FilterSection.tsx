import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import ModalClose from "@mui/joy/ModalClose";
import Stack from "@mui/joy/Stack";
import Slider, { sliderClasses } from "@mui/joy/Slider";
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import OrderBy from "./OrderBy";
import { DialogTitle, Drawer, MenuItem, Select } from "@mui/material";
import { Dispatch } from "react";
import { useGetAllCategoriesQuery } from "../../../api/structureRtkApi";

function valueText(value: number) {
  return `${value.toLocaleString("en-US")}km`;
}

interface Props {
  category: string;
  setCategory: Dispatch<React.SetStateAction<string>>;
}

export default function Filters({ category, setCategory }: Props) {
  const { data: categories = [] } = useGetAllCategoriesQuery();

  const [open, setOpen] = React.useState(false);
  return (
    <Stack
      useFlexGap
      direction="row"
      spacing={{ xs: 0, sm: 2 }}
      justifyContent={{ xs: "space-between" }}
      flexWrap="wrap"
      sx={{ minWidth: 0 }}
    >
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<FilterAltOutlined />}
        onClick={() => setOpen(true)}
      >
        Filters
      </Button>
      <OrderBy />
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Stack useFlexGap spacing={3} sx={{ p: 2, minWidth: 300 }}>
          <DialogTitle>Filters</DialogTitle>
          <ModalClose />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gridTemplateRows: "auto auto",
              gap: 1,
            }}
          >
            <FormLabel htmlFor="filters-category">Category</FormLabel>
            <Select
              id="filters-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value={"All"}>All</MenuItem>
              {categories.map((value) => (
                <MenuItem value={value.name}>{value.name}</MenuItem>
              ))}
            </Select>
          </Box>
          <FormControl>
            <FormLabel>Distance range {"(km)"}</FormLabel>
            <Slider
              defaultValue={[0.5, 2]}
              step={0.5}
              min={0}
              max={10}
              getAriaValueText={valueText}
              valueLabelDisplay="auto"
              valueLabelFormat={valueText}
              marks={[
                { value: 0, label: "0" },
                { value: 5, label: "5" },
                { value: 10, label: "10" },
              ]}
              sx={{
                [`& .${sliderClasses.markLabel}[data-index="0"]`]: {
                  transform: "none",
                },
                [`& .${sliderClasses.markLabel}[data-index="2"]`]: {
                  transform: "translateX(-100%)",
                },
              }}
            />
          </FormControl>
        </Stack>
      </Drawer>
    </Stack>
  );
}
