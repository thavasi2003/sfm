import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";

const AddLicense = () => {
  const [license, setLicense] = useState({
    description: "",
    license_number: "",
    linked_to: "",
    assigned_to: "",
    renewal_date: "", // Default empty string
    reminder: "", // Only one field for reminder
    email: "",
    reminder_days: "",
  });

  const [showRemainder, setShowRemainder] = useState(false);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLicense((prevLicense) => ({
      ...prevLicense,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post("/license/add_license", license) // Adjust the endpoint for adding licenses
      .then((response) => {
        if (response?.data?.Status) {
          navigate("/display/license");
        } else {
          alert(`Error: ${response?.data?.Error}`);
        }
      })
      .catch((err) => {
        console.error("Error adding license:", err);
        alert("Error adding license. Please try again.");
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
                                      Add License
                                    </h3>
                                    <form
                                      className="row g-3"
                                      onSubmit={handleSubmit}
                                    >
                                      <div className="col-12">
                                        <label
                                          htmlFor="description"
                                          className="form-label"
                                        >
                                          Description:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="description"
                                          name="description"
                                          required
                                          placeholder="Enter description"
                                          value={license.description}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label
                                          htmlFor="license_number"
                                          className="form-label"
                                        >
                                          License Number:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="license_number"
                                          name="license_number"
                                          required
                                          placeholder="Enter license number"
                                          value={license.license_number}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label
                                          htmlFor="linked_to"
                                          className="form-label search-label"
                                        >
                                          Linked To:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control "
                                          id="linked_to"
                                          name="linked_to"
                                          placeholder="Linked to"
                                          value={license.linked_to}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      {/* <div className="col-12">
                                        <label htmlFor="assigned_to" className="form-label search-label">
                                          Assigned To:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control "
                                          id="assigned_to"
                                          name="assigned_to"
                                          placeholder="Assigned to"
                                          value={license.assigned_to}
                                          onChange={handleChange}
                                        />
                                      </div> */}

                                      <div className="col-12 form-check form-switch">
                                        <label
                                          className="form-check-label search-label"
                                          htmlFor="flexSwitchCheckDefault"
                                        >
                                          Enable Renewal Reminder{" "}
                                          <span className="text-secondary">
                                            (optional)
                                          </span>
                                        </label>
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          role="switch"
                                          id="flexSwitchCheckDefault"
                                          onChange={(e) =>
                                            setShowRemainder(e.target.checked)
                                          }
                                        />
                                      </div>

                                      {showRemainder && (
                                        <>
                                          <div className="col-12">
                                            <label
                                              htmlFor="renewal_date"
                                              className="form-label"
                                            >
                                              Renewal Date:
                                            </label>
                                            <input
                                              type="date"
                                              className="form-control"
                                              id="renewal_date"
                                              name="renewal_date"
                                              required
                                              value={license.renewal_date}
                                              onChange={handleChange}
                                            />
                                          </div>

                                          <div className="col-12">
                                            <label
                                              htmlFor="reminder"
                                              className="form-label"
                                            >
                                              Reminder:
                                            </label>
                                            <input
                                              type="text"
                                              required
                                              className="form-control"
                                              id="reminder"
                                              name="reminder"
                                              placeholder="Enter reminder message"
                                              value={license.reminder}
                                              onChange={handleChange}
                                            />
                                          </div>

                                          <div className="col-12">
                                            <label
                                              htmlFor="email"
                                              className="form-label"
                                            >
                                              Email:
                                            </label>
                                            <input
                                              type="email"
                                              required
                                              className="form-control"
                                              id="email"
                                              name="email"
                                              placeholder="Enter email for reminders"
                                              value={license.email}
                                              onChange={handleChange}
                                            />
                                          </div>

                                          <div className="col-12">
                                            <label
                                              htmlFor="reminder_days"
                                              className="form-label"
                                            >
                                              Reminder Days:
                                            </label>
                                            <input
                                              type="number"
                                              required
                                              className="form-control"
                                              id="reminder_days"
                                              name="reminder_days"
                                              placeholder="Enter number of days before reminder"
                                              value={license.reminder_days}
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </>
                                      )}

                                      <div className="col-12">
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                          <button
                                            className="btn btn-success me-md-2"
                                            type="submit"
                                          >
                                            Save
                                          </button>
                                          <button
                                            className="btn btn-danger"
                                            onClick={() => navigate(-1)}
                                            type="button"
                                          >
                                            Back
                                          </button>
                                        </div>
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

export default AddLicense;
