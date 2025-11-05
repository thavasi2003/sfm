import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";
import { IoMdPeople } from "react-icons/io";
import { GrUpdate } from "react-icons/gr";
import { MdOutlineUpdate } from "react-icons/md";

const Licenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [filterLicenses, setFilterLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get License Data
    const fetchLicenses = async () => {
      try {
        const result = await axiosInstance.get("/license/licenses");
        if (result.data.Status) {
          const data = result.data.Result || [];
          setLicenses(data);
          setFilterLicenses(data);
        } else {
          alert(result.data.Error);
        }
      } catch (err) {
        console.error("Error fetching license data:", err);
        alert("Error fetching license data. Please try again.");
        setFilterLicenses([]); // Reset to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  // Delete Operation
  const handleDelete = async (id) => {
    try {
      const result = await axiosInstance.delete(
        "/license/delete_license/" + id
      );
      if (result.data.Status) {
        setLicenses((prev) => prev.filter((item) => item.id !== id));
        setFilterLicenses((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("You can't delete anything with the Reading table.");
      }
    } catch (err) {
      console.error("Error deleting license:", err);
      alert("Error deleting license. Please try again.");
    }
  };

  const handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredLicenses = licenses.filter(
      (e) =>
        e.description.toLowerCase().includes(searchText) ||
        e.license_number.toLowerCase().includes(searchText) ||
        e.linked_to.toLowerCase().includes(searchText) ||
        e.assigned_to.toLowerCase().includes(searchText) ||
        e.renewal_status.toLowerCase().includes(searchText) ||
        e.renewal_date.toLowerCase().includes(searchText) ||
        e.reminder.toLowerCase().includes(searchText)
    );
    setFilterLicenses(filteredLicenses);
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
                    <h4 style={{ color: "black" }}>License List</h4>
                  </section>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="main-card mb-3 card">
                        <div className="card-body">
                          <div className="box-header with-border">
                            <div className="box_add">
                              <button>
                                <Link
                                  to="/display/add_license"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  Add License
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
                              <table className="meter_table">
                                <thead>
                                  <tr>
                                    <th>SI No</th>
                                    <th>Description</th>
                                    <th>License Number</th>
                                    <th>Linked To</th>
                                    <th>Assigned To</th>
                                    <th> Renewal Status</th>
                                    <th>Renewal Date</th>
                                    <th> Action</th>
                                    {/* <th>Remainder</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {loading ? (
                                    <tr>
                                      <td
                                        colSpan="8"
                                        style={{ textAlign: "center" }}
                                      >
                                        Loading...
                                      </td>
                                    </tr>
                                  ) : filterLicenses.length === 0 ? (
                                    <tr>
                                      <td
                                        colSpan="8"
                                        style={{ textAlign: "center" }}
                                      >
                                        No Data Available
                                      </td>
                                    </tr>
                                  ) : (
                                    filterLicenses.map((item, index) => (
                                      <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.description}</td>
                                        <td>{item.license_number}</td>
                                        <td>{item.linked_to}</td>
                                        <td>{item.assigned_to}</td>
                                        <td>{item.renewal_status}</td>
                                        <td>
                                          {item.renewal_date
                                            ? new Date(
                                                item.renewal_date
                                              ).toLocaleDateString("en-GB")
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
                                                window.location.href = `/display/license_edit/${item.id}`;
                                              }
                                            }}
                                            title="Edit"
                                            className="btn btn-success btn-sm me-2"
                                          >
                                            <HiPencilSquare />
                                          </Link>
                                          <button
                                            title="Delete"
                                            className="btn btn-danger btn-sm me-2"
                                            onClick={() => {
                                              const isConfirmed =
                                                window.confirm(
                                                  "Are you sure you want to delete?"
                                                );
                                              if (isConfirmed) {
                                                handleDelete(item.id);
                                              }
                                            }}
                                          >
                                            <MdDelete />
                                          </button>

                                          <Link
                                            title="AssignTo"
                                            className="btn btn-primary btn-sm me-2"
                                            to={`/display/assign/${item.id}`}
                                          >
                                            <IoMdPeople />
                                          </Link>

                                          <Link
                                            title="updateStatus"
                                            className="btn btn-light btn-sm me-2"
                                            to={`/display/update/${item.id}`}
                                          >
                                            <GrUpdate />
                                          </Link>

                                          <Link
                                            title="View History"
                                            className="btn btn-success btn-sm me-2"
                                            to={`/display/view_histroy/${item.id}`}
                                          >
                                            <MdOutlineUpdate />
                                          </Link>
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

export default Licenses;
