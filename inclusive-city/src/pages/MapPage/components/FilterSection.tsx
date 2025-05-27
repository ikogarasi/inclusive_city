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
import {
  Checkbox,
  DialogTitle,
  Drawer,
  FormControlLabel,
  MenuItem,
  Select,
  Collapse,
  Typography,
  Switch,
} from "@mui/material";
import { Dispatch } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AccessibleIcon from "@mui/icons-material/Accessible";
//import { useGetAllCategoriesQuery } from "../../../api/structureRtkApi";

const localCategories = [
  "Restaurant",
  "School",
  "University",
  "Hospital",
  "Toilets",
  "Police",
  "Pharmacy",
  "Marketplace",
];

function valueText(value: number) {
  return `${value.toLocaleString("en-US")}km`;
}

interface Props {
  category: string;
  setCategory: Dispatch<React.SetStateAction<string>>;
  around: number;
  setAround: Dispatch<React.SetStateAction<number>>;
  isWheelChair: boolean;
  setIsWheelChair: Dispatch<React.SetStateAction<boolean>>;
  showInclusiveFeatures?: boolean;
  setShowInclusiveFeatures?: (value: boolean) => void;
  inclusiveFilters?: {
    toilets: boolean;
    busStops: boolean;
    kerbs: boolean;
    tactilePaving: boolean;
    ramps: boolean;
  };
  updateInclusiveFilter?: (name: string, value: boolean) => void;
}

export default function Filters({
  category,
  setCategory,
  around,
  setAround,
  isWheelChair,
  setIsWheelChair,
  showInclusiveFeatures = false,
  setShowInclusiveFeatures = () => {},
  inclusiveFilters = {
    toilets: true,
    busStops: true,
    kerbs: true,
    tactilePaving: true,
    ramps: true,
  },
  updateInclusiveFilter = () => {},
}: Props) {
  const categories = localCategories; // useGetAllCategoriesQuery().data || [];

  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

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
              {categories.map((value, i) => (
                <MenuItem key={i} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <FormControl>
            <FormLabel>Distance (km)</FormLabel>
            <Slider
              value={around}
              onChange={(_, value) => setAround(Number(value))}
              defaultValue={1}
              step={0.5}
              min={0.5}
              max={10}
              getAriaValueText={valueText}
              valueLabelDisplay="auto"
              valueLabelFormat={valueText}
              marks={[
                { value: 0.5, label: "0.5" },
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
          <FormControlLabel
            control={
              <Checkbox
                checked={isWheelChair}
                onChange={(_, checked) => setIsWheelChair(checked)}
              />
            }
            label="Тільки з доступністю для інвалідних візків"
            sx={{ ml: 1 }}
          />

          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "background.level1",
              borderRadius: "sm",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => setExpanded(!expanded)}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessibleIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Інклюзивні об'єкти</Typography>
              </Box>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            <Collapse in={expanded}>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showInclusiveFeatures}
                      onChange={(e) =>
                        setShowInclusiveFeatures(e.target.checked)
                      }
                    />
                  }
                  label="Показати інклюзивні об'єкти"
                />

                {showInclusiveFeatures && (
                  <Box sx={{ ml: 2, mt: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={inclusiveFilters.toilets}
                          onChange={(e) =>
                            updateInclusiveFilter("toilets", e.target.checked)
                          }
                          size="small"
                        />
                      }
                      label="Інклюзивні туалети"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={inclusiveFilters.busStops}
                          onChange={(e) =>
                            updateInclusiveFilter("busStops", e.target.checked)
                          }
                          size="small"
                        />
                      }
                      label="Доступні автобусні зупинки"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={inclusiveFilters.kerbs}
                          onChange={(e) =>
                            updateInclusiveFilter("kerbs", e.target.checked)
                          }
                          size="small"
                        />
                      }
                      label="Безбар'єрні бордюри"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={inclusiveFilters.tactilePaving}
                          onChange={(e) =>
                            updateInclusiveFilter(
                              "tactilePaving",
                              e.target.checked
                            )
                          }
                          size="small"
                        />
                      }
                      label="Тактильна плитка"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={inclusiveFilters.ramps}
                          onChange={(e) =>
                            updateInclusiveFilter("ramps", e.target.checked)
                          }
                          size="small"
                        />
                      }
                      label="Пандуси"
                    />
                  </Box>
                )}
              </Box>
            </Collapse>
          </Box>
        </Stack>
      </Drawer>
    </Stack>
  );
}
