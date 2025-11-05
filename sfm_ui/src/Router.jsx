import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import ApprovalFlow from "./Views/PTW_module/PTW/ApprovalFlow/ApprovalFlow.jsx";
import ManagePTW from "./Views/PTW_module/PTW/ManagePTW/ManagePTW.jsx";
import Login from "./Views/Login/Login.jsx";
import ChecklistForm from "./Views/PTW_module/PTW/Checklist/ChecklistPage/ChecklistForm.jsx";
import UpdateChecklistForm from "./Views/PTW_module/PTW/Checklist/UpdateChecklistPage/UpdateChecklistForm.jsx";
import SuccessFormSubmit from "./Views/PTW_module/PTW/SuccessForm/SuccessFormSubmit.jsx";
import UpdateFlow from "./components/organisms/Update/PTW_module/UpdateFlow/UpdateFlow.jsx";
import PermitToWork from "./Views/PTW_module/PTW/PermitToWork/PermitTowork.jsx";
import NewPermitApp from "./components/organisms/Create/PTW_module/NewPermitApp/NewPermitApp.jsx";
import Parts from "./Views/Parts/Parts.jsx";
import Meter from "./Views/Meter/Meter.jsx";
import AddMeter from "./Views/Meter/Addmeter.jsx";
import EditMeter from "./Views/Meter/EditMeter.jsx";
import Reading from "./Views/Reading/Reading.jsx";
import AddReading from "./Views/Reading/Add_Reading.jsx";
import EditReading from "./Views/Reading/Edit_Reading.jsx";
import School from "./Views/School/school.jsx";
import AddSchool from "./Views/School/AddSchool.jsx";
import EditSchool from "./Views/School/EditSchool.jsx";
import Location from "./Views/Location/Location.jsx";
import AddLocation from "./Views/Location/Add_Location.jsx";
import EditLocation from "./Views/Location/Edit_location.jsx";
import Attendance from "./Views/Attendance/Attendance.jsx";
import AddAttendance from "./Views/Attendance/Add_Attendance.jsx";
import EditAttendance from "./Views/Attendance/Edit_Attendance.jsx";
import Report from "./Views/Fault Report/Report.jsx";
import AddReport from "./Views/Fault Report/Add_Report.jsx";
import EditReport from "./Views/Fault Report/Edit_Report.jsx";
import FaultReport from "./Views/Fault Report/Fault_Report.jsx";
import QRCodePage from "./Views/Location/QRcodegen.jsx";
import AddBooking from "./Views/Booking Management/AddBooking.jsx";
import EditBooking from "./Views/Booking Management/Edit_booking.jsx";
import SpaceManagement from "./Views/Booking Management/space_management.jsx";
import Iaq from "./Views/IAQ/Iaq.jsx";
import AddLicense from "./Views/License/Add_License.jsx";
import License from "./Views/License/License.jsx";
import EditLicense from "./Views/License/EditLicense.jsx";
import Assign from "./Views/License/Assign.jsx";
import Update from "./Views/License/Update.jsx";
import ViewHistory from "./Views/License/ViewHistroy.jsx";
import VisitorManagement from "./Views/VisitorManagement/Visitor.jsx";
import AddInvitation from "./Views/VisitorManagement/Add_visitor.jsx";
import EditVisitor from "./Views/VisitorManagement/Edit_visitor.jsx";
import VisitorEntry from "./Views/VisitorEntry/Visitor_Entry.jsx";
import AddVisitorEntry from "./Views/VisitorEntry/Add_visitorentry.jsx";
import Schedule from "./Views/Schedule/Schedule.jsx";
import BookScheduleMaintenance from "./Views/Schedule/Book_Schedule.jsx";
import EditSchedule from "./Views/Schedule/Edit_schedule.jsx";
import Home from "./components/molecules/Dashboard.jsx";
import Verify2FA from "./Views/Login/Verify2FA.jsx";

const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/parts", element: <Parts /> },
      { path: "/permitTowork", element: <PermitToWork /> },
      { path: "/managePTW", element: <ManagePTW /> },
      { path: "/approvalFlow", element: <ApprovalFlow /> },
      { path: "/updateFlow", element: <UpdateFlow /> },
      { path: "/newPermitApp", element: <NewPermitApp /> },
      { path: "/meter", element: <Meter /> },
      { path: "/display/add_meter", element: <AddMeter /> },
      { path: "/display/meter_edit/:id", element: <EditMeter /> },

      { path: "/display/reading/:id", element: <Reading /> },
      { path: "/display/add_reading/:id", element: <AddReading /> },

      { path: "/display/edit_reading/:id", element: <EditReading /> },

      { path: "/display/school", element: <School /> },
      { path: "/display/add_school", element: <AddSchool /> },
      { path: "/display/edit_school/:id", element: <EditSchool /> },

      { path: "/display/location/:id", element: <Location /> },
      { path: "/display/add_location/:id", element: <AddLocation /> },

      { path: "/display/edit_location/:id", element: <EditLocation /> },

      { path: "/display/qrcode/:locQRID", element: <QRCodePage /> },

      { path: "/display/attendance", element: <Attendance /> },
      { path: "/display/add_attendance", element: <AddAttendance /> },

      { path: "/display/edit_attendance/:id", element: <EditAttendance /> },

      { path: "/display/report", element: <Report /> },
      { path: "/display/add_request", element: <AddReport /> },
      { path: "/display/edit_request/:id", element: <EditReport /> },

      { path: "/display/fault_report", element: <FaultReport /> },

      { path: "/display/add_booking", element: <AddBooking /> },

      { path: "/display/edit_booking/:id", element: <EditBooking /> },

      { path: "/display/booking", element: <SpaceManagement /> },

      { path: "/display/iaq", element: <Iaq /> },
      { path: "/display/license", element: <License /> },
      { path: "/display/add_license", element: <AddLicense /> },
      { path: "/display/license_edit/:id", element: <EditLicense /> },

      { path: "/display/assign/:id", element: <Assign /> },
      { path: "/display/update/:id", element: <Update /> },
      { path: "/display/view_histroy/:id", element: <ViewHistory /> },

      { path: "/display/visitor", element: <VisitorManagement /> },

      { path: "/display/add_visitor", element: <AddInvitation /> },

      { path: "/display/visitor_edit/:id", element: <EditVisitor /> },

      { path: "/display/visitor_entry", element: <VisitorEntry /> },

      { path: "/display/add_visitorentry", element: <AddVisitorEntry /> },

      {
        path: "/display/schedule_maintenance",
        element: <BookScheduleMaintenance />,
      },

      { path: "/display/schedule", element: <Schedule /> },
      { path: "/display/schedule_edit/:id", element: <EditSchedule /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/", element: <Navigate to="/login" replace /> },
  { path:"/verify-2fa" ,element:<Verify2FA /> },
  {
    path: "/complete_permit_to_work/:email/:ptid/:token",
    element: <ChecklistForm />,
  },
  {
    path: "/request_change_permit_to_work/:email/:ptid/:appId/:token",
    element: <UpdateChecklistForm />,
  },
  { path: "/success", element: <SuccessFormSubmit /> },
]);

export default router;
