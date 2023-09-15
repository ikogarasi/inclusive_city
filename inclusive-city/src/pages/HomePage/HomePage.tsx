import Button from "@mui/joy/Button";
import { Navbar } from "../NavbarAndFooter/Navbar";
import { CardCity } from "./components/CardCity";
import { HowItWorks } from "./components/HowItWorks";

export const HomePage = () => {
  return(
    <div>
    <Navbar/>
    <CardCity/>
    <HowItWorks/>
    </div>
  );
}