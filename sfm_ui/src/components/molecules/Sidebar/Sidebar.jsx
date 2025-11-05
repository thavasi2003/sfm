import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  AnchorOutlined as AnchorOutlinedIcon,
  AnalyticsOutlined as AnalyticsOutlinedIcon,
  CalendarTodayOutlined as CalendarTodayOutlinedIcon,
  RocketOutlined as RocketOutlinedIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import logo from "../../../assests/Cloudoeasy_logo.png";

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const [openAccordion, setOpenAccordion] = useState("");

  // Automatically expand the accordion with the active route
  useEffect(() => {
    const accordions = {
      dashboard: ["/home"],
      master: [
        "/parts",
        "/permitToWork",
        "/meter",
        "/display/attendance",
        "/display/school",
        "/display/report",
        "/display/booking",
        "/display/iaq",
        "/display/license",
        "/display/visitor",
        "/display/visitor_entry",
        "/display/schedule",
      ],
      transaction: ["/transaction/a", "/transaction/b"],
      reports: ["/reports/monthly", "/reports/annual"],
    };

    for (const [key, paths] of Object.entries(accordions)) {
      if (paths.includes(location.pathname)) {
        setOpenAccordion(key);
        break;
      }
    }
  }, [location.pathname]);

  const handleAccordionToggle = (panel) => (_, isExpanded) => {
    setOpenAccordion(isExpanded ? panel : "");
  };

  const accordionItem = (icon, title, key, items) => (
    <Accordion
      expanded={openAccordion === key}
      onChange={handleAccordionToggle(key)}
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#6c757d" }} />}
        sx={{
          padding: "0 16px",
          "& .MuiAccordionSummary-content": { margin: 0 },
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
        }}
      >
        <ListItem
          sx={{
            padding: 0,
            width: "100%",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <ListItemIcon sx={{ color: "#6c757d" }}>{icon}</ListItemIcon>
          <ListItemText
            primary={title}
            sx={{ color: "#6c757d", "&:hover": { color: "black" } }}
          />
        </ListItem>
      </AccordionSummary>
      <AccordionDetails>
        <List component="div" disablePadding>
          {items.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={index}
                component={Link}
                to={item.path}
                sx={{
                  pl: 5,
                  backgroundColor: isActive
                    ? "rgba(230, 153, 29, 0.2)"
                    : "inherit",
                  "&:hover": { backgroundColor: "rgba(230, 153, 29, 0.1)" },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "36px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      height: "6px",
                      width: "6px",
                      backgroundColor: isActive ? "orange" : "#6c757d",
                      borderRadius: "50%",
                      display: "inline-block",
                      color: "#6c757d",
                    }}
                  ></span>
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: isActive ? "orange" : "#6c757d",
                    fontWeight: isActive ? "bold" : "normal",
                    fontSize: "1px",
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          backgroundColor: theme.palette.primary.main,
          color: "black",
          zIndex: theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column", // Ensures vertical layout
          overflow: "hidden",
        },
      }}
    >
      {/* Logo Section - fixed height */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 120,
          flexShrink: 0,
          padding: "16px 0",
          backgroundColor: "#fff",
        }}
      >
        <img
          src={logo}
          alt="CLOUDOEASY"
          style={{
            height: "100px",
            maxWidth: "80%",
            objectFit: "contain",
          }}
        />
      </Box>

      <Divider sx={{ bgcolor: "#6c757d" }} />

      {/* Scrollable content below */}
      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            padding: "8px",
            color: "#6c757d",
            textTransform: "uppercase",
            fontSize: "1rem",
            fontWeight: "bold",
            margin: "6px 15px",
            whiteSpace: "nowrap",
          }}
        >
          Menu
        </Typography>

        <List>
          {accordionItem(<RocketOutlinedIcon />, "Dashboard", "dashboard", [
            { label: "Home", path: "/home" },
          ])}
          {accordionItem(<AnchorOutlinedIcon />, "Master", "master", [
            { label: "Parts", path: "/parts" },
            { label: "Permit To Work", path: "/permitToWork" },
            { label: "Meter", path: "/meter" },
            { label: "Attendance", path: "/display/attendance" },
            { label: "School", path: "/display/school" },
            { label: "Fault Report", path: "/display/report" },
            { label: "Booking Management", path: "/display/booking" },
            { label: "IAQ Transaction", path: "/display/iaq" },
            { label: "License", path: "/display/license" },
            { label: "Visitor Invite", path: "/display/visitor" },
            { label: "Visitor Entry", path: "/display/visitor_entry" },
            { label: "Schedule Maintenance", path: "/display/schedule" },
          ])}
          {accordionItem(
            <CalendarTodayOutlinedIcon />,
            "Transaction",
            "transaction",
            [
              { label: "Transaction A", path: "/transaction/a" },
              { label: "Transaction B", path: "/transaction/b" },
            ]
          )}
          {accordionItem(<AnalyticsOutlinedIcon />, "Reports", "reports", [
            { label: "Monthly Report", path: "/reports/monthly" },
            { label: "Annual Report", path: "/reports/annual" },
          ])}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
