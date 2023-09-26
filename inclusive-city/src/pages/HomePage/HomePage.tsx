import Button from "@mui/joy/Button";
import { Navbar } from "../NavbarAndFooter/Navbar";
import { CardCity } from "./components/CardCity";
import { HowItWorks } from "./components/HowItWorks";
import { CantFind } from "./components/CantFind";
import { Footer } from "../NavbarAndFooter/Footer";

export const HomePage = () => {
  return(
    <div>
    <Navbar/>
    <CardCity/>
    <HowItWorks/>
    <CantFind/>
    <Footer/>
    </div>
  );
}