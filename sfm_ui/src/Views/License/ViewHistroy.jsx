import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/service";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/molecules/Layout/Layout";

const History = () => {
  const { id } = useParams(); // Retrieve licenseId from URL parameters
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.error("Fetching history for License ID:", id); // Debug log
        const response = await axiosInstance.get(`/license/histroy/${id}`); // Correct URL
        if (response.data.Status) {
          setHistoryData(response.data.Result);
        } else {
          console.warn("No data received or Status is false.");
        }
      } catch (error) {
        console.error(
          "Error fetching history:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      // Ensure licenseId is defined before making the request
      fetchHistory();
    } else {
      console.warn("licenseId is undefined, not fetching history.");
      setLoading(false);
    }
  }, [id]);

  return (
    <Layout>
      <div id="page-wrapper">
        <div className="app-inner-layout app-inner-layout-page">
          <div className="app-inner-layout__wrapper">
            <div className="app-inner-layout__content pt-1">
              <div className="tab-content">
                <div className="container-fluid">
                  <section className="content-header">
                    <h4 style={{ color: "black" }}>License History</h4>
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
                                      View License History
                                    </h3>
                                    {loading ? (
                                      <p>Loading...</p>
                                    ) : (
                                      <div className="table-responsive">
                                        <table className="table table-striped">
                                          <thead>
                                            <tr>
                                              <th>Status</th>
                                              <th>Remarks</th>
                                              <th>Processed At</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {historyData.length > 0 ? (
                                              historyData.map(
                                                (entry, index) => (
                                                  <tr key={index}>
                                                    <td>{entry.status}</td>
                                                    <td>{entry.remarks}</td>
                                                    <td>
                                                      {new Date(
                                                        entry.updated_at
                                                      ).toLocaleString()}
                                                    </td>
                                                  </tr>
                                                )
                                              )
                                            ) : (
                                              <tr>
                                                <td
                                                  colSpan="3"
                                                  className="text-center"
                                                >
                                                  No history data available.
                                                </td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                                      <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(-1)}
                                        type="button"
                                      >
                                        Back
                                      </button>
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
      </div>
    </Layout>
  );
};

export default History;
