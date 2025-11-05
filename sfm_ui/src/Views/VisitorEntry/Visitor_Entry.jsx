import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";
import dayjs from "dayjs";

const VisitorEntry = () => {
  const [visitorEntry, setVisitorEntry] = useState([]);
  const [filterVisitorEntry, setFilterVisitorEntry] = useState([]);

  useEffect(() => {
    // Get Visitor Entry Table
    axiosInstance
      .get("/entry/get_all_visitors")
      .then((result) => {
        if (result.data.Status) {
          setVisitorEntry(result.data.Result);
          setFilterVisitorEntry(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error fetching visitor entry data:", err);
        alert("Error fetching visitor entry data. Please try again.");
      });
  }, []);

  // Search function
  const handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredEntries = visitorEntry.filter(
      (entry) =>
        entry.visitor_code.toLowerCase().includes(searchText) ||
        entry.visitor_name.toLowerCase().includes(searchText) ||
        entry.from_organization.toLowerCase().includes(searchText)
    );
    setFilterVisitorEntry(filteredEntries);
  };

  // Check Out function
  const handleCheckOut = (id) => {
    const checkOutTime = dayjs().format("YYYY-MM-DD HH:mm:ss"); // Format to MySQL datetime

    // Update check_out field in the database
    axiosInstance
      .put(`/entry/check_out/${id}`, { check_out: checkOutTime })
      .then((response) => {
        if (response.data.Status) {
          // Update the local state to reflect the check out
          setVisitorEntry((prevEntries) =>
            prevEntries.map((entry) =>
              entry.id === id ? { ...entry, check_out: checkOutTime } : entry
            )
          );
          setFilterVisitorEntry((prevEntries) =>
            prevEntries.map((entry) =>
              entry.id === id ? { ...entry, check_out: checkOutTime } : entry
            )
          );
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error checking out visitor:", err);
        alert("Error checking out visitor. Please try again.");
      });
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
                    <h4 style={{ color: "black" }}>Visitor Entry List</h4>
                  </section>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="main-card mb-3 card">
                        <div className="card-body">
                          <div className="box-header with-border">
                            <div className="box_add">
                              <button>
                                <Link
                                  to="/display/add_visitorentry"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  {" "}
                                  Add Visitor Entry
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
                              <table className="visitorentry_table">
                                <thead>
                                  <tr>
                                    <th>SI No</th>
                                    <th>Date</th>
                                    <th>Expected Date</th>
                                    <th>Visitor Code</th>
                                    <th>Visitor Name</th>
                                    <th>From</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Image</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filterVisitorEntry.map((entry, index) => (
                                    <tr key={entry.id}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {new Date(
                                          entry.created_at
                                        ).toLocaleDateString("en-GB")}
                                      </td>
                                      <td>
                                        {entry.expected_arrival_time
                                          ? new Date(
                                              entry.expected_arrival_time
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
                                      <td>{entry.visitor_code}</td>
                                      <td>{entry.visitor_name}</td>
                                      <td>{entry.from_organization}</td>
                                      <td>
                                        {entry.check_in
                                          ? new Date(
                                              entry.check_in
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
                                        {entry.check_out ? (
                                          new Date(
                                            entry.check_out
                                          ).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false, // Ensures 24-hour format
                                          })
                                        ) : (
                                          <button
                                            onClick={() =>
                                              handleCheckOut(entry.id)
                                            }
                                            style={{
                                              color: "blue",
                                              background: "yellow",
                                            }}
                                          >
                                            Check Out
                                          </button>
                                        )}
                                      </td>

                                      <td>
                                        <img
                                          src={entry.image}
                                          style={{
                                            width: "100px",
                                            height: "auto",
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  ))}
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

export default VisitorEntry;
