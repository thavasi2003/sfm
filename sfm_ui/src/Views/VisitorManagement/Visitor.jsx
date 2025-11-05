import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TiCancel } from "react-icons/ti";

import { HiPencilSquare } from "react-icons/hi2";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  // Fetch visitors data on component mount
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const result = await axiosInstance.get("/visitor/visitors");
        console.log(result.data); // Debugging: Verify server response structure

        if (result.data.Status) {
          const data = result.data.Result || [];
          setVisitors(data);
          setFilteredVisitors(data);
        } else {
          console.error(result.data.Error); // Log backend error for debugging
          alert(result.data.Error || "Failed to fetch visitors data.");
        }
      } catch (err) {
        console.error("Error fetching visitor data:", err);
        alert("Error fetching visitor data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this visitor?"
    );
    if (!isConfirmed) return;

    try {
      const result = await axiosInstance.delete(
        `/visitor/delete_visitor/${id}`
      );

      if (result.data.Status) {
        setVisitors((prev) => prev.filter((item) => item.id !== id));
        setFilteredVisitors((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error(result.data.Error); // Log the error from the server
        alert("Error: Unable to delete visitor data.");
      }
    } catch (err) {
      console.error("Error deleting visitor:", err);
      alert("Error deleting visitor. Please try again.");
    }
  };

  // Handle search input changes
  const handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    const filtered = visitors.filter(
      (e) =>
        e.visitor_name.toLowerCase().includes(searchText) ||
        e.requestor_name.toLowerCase().includes(searchText) ||
        e.visitor_email.toLowerCase().includes(searchText) ||
        (e.expected_arrival_time &&
          e.expected_arrival_time.toLowerCase().includes(searchText)) ||
        (e.actual_arrival_time &&
          e.actual_arrival_time.toLowerCase().includes(searchText))
    );
    setFilteredVisitors(filtered);
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
                    <h4 style={{ color: "black" }}>Visitor List</h4>
                  </section>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="main-card mb-3 card">
                        <div className="card-body">
                          <div className="box-header with-border">
                            <div className="box_add">
                              <button>
                                <Link
                                  to="/display/add_visitor"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  Add Visitor Invite
                                </Link>
                              </button>
                            </div>
                            <div className="input-search">
                              <input
                                type="search"
                                placeholder="Search"
                                onChange={handleSearchChange}
                              />
                            </div>
                          </div>
                          <div className="box-body">
                            <div className="dataTables_wrapper">
                              <table className="visitor_table">
                                <thead>
                                  <tr>
                                    <th>SI No</th>
                                    <th>Visitor Code</th>
                                    <th>Requestor Name</th>

                                    <th>Visitor Name</th>
                                    <th>Visitor Email</th>
                                    <th>Expected Arrival Time</th>
                                    <th>Created_at</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredVisitors.length === 0 ? (
                                    <tr>
                                      <td
                                        colSpan="8"
                                        style={{ textAlign: "center" }}
                                      >
                                        No Data Available
                                      </td>
                                    </tr>
                                  ) : (
                                    filteredVisitors.map((item, index) => (
                                      <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.visitor_code || "N/A"}</td>
                                        <td>{item.requestor_name}</td>

                                        <td>{item.visitor_name}</td>
                                        <td>{item.visitor_email}</td>
                                        <td>
                                          {item.expected_arrival_time
                                            ? new Date(
                                                item.expected_arrival_time
                                              ).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false, // Ensures 24-hour format
                                              })
                                            : ""}
                                        </td>

                                        <td>
                                          {item.expected_arrival_time
                                            ? new Date(
                                                item.created_at
                                              ).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                              })
                                            : ""}
                                        </td>

                                        <td>
                                          <Link
                                            onClick={() => {
                                              const isConfirmed =
                                                window.confirm(
                                                  "Are you sure you want to Edit?"
                                                );
                                              if (isConfirmed) {
                                                window.location.href = `/display/visitor_edit/${item.id}`;
                                                console.log(item.id);
                                              }
                                            }}
                                            title="Edit"
                                            className="btn btn-success btn-sm me-2"
                                          >
                                            <HiPencilSquare />
                                          </Link>
                                          <button
                                            title="Delete Visitor"
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                              handleDelete(item.id)
                                            }
                                          >
                                            <TiCancel />
                                          </button>
                                        </td>
                                      </tr>
                                    ))
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
  );
};

export default Visitors;
