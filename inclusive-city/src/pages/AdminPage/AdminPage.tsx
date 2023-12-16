import { Navbar } from "../NavbarAndFooter/Navbar";
import { Footer } from "../NavbarAndFooter/Footer";
import { ThreeChoice } from "./components/ThreeChoice";

export const AdminPage = () => {
  return (
    <div>
      <Navbar />
      <ThreeChoice />
      <Footer />
    </div>
  );
};
