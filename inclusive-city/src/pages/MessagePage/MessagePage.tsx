import { Footer } from "../NavbarAndFooter/Footer";
import { Navbar } from "../NavbarAndFooter/Navbar";
import { SendQuestion } from "./components/SendQuestion";
import { TwoChoice } from "./components/TwoChoice";

export const MessagePage = () => {

    return(
        <div>
            <Navbar/>
            <TwoChoice/>
            <Footer/>
        </div>
    );
}