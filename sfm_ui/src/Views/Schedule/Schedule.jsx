import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../services/service";
import {
  DayPilot,
  DayPilotMonth,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { MdDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import "./Schedules.css";
import Layout from "../../components/molecules/Layout/Layout";

const Calendar = () => {
  const navigate = useNavigate();
  const [scheduleData,setscheduleData]= useState([]);
  const [filterschedule,setfliterschedule]=useState([]);
  const [view, setView] = useState("Week");
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [events, setEvents] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch schedules from the API
  const fetchSchedules = async () => {
    try {
      const response = await axios.get("/schedule/get_schedule");

      // Ensure the response has the expected structure
      if (
        response.data &&
        response.data.Status &&
        Array.isArray(response.data.data)
      ) {
        const mappedEvents = response.data.data
          .map(
            ({
              id,
              zone,
              schoolName,
              team,
              maintenanceType,
              dateStart,
              dateEnd,
            }) => {
              // Ensure both dateStart and dateEnd are valid dates
              const start = new DayPilot.Date(dateStart);
              const end = new DayPilot.Date(dateEnd);

              // Check if the start and end dates are valid          

              if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                const now = new DayPilot.Date(); // Use DayPilot.Date for consistent date handling
              
                // Check if the event has passed (end date is before the current date)
                const isPast = end < now;
              
                // Set the bar color based on the date status
                const barColor = isPast ? "#FF6F61" : "#4CAF50"; // Red for past, Green for upcoming
              
                return {
                  id,
                  text: `${zone} (${schoolName})`,
                  start: new DayPilot.Date(start), // Convert start to DayPilot Date
                  end: new DayPilot.Date(end), // Convert end to DayPilot Date
                  barColor, // Apply the calculated color
                };
              }
              
              return null; // Return null for invalid dates
            }
          )
          .filter(Boolean); // Remove null events

        setEvents(mappedEvents);
      } else {
        console.error("Invalid response format: Missing 'data' or 'Status'");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Check if a selected date is in the past
  const isDateInPast = (start, end) => {
    const now = new Date();
    return start < now || end < now;
  };

  // Handle date range selection in the calendar
  const onDateRangeSelected = (args) => {
    const start = args.start.toDate(); // Convert to JavaScript Date object
    const end = args.end.toDate(); // Convert to JavaScript Date object

    const formattedStartDate = args.start.toString("yyyy-MM-dd"); // Local time format
    const formattedEndDate = args.end.addDays(-1).toString("yyyy-MM-dd"); // Adjust end date

    if (isDateInPast(start, end)) {
      setErrorMessage(
        "The selected Date slot is in the past. Please choose a future date."
      );
      setShowModal(true);
      args.control.clearSelection();
      return;
    }

    const isOverlap = events.some(
      (event) => event.start.toDate() < end && event.end.toDate() > start
    );

    if (isOverlap) {
      setErrorMessage(
        "This date slot is already booked. Please choose another date."
      );
      setShowModal(true);
    } else {
      setSelectedDateRange({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
      setErrorMessage("");
      setShowModal(true);
    }

    args.control.clearSelection();
  };

  // Handle event click (view event details)
  const onEventClick = async (args) => {
    const event = args.e.data; // Access the event's data field
    const id = event.id; // Get the event ID from the data

    try {
      const response = await axios.get(`/schedule/get_schedule/${id}`);
      console.log("Event Details Response:", response);

      if (
        response.data &&
        response.data.Result &&
        response.data.Result.length > 0
      ) {
        const eventDetails = response.data.Result[0];

        setSelectedEvent({
          id: eventDetails.id || "N/A",
          zone: eventDetails.zone || "N/A",
          schoolName: eventDetails.schoolName || "N/A",
          team: eventDetails.team || "N/A",
          type_of_maintenance: eventDetails.maintenanceType || "N/A",
          priority: eventDetails.priority || "N/A",
          startDate: eventDetails.dateStart || "N/A",
          endDate: eventDetails.dateEnd || "N/A",
          reschedulestart: eventDetails.reschedulestart || "N/A",
          rescheduleend: eventDetails.rescheduleend || "N/A",
        });

        setShowModal(true); // Show modal with event details
      } else {
        console.error("No event details found in the response:", response.data);
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
    }
  };

  // Confirm booking
  const confirmBooking = () => {
    if (selectedDateRange) {
      navigate("/display/schedule_maintenance", {
        state: selectedDateRange,
      });
      setSelectedDateRange(null);
    }
    setShowModal(false);
  };

  // Handle event deletion
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/schedule/delete_schedule/${id}`);
      if (response.data.Status) {
        setEvents(events.filter((event) => event.id !== id));
        setShowModal(false);
      } else {
        alert("Failed to delete booking");
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  // Cancel the modal
  const cancelBooking = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  // Prevent event move (disable dragging)
  const onEventMove = (args) => {
    args.preventDefault(); // Disable move
  };

  // Format the date to a more readable format
  const formatDate = (date) => {
    const parsedDate = new Date(date);

    // Check if the date is valid
    if (isNaN(parsedDate)) {
      return "Invalid Date"; // Return a placeholder if the date is invalid
    }

    // Format the date as DD/MM/YYYY
    return parsedDate.toLocaleDateString("en-GB"); // 'en-GB' ensures DD/MM/YYYY format
  };


  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredscheduledule=scheduleData.filter((e) =>
      // e.zone.toLowerCase().includes(searchText) ||
      e.school.toLowerCase().includes(searchText) ||
      e.tech_name.toLowerCase().includes(searchText)
    );
    setfliterschedule(filteredscheduledule);
  };

  return (
    <>
      <Layout>
        <div id="page-wrapper">
          <div className="app-inner-layout app-inner-layout-page">
            <div className="app-inner-layout__wrapper">
              <div className="app-inner-layout__content">
                <div className="tab-content">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="main-card mb-3 card">
                          <div className="box-body">
                            <div className="dataTables_wrapper">
                              <div className="container">
                                <div className="row justify-content-center">
                                  <div className="container">
                                    <div className="navigator">
                                      <DayPilotNavigator
                                        showMonths={2}
                                        skipMonths={2}
                                        onTimeRangeSelected={(args) =>
                                          setStartDate(args.day)
                                        }
                                        events={events}
                                      />
                                    </div>
                                    <div className="contents">
                                      <div className="toolbar">
                                        <div className="toolbar-group">
                                          <button
                                            onClick={() => setView("Week")}
                                            className={
                                              view === "Week" ? "selected" : ""
                                            }
                                          >
                                            Week
                                          </button>
                                          <button
                                            onClick={() => setView("Month")}
                                            className={
                                              view === "Month" ? "selected" : ""
                                            }
                                          >
                                            Month
                                          </button>
                                        </div>

                                        
                                      </div>
                                      
                                      <div className="input-search">
                                <input
                                  type="search"
                                  placeholder="Search ..."
                                  onChange={handleSearchChange}
                                />
                              </div>
                                      <div
                                        style={{
                                          width: "984px",
                                          paddingBottom: "15px",
                                        }}
                                      >
                                        {view === "Week" && (
                                          <DayPilotCalendar
                                            viewType="Week"
                                            startDate={startDate}
                                            events={events}
                                            businessBeginsHour={8}
                                            businessEndsHour={18}
                                            timeRangeSelectedHandling="Enabled"
                                            // onTimeRangeSelected={
                                            //   onTimeRangeSelected
                                            // }
                                            onEventClick={onEventClick} // Handle event click
                                            onEventMove={onEventMove} // Disable dragging
                                            durationBarVisible={false}
                                          />
                                        )}

                                        <DayPilotMonth
                                          startDate={startDate}
                                          events={events}
                                          onEventMove={onEventMove} // Disable dragging
                                          onEventClick={onEventClick} // Handle event click
                                          onTimeRangeSelected={
                                            onDateRangeSelected
                                          } // Enable date selection
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for booking details */}
        <div
          className={`modal fade ${showModal ? "show d-block" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{selectedEvent ? "Event Details" : "Confirm Schedule"}</h3>
                {selectedEvent && (
                  <>
                    <Link
                      to={`/display/schedule_edit/${selectedEvent.id}`}
                      title="Edit"
                      style={{
                        borderRadius: "50%",
                        background: "#d9dedb",
                        font: "caption",
                        position: "absolute",
                        right: "94px",
                        top: "42px",
                        padding: "5px",
                      }}
                    >
                      <HiPencilSquare />
                    </Link>
                    <button
                      title="Delete Booking"
                      className="btn btn-sm btn-circle"
                      onClick={() => handleDelete(selectedEvent.id)}
                      style={{
                        borderRadius: "50%",
                        background: "#d9dedb",
                        font: "caption",
                        position: "absolute",
                        right: "60px",
                        top: "41px",
                        padding: "5px",
                      }}
                    >
                      <MdDelete />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelBooking}
                ></button>
              </div>
              <div className="modal-body">
                {selectedEvent ? (
                  <div>
                    <p>
                      <strong>Zone Name:</strong> {selectedEvent.zone}
                    </p>
                    <p>
                      <strong>School Name:</strong> {selectedEvent.schoolName}
                    </p>
                    <p>
                      <strong>Team:</strong> {selectedEvent.team}
                    </p>
                    <p>
                      <strong>Type of Maintenance:</strong>{" "}
                      {selectedEvent.type_of_maintenance}
                    </p>
                    <p>
                      <strong>Priority:</strong> {selectedEvent.priority}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {formatDate(selectedEvent.startDate)}
                    </p>
                    <p>
                      <strong>End Date:</strong>{" "}
                      {formatDate(selectedEvent.endDate)}
                    </p>
                    <p>
                      <strong>RescheduleStartDate:</strong>{" "}
                      {formatDate(selectedEvent.reschedulestart)}
                    </p>
                    <p>
                      <strong>RescheduleEndDate:</strong>{" "}
                      {formatDate(selectedEvent.rescheduleend)}
                    </p>
                  </div>
                ) : (
                  <p>
                    {errorMessage || (
                      <>
                        Start Date: {formatDate(selectedDateRange?.startDate)}{" "}
                        <br />
                        End Date: {formatDate(selectedDateRange?.endDate)}
                      </>
                    )}
                  </p>
                )}
              </div>

              {!errorMessage && !selectedEvent && (
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={confirmBooking}
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Calendar;
