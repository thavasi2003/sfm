import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/service";
import Layout from "../../components/molecules/Layout/Layout";

const QRCodePage = () => {
  const { locQRID } = useParams();
  const [locationData, setLocationData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch location data based on locQRID
    axiosInstance
      .get(`/auth/api/${locQRID}`)
      .then((response) => {
        if (response.data.Status) {
          setLocationData(response.data.Data); // Set the location data
        } else {
          alert(response.data.Error); // Show error alert
        }
      })
      .catch((err) => {
        console.error("Error fetching location data:", err);
        alert("Error fetching location data. Please try again."); // Show error alert
      });
  }, [locQRID]);

  // Generate URL with locQRID and location data as query parameters
  const urlToEncode = locationData
    ? `http://coedev.smartbuildinginspection.com/display/fault_report?school_name=${encodeURIComponent(
        locationData.school_table_school_name
      )}&zone=${encodeURIComponent(
        locationData.zone
      )}&block=${encodeURIComponent(
        locationData.block
      )}&level=${encodeURIComponent(
        locationData.level
      )}&room_no=${encodeURIComponent(
        locationData.room_no
      )}&room_name=${encodeURIComponent(locationData.room_name)}`
    : "";

  return (
    <Layout>
      <div id="page-wrapper">
        <div className="app-inner-layout app-inner-layout-page">
          <div className="app-inner-layout__wrapper">
            <div className="app-inner-layout__content pt-1">
              <div className="tab-content">
                <div className="container-fluid">
                  <section className="content-header">
                    <h4>Location QR code</h4>
                  </section>
                  <div className="row">
                    <div className="col-md-12">
                      <div
                        className="main-card mb-3 card"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <div className="box-body">
                          <div className="dataTables_wrapper">
                            <div className="container">
                              <div className="row justify-content-center">
                                <div className="col-md-12">
                                  <div className="p-3 rounded card-body">
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                      <button
                                        className="btn btn-danger"
                                        onClick={() => navigate(-1)}
                                        type="button"
                                      >
                                        Back
                                      </button>
                                    </div>
                                    <div
                                      style={{
                                        textAlign: "center",
                                        marginTop: "20px",
                                      }}
                                    >
                                      {locationData && (
                                        <>
                                          <p className="small">
                                            {
                                              locationData.school_table_school_name
                                            }
                                            /{locationData.zone}
                                          </p>
                                          <p className="small">
                                            Block/Level : {locationData.block}/
                                            {locationData.level}
                                          </p>
                                          <QRCode
                                            value={urlToEncode}
                                            size={258}
                                            target="_blank"
                                            className="m-4"
                                          />
                                          <p>
                                            <a
                                              href={urlToEncode}
                                              target="_blank"
                                            >
                                              Link
                                            </a>
                                          </p>
                                          <p>
                                            <strong>Room: </strong>
                                            {locationData.room_no}/
                                            {locationData.room_name}
                                          </p>
                                        </>
                                      )}
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

export default QRCodePage;
