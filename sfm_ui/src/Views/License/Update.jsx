import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";

const Update = () => {
  const { id } = useParams(); // Get license ID from URL parameters
  const navigate = useNavigate();

  // State to hold license form data
  const [license, setLicense] = useState({
    status: "",
    remarks: "",
  });

  // State for managing the history view
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLicense((prevLicense) => ({
      ...prevLicense,
      [name]: value, // Update state dynamically based on field name
    }));
  };

  // Fetch license data when the component mounts
  useEffect(() => {
    axiosInstance
      .get(`/license/license/${id}`)
      .then((result) => {
        const fetchedLicense = result.data.Result[0];
        setLicense({
          status: fetchedLicense.renewal_status || "",
          remarks: fetchedLicense.remarks || "",
        });
      })
      .catch((err) => console.error("Error fetching license:", err));
  }, [id]);

  // Handle form submission to update license data
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that a status is selected before submission
    if (!license.status) {
      alert("Please select a status before submitting.");
      return;
    }

    // Send updated license data to API
    axiosInstance
      .put(`/license/update_license/${id}`, {
        renewal_status: license.status,
        remarks: license.remarks,
      })
      .then((response) => {
        console.error("Response received from server:", response);

        if (response?.data?.Status) {
          navigate("/display/license");
        } else {
          alert(`Error: ${response?.data?.Error}`);
        }
      })
      .catch((err) => {
        console.error("Error updating license:", err);
        alert("Error updating license. Please try again.");
      });
  };

  // Fetch history data when the "View History" button is clicked
  const fetchHistory = () => {
    axiosInstance
      .get(`/license/history/${id}`) // Call API to get history for the license ID
      .then((result) => {
        setHistoryData(result.data.Result || []); // Update history data state
        setHistoryVisible(true); // Show the history data section
      })
      .catch((err) => console.error("Error fetching history:", err));
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
                        <div className="box-body">
                          <div className="dataTables_wrapper">
                            <div className="container">
                              <div className="row justify-content-center">
                                <div className="col-md-9">
                                  <div className="p-3 rounded">
                                    <h3 className="text-secondary text-center">
                                      Update License Status
                                    </h3>
                                    <form
                                      className="row g-3"
                                      onSubmit={handleSubmit}
                                    >
                                      <div className="col-12">
                                        <label
                                          htmlFor="update_status"
                                          className="form-label search-label"
                                        >
                                          Status:
                                        </label>
                                        <select
                                          className="form-control"
                                          id="update_status"
                                          name="status"
                                          value={license.status}
                                          onChange={handleChange}
                                          required
                                        >
                                          <option value="" disabled>
                                            Please select status
                                          </option>
                                          <option value="Pending">
                                            Pending
                                          </option>
                                          <option value="Processing">
                                            Processing
                                          </option>
                                          <option value="Completed">
                                            Completed
                                          </option>
                                          <option value="Cancelled">
                                            Cancelled
                                          </option>
                                        </select>
                                      </div>

                                      <div className="col-12">
                                        <label
                                          htmlFor="remarks"
                                          className="form-label search-label"
                                        >
                                          Remarks:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="remarks"
                                          name="remarks"
                                          placeholder="Remarks"
                                          value={license.remarks}
                                          onChange={handleChange}
                                          required
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
                                          Cancel
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

export default Update;
