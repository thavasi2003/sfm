import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";

const Assign = () => {
  // State to hold form data
  const { id } = useParams();
  const [license, setLicense] = useState({
    assigned_to: "",
  });

  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLicense((prevLicense) => ({
      ...prevLicense,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Fetch License data
    axiosInstance
      .get(`/license/license/${id}`)
      .then((result) => {
        const fetchedLicense = result.data.Result[0];
        setLicense({
          ...license,

          assigned_to: fetchedLicense.assigned_to,
        });
      })
      .catch((err) => console.error(err));
  }, [id]);
  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .put(`/license/assign_license/${id}`, license) // Adjust the endpoint for adding licenses
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
                                    {/* <h3 className="text-secondary text-center">Add License</h3> */}
                                    <form
                                      className="row g-3"
                                      onSubmit={handleSubmit}
                                    >
                                      <div className="col-12">
                                        <label
                                          htmlFor="assigned_to"
                                          className="form-label search-label"
                                        >
                                          Assigned To:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="assigned_to"
                                          name="assigned_to"
                                          placeholder="Assigned to"
                                          value={license.assigned_to}
                                          onChange={handleChange}
                                          required
                                        />
                                      </div>

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

export default Assign;
