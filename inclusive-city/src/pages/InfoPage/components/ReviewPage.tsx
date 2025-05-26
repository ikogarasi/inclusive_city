import { Avatar, Button, Typography } from "@mui/joy";
import { Box, Divider } from "@mui/material";
import TwoSidedLayout from "./TwoSlideLayout";
import { StarRating } from "./StarRating";
import { useNavigate, useParams } from "react-router-dom";
import { useGetStructureByIdQuery } from "../../../api/externalServicesRktApi"; // <-- add import

export const ReviewPage = () => {
  const { type, structureId } = useParams();
  const { data: structure } = useGetStructureByIdQuery({
    osmId: Number(structureId) ?? 0,
    type: type ?? "",
    shouldRetrieveRating: true,
    shouldGetImages: true,
    shouldRetrieveReviews: true,
  });

  const navigate = useNavigate();

  const imageUrl = structure?.imageUrls?.[0] || "/placeholder.png";

  return (
    <Box sx={{ paddingBottom: 5 }}>
      <TwoSidedLayout imgUrl={imageUrl}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
          }}
        >
          <Typography
            level="h1"
            fontWeight="xl"
            fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
            marginBottom={1}
          >
            {structure?.tags?.name || "no name"}
          </Typography>
          <Button size="lg" onClick={() => navigate("/map")} color="success">
            Return to explore more
          </Button>
          {structure && (
            <StarRating
              readonly={false}
              sizeText="30px"
              idStructure={structureId ?? ""}
              rating={Math.ceil(structure?.rating || 0)}
            />
          )}
        </Box>
      </TwoSidedLayout>
      <Divider variant="middle"></Divider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginLeft: 2,
          marginTop: 3,
        }}
      >
        <Typography level="h2">The latest comments:</Typography>
        {structure?.reviews?.map((value) => (
          <Box sx={{ marginLeft: 5, marginTop: 3 }} key={value.id}>
            <Typography
              startDecorator={
                <Avatar component="span" size="lg" variant="outlined" />
              }
              sx={{ "--Typography-gap": "12px" }}
            >
              <b>{value.username}</b>
            </Typography>
            <Typography sx={{ marginTop: 2 }}>
              <i>{value.createdAt?.toDateString()}</i>
            </Typography>
            <StarRating
              readonly={true}
              sizeText="30px"
              idStructure={structureId ?? ""}
              rating={value.rate || 0}
            />
            <Typography textColor="text.secondary" sx={{ marginTop: 2 }}>
              {value.comment}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
