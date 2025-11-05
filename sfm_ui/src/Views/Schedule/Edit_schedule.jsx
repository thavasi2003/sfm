import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/service";
import Layout from "../../components/molecules/Layout/Layout";

const Edit_Schedule = () => {
  const { id } = useParams();
  const [schedule, setSchedule] = useState({
    zone: "",
    schoolName: "",
    team: "",
    maintenanceType: "",
    priority: "",
    dateStart: "",
    dateEnd: "",
    remarks: "",
  });

  const navigate = useNavigate();

  // Fetch schedule details when component mounts
  useEffect(() => {
    axiosInstance
      .get(`/schedule/get_schedule/${id}`)
      .then((result) => {
        const fetchedSchedule = result.data.Result[0];
        setSchedule({
          zone: fetchedSchedule.zone,
          schoolName: fetchedSchedule.schoolName,
          team: fetchedSchedule.team,
          maintenanceType: fetchedSchedule.maintenanceType,
          priority: fetchedSchedule.priority,
          dateStart: fetchedSchedule.dateStart
            ? dayjs(fetchedSchedule.dateStart).format("YYYY-MM-DD")
            : "",
          dateEnd: fetchedSchedule.dateEnd
            ? dayjs(fetchedSchedule.dateEnd).format("YYYY-MM-DD")
            : "",
          remarks: fetchedSchedule.remarks,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const { dateStart, dateEnd } = schedule;

    // Create Date objects for start and end dates
    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    // Get the current date
    const now = new Date();

    // Check if the start date is today or in the future
    if (start < now) {
      alert("Start date cannot be in the past.");
      return;
    }

    // Check if the end date is after the start date
    if (end <= start) {
      alert("End date must be after the start date.");
      return;
    }

    // Update schedule
    axiosInstance
      .put(`/schedule/edit_schedule/${id}`, schedule)
      .then((result) => {
        if (result.data.Status) {
          navigate("/display/schedule");
          setTimeout(() => {
            alert("Updated Successfully");
          }, 300);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Layout>
      <div id="page-wrapper">
        <div className="app-inner-layout app-inner-layout-page">
          <div className="app-inner-layout__wrapper">
            <div className="app-inner-layout__content pt-1">
              <div className="tab-content">
                <div className="container-fluid">
                  <section className="content-header">
                    <h4 style={{ color: "black" }}>Edit Schedule</h4>
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
                                    <h3 className="text-secondary text-center">
                                      Edit Schedule
                                    </h3>
                                    <form
                                      onSubmit={handleSubmit}
                                      className="row g-3"
                                    >
                                      <div className="form-group">
                                        <label
                                          htmlFor="zone"
                                          className="form-label"
                                        >
                                          Zone
                                        </label>
                                        <input
                                          type="text"
                                          id="zone"
                                          name="zone"
                                          className="form-control"
                                          value={schedule.zone}
                                          onChange={(e) =>
                                            setSchedule({
                                              ...schedule,
                                              zone: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label
                                          htmlFor="schoolName"
                                          className="form-label"
                                        >
                                          School Name
                                        </label>
                                        <input
                                          type="text"
                                          id="schoolName"
                                          name="schoolName"
                                          className="form-control"
                                          value={schedule.schoolName}
                                          onChange={(e) =>
                                            setSchedule({
                                              ...schedule,
                                              schoolName: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label
                                          htmlFor="team"
                                          className="form-label"
                                        >
                                          Team
                                        </label>
                                        <input
                                          type="text"
                                          id="team"
                                          name="team"
                                          className="form-control"
                                          value={schedule.team}
                                          onChange={(e) =>
                                            setSchedule({
                                              ...schedule,
                                              team: e.target.value,
                                            })
                                          }
                                        />
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
                                          <option value="others">Others</option>
                                        </select>
                                      </div>
                                      <div className="form-group">
                                        <label
                                          htmlFor="priority"
                                          className="form-label"
                                        >
                                          Priority
                                        </label>
                                        <input
                                          type="text"
                                          id="priority"
                                          name="priority"
                                          className="form-control"
                                          value={schedule.priority}
                                          onChange={(e) =>
                                            setSchedule({
                                              ...schedule,
                                              priority: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      {/* <div className="form-group">
                                        <label htmlFor="dateStart" className="form-label">Start Date</label>
                                        <input
                                          type="date"
                                          id="dateStart"
                                          name="dateStart"
                                          className="form-control"
                                          value={schedule.dateStart ? dayjs(schedule.dateStart).format('YYYY-MM-DD') : ''}
                                          onChange={(e) => setSchedule({ ...schedule, dateStart: e.target.value })}
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor="dateEnd" className="form-label">End Date</label>
                                        <input
                                          type="date"
                                          id="dateEnd"
                                          name="dateEnd"
                                          className="form-control"
                                          value={schedule.dateEnd ? dayjs(schedule.dateEnd).format('YYYY-MM-DD') : ''}
                                          onChange={(e) => setSchedule({ ...schedule, dateEnd: e.target.value })}
                                        />
                                      </div> */}
                                      <div className="form-group">
                                        <label
                                          htmlFor="reschedulestart"
                                          className="form-label"
                                        >
                                          ReSchedule StartDate (optional)
                                        </label>
                                        <input
                                          type="date"
                                          id="reschedulestart"
                                          name="reschedulestart"
                                          className="form-control"
                                          value={
                                            schedule.reschedulestart
                                              ? dayjs(
                                                  schedule.reschedulestart
                                                ).format("YYYY-MM-DD")
                                              : ""
                                          }
                                          onChange={(e) =>
                                            setSchedule({
                                              ...schedule,
                                              reschedulestart: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label
                                          htmlFor="rescheduleend"
                                          className="form-label"
                                        >
                                          ReSchedule EndDate (optional)
                                        </label>
                                        <input
                                          type="date"
                                          id="rescheduleend"
                                          name="rescheduleend"
                                          className="form-control"
                                          value={
                                            schedule.rescheduleend
                                              ? dayjs(
                                                  schedule.rescheduleend
                                                ).format("YYYY-MM-DD")
                                              : ""
                                          }
                                          onChange={(e) =>
                                            setSchedule({
                                              ...schedule,
                                              rescheduleend: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label
                                          htmlFor="remarks"
                                          className="form-label"
                                        >
                                          Remarks
                                        </label>
                                        <textarea
                                          id="remarks"
                                          name="remarks"
                                          className="form-control"
                                          value={schedule.remarks}
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
                                          Update
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
  );
};

export default Edit_Schedule;
