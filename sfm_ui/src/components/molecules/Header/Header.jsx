import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { getUserData } from "../../../utils/utils";
import logoMale from "../../../assests/logo-male.jpg";

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userdata = getUserData();
    setUser(userdata);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      if (user && user.user && user.user.id) {
        const userId = user.user.id;

        // Call backend logout API
        await fetch("http://localhost:5000/api/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        console.log(`Logout time saved for user ID: ${userId}`);
      } else {
        console.warn("User ID not found — logout time not saved.");
      }

      // Clear session storage and redirect
      sessionStorage.removeItem("userdata");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      color="secondary"
      elevation={0}
      sx={{
        width: "82%",
        transition: "width 0.3s, margin 0.3s",
        height: 60,
      }}
    >
      <Toolbar>
        <IconButton
          onClick={handleMenuOpen}
          sx={{ p: 0, marginLeft: "auto" }}
        >
          <Avatar
            alt={user.user.displayName}
            src={logoMale}
            sx={{ width: 42, height: 42, borderRadius: 1 }}
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleMenuClose}>Account</MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
