import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { StarRating } from "../../InfoPage/components/StarRating";
import { Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { ElementDto } from "../../../app/api/externalServicesApi";
import { Box } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";

type RentalCardProps = {
  liked?: boolean;
  theBest?: boolean;
  structure: ElementDto;
};

export default function StructureCard({
  structure,
  theBest = false,
  liked = false,
}: RentalCardProps) {
  const [isLiked, setIsLiked] = React.useState(liked);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.userData);

  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: "neutral.softBg",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        minWidth: 500,
        overflow: "hidden",
        boxSizing: "border-box",
        "&:hover": {
          boxShadow: "lg",
          borderColor: "var(--joy-palette-neutral-outlinedDisabledBorder)",
        },
        m: { xs: 1, sm: 2 },
      }}
    >
      <CardOverflow
        sx={{
          flex: { xs: "0 0 auto", sm: "0 0 160px" },
          width: { xs: "100%", sm: 160 },
          minWidth: { xs: "100%", sm: 120 },
          mb: { xs: 0, sm: "var(--CardOverflow-offset)" },
          mr: { xs: 0, sm: "var(--CardOverflow-offset)" },
          "--AspectRatio-radius": {
            xs: "calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0",
            sm: "calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0 calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px))",
          },
        }}
      >
        <AspectRatio
          ratio="1"
          flex
          sx={{
            minWidth: { xs: "100%", sm: 120, md: 160 },
            maxHeight: { xs: 180, sm: 160 },
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <img
            alt=""
            src={
              structure.imageUrls && structure.imageUrls.length > 0
                ? structure.imageUrls[0]
                : "/placeholder.png"
            }
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
          <Stack
            alignItems="center"
            direction="row"
            sx={{ position: "absolute", top: 0, width: "100%", p: 1 }}
          >
            {theBest && (
              <Chip
                variant="soft"
                color="success"
                startDecorator={<WorkspacePremiumRoundedIcon />}
                size="md"
              >
                The best one
              </Chip>
            )}
            <IconButton
              variant="plain"
              size="sm"
              color={isLiked ? "danger" : "neutral"}
              onClick={() => setIsLiked((prev) => !prev)}
              sx={{
                display: { xs: "flex", sm: "none" },
                ml: "auto",
                borderRadius: "50%",
                zIndex: "20",
              }}
            >
              <FavoriteRoundedIcon />
            </IconButton>
          </Stack>
        </AspectRatio>
      </CardOverflow>
      <CardContent
        sx={{
          minWidth: 0,
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Stack
          spacing={1}
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box sx={{ minWidth: 0, maxWidth: "100%" }}>
            <Typography level="body-sm" noWrap>
              {(structure.tags && structure.tags["amenity"]) || ""}
            </Typography>
            <Typography level="title-md" noWrap>
              <Link
                overlay
                underline="none"
                href="#interactive-card"
                sx={{ color: "text.primary" }}
              >
                {(structure.tags && structure.tags["name"]) || "no name"}
              </Link>
            </Typography>
          </Box>
          <IconButton
            variant="plain"
            size="sm"
            color={isLiked ? "danger" : "neutral"}
            onClick={() => setIsLiked((prev) => !prev)}
            sx={{
              display: { xs: "none", sm: "flex" },
              borderRadius: "50%",
            }}
          >
            <FavoriteRoundedIcon />
          </IconButton>
        </Stack>

        <Stack
          spacing={1}
          direction="row"
          useFlexGap
          flexWrap="wrap"
          sx={{
            my: 0.5,
            maxWidth: "100%",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              mt: 1,
              maxHeight: 36,
              maxWidth: { xs: "100%", sm: 200 },
              ml: 2,
              fontSize: "15px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
            onClick={() => navigate(`/info/${structure.type}/${structure.id}`)}
          >
            View more
          </Button>
        </Stack>
        <Stack direction="row" sx={{ mt: "auto" }}>
          <StarRating
            readonly={true}
            sizeText="20px"
            idStructure={structure.id ?? 0}
            osmType={structure.type || "node"}
            username={user.userName}
            createdBy={user.userId}
            imageBase64={""}
            rating={Math.round(structure.rating || 0)}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
