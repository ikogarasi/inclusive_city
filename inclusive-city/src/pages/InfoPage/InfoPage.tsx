import { Footer } from "../NavbarAndFooter/Footer";
import { Navbar } from "../NavbarAndFooter/Navbar";
import { ReviewPage } from "./components/ReviewPage";

export const InfoPage = () => {
    return(
        <div>
        <Navbar/>
         <ReviewPage/>
        <Footer/>
        </div>
    );
}