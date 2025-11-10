//  Original Imports
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

// Original routes
import PermitTypeRoutes from "./src/routes/PTW_module/PermitType/pt_routes.js";
import ChecklistRoutes from "./src/routes/PTW_module//Checklist/checklist_routes.js";
import RequestorRoutes from "./src/routes/PTW_module//Requestor/requestor_routes.js";
import FlowRoutes from "./src/routes/PTW_module//Flow/flow_routes.js";
import AccountRoutes from "./src/routes/PTW_module//Account/account_routes.js";
import PtwRoutes from "./src/routes/PTW_module/PermitToWork/ptw_routes.js";
import PartsRoutes from "./src/routes/Parts_module/Parts/parts_routes.js";
import IAQRoutes from "./src/routes/IAQ_module/IAQ_Transaction/IaqRouter.js";
import AttendanceRoutes from "./src/routes/Attendance_module/Attendance/AttendanceRouter.js";
import BookingRoutes from "./src/routes/Booking_module/Booking/BookingRouter.js";
import FaultReportRoutes from "./src/routes/Fault_Report_module/FaultReport/Fault_ReportRouter.js";
import MeterRoutes from "./src/routes/Meter_module/Meter/MeterRouter.js";
import MeterreadingRoutes from "./src/routes/Meter_module/MeterReading/ReadingRouter.js";
import SchoolRoutes from "./src/routes/School_module/School/school_routes.js";
import LicenseRoutes from "./src/routes/License_module/License/LicenseRouter.js";
import VisitorRoutes from "./src/routes/VisitorManagement_Module/VisitorManagement/VisitorRouter.js";
import EntryRoutes from "./src/routes/VisitorManagement_Module/Visitorentry/EntryRouter.js";
import ScheduleRoutes from "./src/routes/Schedule_module/Schedule/ScheduleRouter.js";
import EmailRoutes from "./src/routes/PTW_module/E-mail/email_routes.js";
import PermitToWorkEmailRoutes from "./src/routes/PTW_module/PermitToWork/ptwEmail_routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;


//  Added for SSO Authentication
import session from "express-session";          // <-- Added
import passport from "passport";                // <-- Added
import authRoutes from "./src/login/auth.js";     // <-- Added
import "./src/config/sequelize.js"                     // <-- Added (Sequelize or DB connection)
import logoutRoute from './src/config/logout.js';  // <-- Added logout route
// Middleware
app.use(cors({
  origin: ["http://***REMOVED***:80"],            // <-- Modified for SSO frontend CORS
  credentials: true
}));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Added session + passport setup
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// PROJECT  Routes

app.use("/api/v1/permitType", PermitTypeRoutes);
app.use("/api/v1/checklist", ChecklistRoutes);
app.use("/api/v1/flow", FlowRoutes);
app.use("/api/v1/requestor", RequestorRoutes);
app.use("/api/v1/account", AccountRoutes);
app.use("/api/v1/ptw", PtwRoutes);
app.use("/api/v1/parts", PartsRoutes);
app.use("/api/v1/iaq", IAQRoutes);
app.use("/api/v1/auth", SchoolRoutes);
app.use("/api/v1/booking", BookingRoutes);
app.use("/api/v1/meter", MeterRoutes);
app.use("/api/v1/attendance", AttendanceRoutes);
app.use("/api/v1/report", FaultReportRoutes);
app.use("/api/v1/reading", MeterreadingRoutes);
app.use("/api/v1/email", EmailRoutes);
app.use("/api/v1/ptw_email", PermitToWorkEmailRoutes);
app.use("/api/v1/license", LicenseRoutes);
app.use("/api/v1/visitor", VisitorRoutes);
app.use("/api/v1/entry", EntryRoutes);
app.use("/api/v1/schedule", ScheduleRoutes);


// Added for Google & Microsoft SSO
app.use("/api/auth", authRoutes);               // <-- Added new route for SSO login

app.use('/api', logoutRoute);


//  Error Handling (same as before)

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error("Error in middleware: ", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Server Start

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.APP_ENV} mode`);
});
