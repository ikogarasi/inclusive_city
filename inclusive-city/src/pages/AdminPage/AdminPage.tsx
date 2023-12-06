import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Navbar } from "../NavbarAndFooter/Navbar";
import { Footer } from "../NavbarAndFooter/Footer";
import { Typography } from "@mui/joy";
import React from "react";
import { AddInfoPage } from "./components/AddInfoPage";
import { ThreeChoice } from "./components/ThreeChoice";

export const AdminPage = () => {
    
    return (
        <div>
            <Navbar/>
            <ThreeChoice/>
            <Footer/>
        </div>
    );
} 