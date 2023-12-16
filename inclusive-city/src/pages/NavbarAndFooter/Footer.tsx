import { Box, Link, Typography, createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  const greenTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#aaba5d",
      },
    },
  });

  return (
    <Box
      sx={{
        backgroundColor: "#b0bc5c",
        p: 4,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        bottom: 0,
        position: "relative",
      }}
      component="footer"
    >
      <Typography variant="body2" color="text.secondary" align="left">
        {"Copyright © "}
        <Link
          color="inherit"
          href="https://youtu.be/dQw4w9WgXcQ?si=nnq4AsW0JmLP9DOE"
        >
          InCity
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <Link
          color="inherit"
          onClick={() => navigate("/")}
          sx={{ marginRight: 2 }}
        >
          Home
        </Link>{" "}
        <Link color="inherit" onClick={() => navigate("/map")}>
          Map
        </Link>{" "}
      </Typography>
    </Box>
  );
};
