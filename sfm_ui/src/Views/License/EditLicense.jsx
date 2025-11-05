import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs"; // Import dayjs to handle date formatting
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";

const EditLicense = () => {
  const { id } = useParams();
  const [license, setLicense] = useState({
    description: "",
    license_number: "",
    linked_to: "",

    renewal_status: "",
    renewal_date: "",
    reminder: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch License data
    axiosInstance
      .get(`/license/license/${id}`)
      .then((result) => {
        const fetchedLicense = result.data.Result[0];
        setLicense({
          ...license,
          description: fetchedLicense.description,
          license_number: fetchedLicense.license_number,
          linked_to: fetchedLicense.linked_to,
          renewal_status: fetchedLicense.renewal_status,
          renewal_date: fetchedLicense.renewal_date
            ? dayjs(fetchedLicense.renewal_date).format("YYYY-MM-DD")
            : "",
          reminder: fetchedLicense.reminder,
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedLicense = {
      ...license,
      renewal_date: license.renewal_date
        ? dayjs(license.renewal_date).format("YYYY-MM-DD")
        : "",
    };

    axiosInstance
      .put(`/license/edit_license/${id}`, formattedLicense)
      .then((result) => {
        if (result.data.Status) {
          navigate("/display/license");
          setTimeout(() => {
            alert("Updated Successfully");
          }, 300);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error(err));
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
                      <h4 style={{ color: "black" }}>License List</h4>
                    </section>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="main-card mb-3 card">
                          <div className="card-body">
                            <div className="box-body">
                              <div className="dataTables_wrapper">
                                <div className="container">
                                  <div className="row justify-content-center">
                                    <div className="col-md-9">
                                      <div className="p-3 rounded">
                                        <h3 className="text-secondary text-center">
                                          Edit License
                                        </h3>
                                        <form
                                          className="row g-1"
                                          onSubmit={handleSubmit}
                                        >
                                          <div className="col-12">
                                            <label
                                              htmlFor="inputDescription"
                                              className="form-label"
                                            >
                                              Description
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control rounded-0"
                                              id="inputDescription"
                                              placeholder="Enter Description"
                                              value={license.description}
                                              onChange={(e) =>
                                                setLicense({
                                                  ...license,
                                                  description: e.target.value,
                                                })
                                              }
                                            />
                                          </div>

                                          <div className="col-12">
                                            <label
                                              htmlFor="inputLicenseNumber"
                                              className="form-label"
                                            >
                                              License Number
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control rounded-0"
                                              id="inputLicenseNumber"
                                              placeholder="Enter License Number"
                                              value={license.license_number}
                                              onChange={(e) =>
                                                setLicense({
                                                  ...license,
                                                  license_number:
                                                    e.target.value,
                                                })
                                              }
                                            />
                                          </div>

                                          <div className="col-12">
                                            <label
                                              htmlFor="inputLinkedTo"
                                              className="form-label"
                                            >
                                              Linked to
                                            </label>

                                            <input
                                              type="text"
                                              className="form-control "
                                              id="linked_to"
                                              name="linked_to"
                                              placeholder="Linked to"
                                              value={license.linked_to}
                                              onChange={(e) =>
                                                setLicense({
                                                  ...license,
                                                  linked_to: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                          {/* 
                                          <div className="col-12">
                                            <label htmlFor="inputAssignedTo" className="form-label">Assigned To</label>
                                            <input
                                          type="text"
                                          className="form-control "
                                          id="assigned_to"
                                          name="assigned_to"
                                          placeholder="Assigned to"
                                          value={license.assigned_to}
                                          onChange={(e) =>
                                            setLicense({ ...license, assigned_to: e.target.value })
                                          }
                                        />
                                          </div> */}

                                          <div className="col-12">
                                            <label
                                              htmlFor="inputRenewalStatus"
                                              className="form-label"
                                            >
                                              Renewal Status
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control rounded-0"
                                              id="inputRenewalStatus"
                                              placeholder="Enter Renewal Status"
                                              value={license.renewal_status}
                                              onChange={(e) =>
                                                setLicense({
                                                  ...license,
                                                  renewal_status:
                                                    e.target.value,
                                                })
                                              }
                                            />
                                          </div>

                                          <div className="col-12">
                                            <label
                                              htmlFor="inputRenewalDate"
                                              className="form-label"
                                            >
                                              Renewal Date
                                            </label>
                                            <input
                                              type="date"
                                              className="form-control rounded-0"
                                              id="inputRenewalDate"
                                              value={license.renewal_date}
                                              onChange={(e) =>
                                                setLicense({
                                                  ...license,
                                                  renewal_date: e.target.value,
                                                })
                                              }
                                            />
                                          </div>

                                          <div className="col-12">
                                            <label
                                              htmlFor="inputReminder"
                                              className="form-label"
                                            >
                                              Reminder
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control rounded-0"
                                              id="inputReminder"
                                              placeholder="Enter Reminder"
                                              value={license.reminder}
                                              onChange={(e) =>
                                                setLicense({
                                                  ...license,
                                                  reminder: e.target.value,
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
                                              type="button"
                                              onClick={() =>
                                                navigate("/display/license")
                                              }
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <br />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
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

export default EditLicense;
