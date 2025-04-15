import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { ThemeProvider } from "@mui/joy";
import { common } from "@mui/material/colors";
import { useRegisterMutation } from "../../../api/authRtkApi";
import { useNavigate } from "react-router-dom";
import { ApiException, RegisterDto } from "../../../app/api/authApi";

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function SignInPage() {
  const [register] = useRegisterMutation();
  const navigate = useNavigate();
  const [error, SetError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<SignInFormElement>) => {
    e.preventDefault();

    const formElements = e.currentTarget.elements;

    const data: RegisterDto = {
      userName: formElements.username.value,
      email: formElements.email.value,
      password: formElements.password.value,
    };

    try {
      await register(data);

      navigate("/login");
    } catch (error) {
      if (error) {
        console.log(error);

      }
      console.log(error);
    }
    
  };

  return (
    <ThemeProvider>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
            "--Cover-width": "50vw", // must be `vw` only
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(15px)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(255 255 255 / 0.2)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width:
              "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
            maxWidth: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: "flex",
              alignItems: "left",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                gap: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography level="title-lg">InCity</Typography>
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .${formLabelClasses.asterisk}`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography level="h3">Sign up</Typography>
                <Typography level="body-sm">
                  Have an account?{" "}
                  <Link onClick={() => navigate("/login")} level="title-sm">
                    Log in!
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            <Stack gap={4} sx={{ mt: 2 }}>
              <form onSubmit={handleSubmit}>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input type="username" name="username"></Input>
                </FormControl>
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" name="password" />
                </FormControl>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Button type="submit" fullWidth>
                    Sign up
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box
            component="footer"
            sx={{
              py: 3,
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Typography sx={{ color: common.black }}>
              {"Copyright © "}
              <Link
                sx={{ color: common.black }}
                href="https://your-website.com/"
              >
                InCity
              </Link>{" "}
              {new Date().getFullYear()}
              {"."}
            </Typography>
            <Typography>
              <Link
                onClick={() => navigate("/")}
                sx={{ marginRight: 4, color: common.black }}
              >
                Home
              </Link>{" "}
              <Link
                onClick={() => navigate("/map")}
                sx={{ color: common.black }}
              >
                Map
              </Link>{" "}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(/src/Images/PublicImages/boys.jpg)",
        }}
      />
    </ThemeProvider>
  );
}
