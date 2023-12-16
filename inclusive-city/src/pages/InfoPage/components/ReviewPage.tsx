import { Avatar, Button, Typography } from "@mui/joy";
import { Box, Divider } from "@mui/material";
import TwoSidedLayout from "./TwoSlideLayout";
import { StarRating } from "./StarRating";
import { useGetReviewsForStructureQuery } from "../../../api/reviewRtkApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetStructureQuery } from "../../../api/structureRtkApi";
import { useEffect, useState } from "react";

export const ReviewPage = () => {
  const { structureId } = useParams();
  const { data: structure, isFetching } = useGetStructureQuery({
    id: structureId ?? "",
    longitude: 0,
    latitude: 0,
  });
  const { data: reviewsData = [] } = useGetReviewsForStructureQuery(
    structureId ?? "",
    { skip: !structure || isFetching }
  );

  const navigate = useNavigate();

  return (
    <Box sx={{ paddingBottom: 5 }}>
      <TwoSidedLayout imgUrl={structure?.imageUrl ?? ""}>
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
            {structure?.name}
          </Typography>
          <Typography
            fontSize="lg"
            textColor="text.secondary"
            lineHeight="lg"
            marginBottom={3}
          >
            {structure?.description}
          </Typography>
          <Button size="lg" onClick={() => navigate("/map")} color="success">
            Return to explore more
          </Button>
          {structure && (
            <StarRating
              readonly={false}
              sizeText="30px"
              idStructure={structureId ?? ""}
              rating={Math.ceil(structure.rating)}
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
        {reviewsData.map((value) => (
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
              <i>{new Date(value.createdDate).toDateString()}</i>
            </Typography>
            <StarRating
              readonly={true}
              sizeText="30px"
              idStructure={structureId ?? ""}
              rating={Math.ceil(value.rating)}
            />
            <Typography textColor="text.secondary" sx={{ marginTop: 2 }}>
              {value.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
