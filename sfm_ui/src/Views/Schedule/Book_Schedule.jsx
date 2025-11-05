import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/service";
import Layout from "../../components/molecules/Layout/Layout";

const AddSchedule = () => {
  const location = useLocation();
  const [schedule, setSchedule] = useState({
    zone: "",
    schoolName: "",
    startDate: location.state?.startDate || "",
    endDate: location.state?.endDate || "",
    team: "",
    priority: "",
    maintenanceType: "",
    remarks: "" || null,
  });

  const [zones, setZones] = useState([]);
  const [schools, setSchools] = useState([]);
  const navigate = useNavigate();

  // Fetch zones on component mount
  useEffect(() => {
    axiosInstance
      .get("/booking/get_zones")
      .then((result) => {
        setZones(result.data.zones || []);
      })
      .catch((err) => console.error("Error fetching zones:", err));
  }, []);

  // Fetch schools when zone changes
  useEffect(() => {
    if (schedule.zone) {
      axiosInstance
        .post("/booking/get_schools_by_zone", { zone: schedule.zone })
        .then((result) => {
          setSchools(result.data.schools || []);
          setSchedule((prev) => ({
            ...prev,
            schoolName: "",
          }));
        })
        .catch((err) => console.error("Error fetching schools:", err));
    } else {
      setSchools([]);
      setSchedule((prev) => ({
        ...prev,
        schoolName: "",
      }));
    }
  }, [schedule.zone]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { start, end } = schedule;

    // Create Date objects for start and end times
    const startDate = start;
    const endDate = end;

    // Get the current date and time
    const now = new Date();

    // Check if the schedule date is today or in the future
    if (startDate < now) {
      alert("Start date cannot be in the past.");
      return;
    }

    // Ensure the end time is after the start time
    if (endDate <= startDate) {
      alert("End date must be after the start Date.");
      return;
    }

    // Add Schedule
    axiosInstance
      .post("/schedule/add_schedule", schedule)
      .then((result) => {
        if (result.data.success) {
          navigate("/display/schedule");
        } else {
          alert(`Error: ${result.data.error || "Unknown error occurred"}`);
        }
      })
      .catch((err) => console.error("Error adding schedule:", err));
  };
  return (
    <>
      <Layout>
        <div id="page-wrapper">
          <div className="app-inner-layout app-inner-layout-page">
            <div className="app-inner-layout__wrapper">
              <div className="app-inner-layout__content pt-1">
                <div className="tab-content">
                  <div className="container-fluid">
                    <section className="content-header">
                      <h4 style={{ color: "black" }}>Schedule Maintenance</h4>
                    </section>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="main-card mb-3 card">
                          <div className="box-body">
                            <div className="dataTables_wrapper">
                              <div className="container">
                                <div className="row justify-content-center">
                                  <div className="col-md-9">
                                    <div className="p-3 rounded">
                                      <form
                                        className="row g-3"
                                        onSubmit={handleSubmit}
                                      >
                                        <div className="form-group">
                                          <label
                                            htmlFor="zone"
                                            className="form-label"
                                          >
                                            Zone
                                          </label>
                                          <select
                                            name="zone"
                                            id="zone"
                                            className="form-select"
                                            value={schedule.zone}
                                            onChange={(e) =>
                                              setSchedule({
                                                ...schedule,
                                                zone: e.target.value,
                                              })
                                            }
                                            required
                                          >
                                            <option value="" disabled>
                                              Choose Zone
                                            </option>
                                            {zones.length > 0 ? (
                                              zones.map((z, index) => (
                                                <option key={index} value={z}>
                                                  {z}
                                                </option>
                                              ))
                                            ) : (
                                              <option value="" disabled>
                                                No Data Available
                                              </option>
                                            )}
                                          </select>
                                        </div>
                                        <div className="form-group">
                                          <label
                                            htmlFor="schoolName"
                                            className="form-label"
                                          >
                                            School Name
                                          </label>
                                          <select
                                            name="schoolName"
                                            id="schoolName"
                                            className="form-select"
                                            value={schedule.schoolName}
                                            onChange={(e) =>
                                              setSchedule({
                                                ...schedule,
                                                schoolName: e.target.value,
                                              })
                                            }
                                            required
                                          >
                                            <option value="" disabled>
                                              Choose School
                                            </option>
                                            {schools.length > 0 ? (
                                              schools.map((school) => (
                                                <option
                                                  key={school.id}
                                                  value={school.school_name}
                                                >
                                                  {school.school_name}
                                                </option>
                                              ))
                                            ) : (
                                              <option value="" disabled>
                                                No Data Available
                                              </option>
                                            )}
                                          </select>
                                        </div>

                                        <div className="form-group">
                                          <label
                                            htmlFor="priority"
                                            className="form-label"
                                          >
                                            Priority
                                          </label>
                                          <select
                                            name="priority"
                                            id="priority"
                                            className="form-select"
                                            value={schedule.priority}
                                            onChange={(e) =>
                                              setSchedule({
                                                ...schedule,
                                                priority: e.target.value,
                                              })
                                            }
                                            required
                                          >
                                            <option disabled value="">
                                              Select Priority
                                            </option>
                                            <option value="low">Low</option>
                                            <option value="medium">
                                              Medium
                                            </option>
                                            <option value="high">High</option>
                                          </select>
                                        </div>

                                        <div className="form-group">
                                          <label
                                            htmlFor="priority"
                                            className="form-label"
                                          >
                                            Team
                                          </label>
                                          <select
                                            name="team"
                                            id="team"
                                            className="form-select"
                                            value={schedule.team}
                                            onChange={(e) =>
                                              setSchedule({
                                                ...schedule,
                                                team: e.target.value,
                                              })
                                            }
                                            required
                                          >
                                            <option disabled value="">
                                              Select Team
                                            </option>
                                            <option value="a">A</option>
                                            <option value="b">B</option>
                                            <option value="c">C</option>
                                          </select>
                                        </div>

                                        <div className="form-group">
                                          <label
                                            htmlFor="maintenanceType"
                                            className="form-label"
                                          >
                                            Type of Maintenance
                                          </label>
                                          <select
                                            name="maintenanceType"
                                            id="maintenanceType"
                                            className="form-select"
                                            value={schedule.maintenanceType}
                                            onChange={(e) =>
                                              setSchedule({
                                                ...schedule,
                                                maintenanceType: e.target.value,
                                              })
                                            }
                                            required
                                          >
                                            <option disabled value="">
                                              Select Type of Maintenance
                                            </option>
                                            <option value="electrical">
                                              Electrical
                                            </option>
                                            <option value="mechanical">
                                              Mechanical
                                            </option>
                                            <option value="plumber">
                                              Plumber
                                            </option>
                                            <option value="others">
                                              Others
                                            </option>
                                          </select>
                                        </div>

                                        <div className="form-group">
                                          <label
                                            htmlFor="startDate"
                                            className="form-label"
                                          >
                                            Start Date
                                          </label>
                                          <input
                                            type="text"
                                            id="startDate"
                                            name="startDate"
                                            className="form-control"
                                            value={schedule.startDate}
                                            readOnly
                                            onChange={(e) =>
                                              setSchedule({
                                                ...schedule,
                                                startDate: e.target.value,
                                              })
                                            }
                                            required
                                          />
                                        </div>
                                        <div className="form-group">
                                          <label
                                            htmlFor="endDate"
                                            className="form-label"
                                          >
                                            End Date
                                          </label>
                                          <input
                                            type="text"
                                            id="endDate"
                                            name="endDate"
                                            className="form-control"
                                            value={schedule.endDate}
                                            readOnly
                                            onChange={(e) =>
                                              setSchedule({
                                                ...schedule,
                                                endDate: e.target.value,
                                              })
                                            }
                                            required
                                          />
                                        </div>

                                        <div className="form-group">
                                          <label
                                            htmlFor="remarks"
                                            className="form-label search-label"
                                          >
                                            Remarks
                                          </label>
                                          <textarea
                                            id="remarks"
                                            name="remarks"
                                            className="form-control"
                                            value={schedule.remarks || ""}
                                            onChange={(e) =>
                                              setSchedule({
                                                ...schedule,
                                                remarks: e.target.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                          <button
                                            className="btn btn-success me-md-2"
                                            type="submit"
                                          >
                                            Submit
                                          </button>
                                          <button
                                            className="btn btn-danger"
                                            onClick={() => navigate(-1)}
                                            type="button"
                                          >
                                            Back
                                          </button>
                                        </div>
                                      </form>
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
      </Layout>
    </>
  );
};

export default AddSchedule;
