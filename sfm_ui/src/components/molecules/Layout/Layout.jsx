import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../Header/Header.jsx";
import Maincontent from "../Maincontent/Maincontent.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
// import chatbot from "chatbot";


const Layout = ({ children, header }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar closed by default

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <Box
      sx={{
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        height: "100vh", // Full viewport height
        overflow: "hidden", // Prevent scrolling on the layout level
      }}
    >
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content and Sidebar */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden", // Prevent scrolling on the container level
          marginTop: "50px", // Adjust this value to match the height of the header
        }}
      >
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <Maincontent isSidebarOpen={isSidebarOpen}>{children}</Maincontent>
        <div>
          <chatbot />
        </div>
      </Box>
    </Box>
  );
};

export default Layout;
