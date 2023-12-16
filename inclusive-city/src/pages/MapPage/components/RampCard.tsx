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
import { GetStructureDto } from "../../../app/api/structureApi";
import { useNavigate } from "react-router-dom";

type RentalCardProps = {
  liked?: boolean;
  theBest?: boolean;
  structure: GetStructureDto;
};

export default function RampCard({
  structure,
  theBest = false,
  liked = false,
}: RentalCardProps) {
  const [isLiked, setIsLiked] = React.useState(liked);
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        bgcolor: "neutral.softBg",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        "&:hover": {
          boxShadow: "lg",
          borderColor: "var(--joy-palette-neutral-outlinedDisabledBorder)",
        },
      }}
    >
      <CardOverflow
        sx={{
          mr: { xs: "var(--CardOverflow-offset)", sm: 0 },
          mb: { xs: 0, sm: "var(--CardOverflow-offset)" },
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
            minWidth: { sm: 120, md: 160 },
            "--AspectRatio-maxHeight": { xs: "160px", sm: "9999px" },
          }}
        >
          <img alt="" src={structure.imageUrl} />
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
      <CardContent>
        <Stack
          spacing={1}
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <div>
            <Typography level="body-sm">{structure.category}</Typography>
            <Typography level="title-md">
              <Link
                overlay
                underline="none"
                href="#interactive-card"
                sx={{ color: "text.primary" }}
              >
                {structure.name}
              </Link>
            </Typography>
          </div>
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
          spacing="0.55rem 1rem"
          direction="row"
          useFlexGap
          flexWrap="wrap"
          sx={{ my: 0.25 }}
        >
          <Typography level="body-md" sx={{ paddingTop: "15px" }}>
            {structure.distanceInKm?.toFixed(2)} km.
          </Typography>
          {/*<Typography level="body-md" startDecorator={<FmdGoodRoundedIcon />}>
            Lviv
          </Typography>*/}
          <Button
            variant="outlined"
            sx={{
              mt: 1,
              maxHeight: "0px",
              maxWidth: "700px",
              ml: 2,
              fontSize: "15px",
            }}
            onClick={() => navigate("/info/" + structure.id)}
          >
            View more
          </Button>
        </Stack>
        <Stack direction="row" sx={{ mt: "auto" }}>
          <StarRating
            readonly={true}
            sizeText="20px"
            idStructure={""}
            rating={Math.ceil(structure.rating)}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
