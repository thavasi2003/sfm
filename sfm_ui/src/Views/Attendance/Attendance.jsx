import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import axiosInstance from "../../services/service";
import Layout from "../../components/molecules/Layout/Layout";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filterAttendance, setFilterAttendance] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get Attendance Table
    axiosInstance
      .get("/attendance/attendance")
      .then((response) => {
        const data = response.data.Data;
        setAttendanceData(data);
        setFilterAttendance(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Delete operation
  const handleDelete = (id) => {
    axiosInstance
      .delete(`/attendance/delete_attendance/${id}`)
      .then((result) => {
        if (result.data.Status) {
          // Remove the deleted item from state
          setAttendanceData((prevData) =>
            prevData.filter((item) => item.id !== id)
          );
          setFilterAttendance((prevData) =>
            prevData.filter((item) => item.id !== id)
          );
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error deleting attendance:", err);
        alert("Error deleting attendance. Please try again.");
      });
  };

  // Search function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredAttendance = attendanceData.filter(
      (e) =>
        e.zone.toLowerCase().includes(searchText) ||
        e.school.toLowerCase().includes(searchText) ||
        e.tech_name.toLowerCase().includes(searchText)
    );
    setFilterAttendance(filteredAttendance);
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
                      <h4 style={{ color: "black" }}>Attendance List</h4>
                    </section>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="main-card mb-3 card">
                          <div className="card-body">
                            <div className="box-header with-border">
                              <div className="box_add">
                                <button>
                                  <Link
                                    to="/display/add_attendance"
                                    style={{
                                      textDecoration: "none",
                                      color: "white",
                                    }}
                                  >
                                    New Attendance
                                  </Link>
                                </button>
                              </div>
                              <div className="input-search">
                                <input
                                  type="search"
                                  placeholder="Search ..."
                                  onChange={handleSearchChange}
                                />
                              </div>
                            </div>
                            <div className="box-body">
                              <div className="dataTables_wrapper">
                                <table className="meter_table">
                                  <thead>
                                    <tr>
                                      <th>Zone</th>
                                      <th>School</th>
                                      <th>Technician Name</th>
                                      <th>Date</th>
                                      <th>Check In</th>
                                      <th>Check Out</th>
                                      <th>Image</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filterAttendance.length ? (
                                      filterAttendance.map((attendance) => (
                                        <tr key={attendance.id}>
                                          <td>{attendance.zone}</td>
                                          <td>{attendance.school}</td>
                                          <td>{attendance.tech_name}</td>
                                          <td>
                                            {new Date(
                                              attendance.date
                                            ).toLocaleDateString("en-GB")}
                                          </td>
                                          <td>{attendance.checkin}</td>
                                          <td>{attendance.checkout}</td>
                                          <td>
                                            <img
                                              src={attendance.image}
                                              style={{
                                                width: "100px",
                                                height: "auto",
                                              }}
                                            />
                                          </td>
                                          <td>
                                            <button
                                              title="Edit"
                                              className="btn btn-success btn-sm me-2"
                                              onClick={() => {
                                                const isConfirmed =
                                                  window.confirm(
                                                    "Are you sure you want to Edit?"
                                                  );
                                                if (isConfirmed) {
                                                  navigate(
                                                    `/display/edit_attendance/${attendance.id}`
                                                  );
                                                }
                                              }}
                                            >
                                              <HiPencilSquare />
                                            </button>
                                            <button
                                              title="Delete"
                                              className="btn btn-danger btn-sm me-2"
                                              onClick={() => {
                                                const isConfirmed =
                                                  window.confirm(
                                                    "Are you sure you want to delete?"
                                                  );
                                                if (isConfirmed) {
                                                  handleDelete(attendance.id);
                                                }
                                              }}
                                            >
                                              <MdDelete />
                                            </button>
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="7">No data available</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
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

export default Attendance;
