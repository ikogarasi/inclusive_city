import Button from "@mui/joy/Button";
import { Navbar } from "../NavbarAndFooter/Navbar";
import { CardCity } from "./components/CardCity";
import { HowItWorks } from "./components/HowItWorks";
import { CantFind } from "./components/CantFind";
import { Footer } from "../NavbarAndFooter/Footer";
import { ChatPopUp } from "../NavbarAndFooter/ChatPopUp";

export const HomePage = () => {
  return(
    <div>
    <Navbar/>
    <CardCity/>
    <HowItWorks/>
      <CantFind />
      <ChatPopUp/>
    <Footer/>
    </div>
  );
}