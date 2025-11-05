import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";

const AddInvitation = () => {
  const [invitation, setInvitation] = useState({
    requestor_name: "",
    invitation_created_at: "" || new Date().toISOString(),
    visitor_name: "",
    visitor_email: "",
    expected_arrival_time: "",
    requestor: "",
    visiting_purpose: "",
  });

  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvitation((prevInvitation) => ({
      ...prevInvitation,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Data being sent to the server:", invitation); // Debug log for invitation data

    axiosInstance
      .post("/visitor/add_visitor", invitation)
      .then((response) => {
        console.log("Response received from server:", response);

        if (response?.data?.Status) {
          navigate("/display/visitor");
        } else {
          alert(`Error: ${response?.data?.Error}`);
        }
      })
      .catch((err) => {
        console.error("Error adding visitor", err);
        alert("Error adding visitor. Please try again.");
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
                    <h4 style={{ color: "black" }}>Invitation List</h4>
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
                                      Add Invitation
                                    </h3>
                                    <form
                                      className="row g-3"
                                      onSubmit={handleSubmit}
                                    >
                                      {/* Visitor Name Field */}
                                      <div className="col-12">
                                        <label
                                          htmlFor="visitor_name"
                                          className="form-label"
                                        >
                                          visitor Name:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="visitor_name"
                                          name="visitor_name"
                                          required
                                          placeholder="Enter visitor's name"
                                          value={invitation.visitor_name}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      {/* Visitor Email Field */}
                                      <div className="col-12">
                                        <label
                                          htmlFor="visitor_email"
                                          className="form-label"
                                        >
                                          Visitor Email:
                                        </label>
                                        <input
                                          type="email"
                                          className="form-control"
                                          id="visitor_email"
                                          name="visitor_email"
                                          required
                                          placeholder="Enter visitor's email"
                                          value={invitation.visitor_email}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      {/* Expected Arrival Time Field */}
                                      <div className="col-12">
                                        <label
                                          htmlFor="expected_arrival_time"
                                          className="form-label"
                                        >
                                          Expected Arrival Time:
                                        </label>
                                        <input
                                          type="datetime-local"
                                          className="form-control"
                                          id="expected_arrival_time"
                                          name="expected_arrival_time"
                                          required
                                          value={
                                            invitation.expected_arrival_time
                                          }
                                          onChange={handleChange}
                                        />
                                      </div>

                                      {/* Requestor Field */}
                                      <div className="col-12">
                                        <label
                                          htmlFor="requestor"
                                          className="form-label"
                                        >
                                          Requestor:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="requestor"
                                          name="requestor"
                                          required
                                          placeholder="Enter requestor"
                                          value={invitation.requestor}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      {/* Requestor Name Field */}
                                      <div className="col-12">
                                        <label
                                          htmlFor="requestor_name"
                                          className="form-label"
                                        >
                                          Requestor Name:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="requestor_name"
                                          name="requestor_name"
                                          required
                                          placeholder="Enter requestor's name"
                                          value={invitation.requestor_name}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label
                                          htmlFor="visiting_purpose"
                                          className="form-label"
                                        >
                                          Visiting Purpose:
                                        </label>
                                        <select
                                          className="form-control"
                                          id="visiting_purpose"
                                          name="visiting_purpose"
                                          required
                                          value={invitation.visiting_purpose}
                                          onChange={handleChange}
                                        >
                                          <option value="">
                                            Select purpose
                                          </option>
                                          <option value="Meeting">
                                            Meeting
                                          </option>
                                          <option value="Maintenance">
                                            Maintenance
                                          </option>
                                          <option value="Service Request">
                                            Service Request
                                          </option>
                                          <option value="Meet person">
                                            Meet person
                                          </option>
                                          <option value="Others">Others</option>
                                        </select>
                                      </div>

                                      {/* Buttons for Submission and Navigation */}
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

export default AddInvitation;
