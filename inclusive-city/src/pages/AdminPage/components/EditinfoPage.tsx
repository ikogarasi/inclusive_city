import { Typography } from "@mui/joy";
import { Box, Button, Grid } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  useDeleteStructureMutation,
  useGetAllStructuresQuery,
} from "../../../api/structureRtkApi";

export const EditInfoPage = () => {
  const [deleteStructure] = useDeleteStructureMutation();
  const { data: data = [] } = useGetAllStructuresQuery({
    latitude: 0,
    longitude: 0,
    count: 1000,
    category: null,
  });

  const onDeleteClick = async (id: string) => {
    await deleteStructure(id);
  };

  return (
    <div>
      {data.map((value) => (
        <Box
          border={2}
          width={"94%"}
          marginBottom={10}
          borderRadius={"16px"}
          sx={{ border: 2, borderColor: "lightgray", margin: 3 }}
        >
          <Box sx={{ margin: 1 }}>
            <Grid container spacing={1} direction="row">
              <Grid container item spacing={3}>
                <Grid item xs={5}>
                  <img
                    src={value.imageUrl}
                    alt="Photo of ramp"
                    width={"100%"}
                    height={"100%"}
                    style={{ borderRadius: "10px" }}
                  />
                </Grid>
                <Grid item xs={5} marginTop={2}>
                  <Typography
                    level="h1"
                    fontWeight="xl"
                    fontSize={{ xs: "20px", md: "40px" }}
                    marginBottom={1}
                  >
                    {value.name}
                  </Typography>
                  <Typography
                    fontSize={{ xs: "10px", md: "15px" }}
                    textColor="text.secondary"
                    lineHeight="lg"
                    marginBottom={2}
                  >
                    Category: {value.category}
                  </Typography>
                  <Typography
                    fontSize={{ xs: "10px", md: "23px" }}
                    textColor="text.secondary"
                    lineHeight="lg"
                    marginBottom={3}
                  >
                    {value.description}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    color="warning"
                    size="large"
                    sx={{ width: "50%", height: "25%", marginBottom: 3 }}
                  >
                    <CreateIcon sx={{ fontSize: { xs: "30px", md: "50px" } }} />
                  </Button>
                  <Button
                    color="error"
                    sx={{ width: "50%", height: "25%" }}
                    onClick={() => onDeleteClick(value.id as string)}
                  >
                    <DeleteOutlineIcon
                      sx={{ fontSize: { xs: "30px", md: "50px" } }}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ))}
    </div>
  );
};
