import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiPencilSquare } from "react-icons/hi2";
import { IoMdBulb } from "react-icons/io";
import axiosInstance from "../../services/service";
import Layout from "../../components/molecules/Layout/Layout";

const Report = () => {
  const [faultreport, setFaultreport] = useState([]);
  const [filterrequest, setFilterRequest] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/report/report")
      .then((response) => {
        setFaultreport(response.data.data);
        setFilterRequest(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedItem(response.data.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleDelete = (id) => {
    axiosInstance
      .delete("/report/delete_request/" + id)
      .then((result) => {
        if (result.data.Status) {
          setFaultreport((prev) => prev.filter((item) => item.id !== id));
          setFilterRequest((prev) => prev.filter((item) => item.id !== id));
          if (selectedItem && selectedItem.id === id) {
            setSelectedItem((prev) => (prev.length > 0 ? prev[0] : null));
          }
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error deleting report:", err);
        alert("Error deleting report. Please try again.");
      });
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredRequest = faultreport.filter(
      (e) =>
        e.zone.toLowerCase().includes(searchText) ||
        e.school.toLowerCase().includes(searchText) ||
        e.fault_type.toLowerCase().includes(searchText) ||
        e.priority.toLowerCase().includes(searchText) ||
        e.requestor_name.toLowerCase().includes(searchText) ||
        e.id.toString().toLowerCase().includes(searchText)
    );
    setFilterRequest(filteredRequest);
    setSelectedItem(filteredRequest.length > 0 ? filteredRequest[0] : null);
  };

  const handleImageClick = (image) => {
    setFullScreenImage(image);
  };

  const handleExitFullScreen = () => {
    setFullScreenImage(null);
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
                      <h4 style={{ color: "black" }}>Fault Report</h4>
                    </section>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="main-card mb-3 card">
                          <div className="card-body">
                            <div className="box-header with-border">
                              <div className="input-search">
                                <label htmlFor="" className="search-label">
                                  Search :{" "}
                                </label>{" "}
                                {/* Search Input */}
                                <input
                                  type="search"
                                  placeholder="Search"
                                  onChange={handleSearchChange}
                                />
                              </div>

                              <div className="box_add">
                                <button>
                                  <Link
                                    to="/display/add_request"
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    Add Request
                                  </Link>
                                </button>{" "}
                                {/* Add Request Button */}
                              </div>
                            </div>
                            <div className=" p-2 ">
                              <div>
                                <span className="blub-icon">
                                  <IoMdBulb />
                                </span>
                                Both fault reports and Service request types
                                will be listed here.
                              </div>
                            </div>
                            <div className="box-body">
                              <div className="dataTables_wrapper">
                                <div className="container-fluid grid-line">
                                  <div className="container-fluid grid-bax">
                                    <div className="container continar">
                                      {filterrequest.map((item, index) => (
                                        <div
                                          key={index}
                                          className={`row-container ${
                                            selectedItem &&
                                            selectedItem.id === item.id
                                              ? "selected"
                                              : ""
                                          }`}
                                          onClick={() => handleItemClick(item)}
                                        >
                                          {" "}
                                          {/* Fault Report List Item */}
                                          <div className="item-heading">
                                            <span className="item-heading-main">
                                              {item.fault_type}
                                            </span>
                                          </div>
                                          <div className="item-contents">
                                            <div className="content">
                                              <span className="text-secondary">
                                                case id
                                              </span>
                                              <span>{item.id}</span>
                                            </div>

                                            <div className="content">
                                              <span className="text-secondary">
                                                Created at
                                              </span>
                                              <span>
                                                {new Date(
                                                  item.created_at
                                                ).toLocaleDateString("en-GB")}
                                              </span>
                                            </div>

                                            <div className="content">
                                              <span className="text-secondary">
                                                Priority
                                              </span>
                                              <span>{item.priority}</span>
                                            </div>

                                            <div className="content">
                                              <span className="text-secondary">
                                                Request by
                                              </span>
                                              <span>{item.requestor_name}</span>
                                            </div>

                                            <div className="content">
                                              <span className="text-secondary">
                                                Zone
                                              </span>
                                              <span>{item.zone}</span>
                                            </div>

                                            <div className="content">
                                              <span className="text-secondary">
                                                Reported{" "}
                                              </span>
                                              <span className="text-primary">
                                                {item.report_said}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Right Side: Selected Fault Report Details */}
                                  <div className=" grid-box">
                                    {selectedItem && (
                                      <div className="details-content">
                                        <div className="request-drawer__title">
                                          <div>Request Details</div>
                                          <div>
                                            <Link
                                              onClick={() => {
                                                const isConfirmed =
                                                  window.confirm(
                                                    "Are you sure you want to Edit?"
                                                  );
                                                if (isConfirmed) {
                                                  // Redirect to the edit request page after deletion
                                                  window.location.href = `/display/edit_request/${selectedItem.id}`;
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
                                              //ALERT MESSAGE
                                              onClick={() => {
                                                const isConfirmed =
                                                  window.confirm(
                                                    "Are you sure you want to delete?"
                                                  );
                                                if (isConfirmed) {
                                                  handleDelete(selectedItem.id);
                                                }
                                              }}
                                              // onClick={() => handleDelete(selectedItem.id)}
                                            >
                                              <MdDelete />
                                            </button>
                                          </div>
                                        </div>
                                        <ul className="full-content-detail-list">
                                          <li>
                                            <span>Case ID</span>
                                            <span>{selectedItem.id}</span>
                                          </li>
                                          <li>
                                            <span>Request Type</span>
                                            <span>
                                              {selectedItem.fault_type}
                                            </span>
                                          </li>
                                          <li>
                                            <span>Priority</span>
                                            <span>{selectedItem.priority}</span>
                                          </li>
                                          <li>
                                            <span>
                                              Equipment from drop down{" "}
                                            </span>
                                            <span>
                                              {selectedItem.droup_down}
                                            </span>
                                          </li>
                                          <li>
                                            <span>Description</span>
                                            <span>
                                              {selectedItem.description}
                                            </span>
                                          </li>
                                          <li>
                                            <span>Zone Name</span>
                                            <span>{selectedItem.zone}</span>
                                          </li>
                                          <li>
                                            <span>School Name</span>
                                            <span>{selectedItem.school}</span>
                                          </li>
                                          <li>
                                            <span>Block</span>
                                            <span>{selectedItem.block}</span>
                                          </li>
                                          <li>
                                            <span>Level</span>
                                            <span>{selectedItem.level}</span>
                                          </li>
                                          <li>
                                            <span>Room Number</span>
                                            <span>
                                              {selectedItem.room_number}
                                            </span>
                                          </li>
                                          <li>
                                            <span>Room Name</span>
                                            <span>
                                              {selectedItem.room_name}
                                            </span>
                                          </li>
                                          <li>
                                            <span>Request by</span>
                                            <span>
                                              {selectedItem.requestor_name}
                                            </span>
                                          </li>
                                          <li>
                                            <span>Request Contact Number</span>
                                            <span>
                                              {selectedItem.requestor_contact}
                                            </span>
                                          </li>
                                          <li>
                                            <span>Reported </span>
                                            <span>
                                              {selectedItem.report_said}
                                            </span>
                                          </li>
                                        </ul>
                                        <div
                                          role="separator"
                                          className="ant-divider ant-divider-horizontal ant-divider-with-text-center"
                                          fragment="ed93cefd1e"
                                        >
                                          <span className="ant-divider-inner-text">
                                            Fault Images
                                          </span>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "10px", // Adjust as needed
                                            justifyContent: "center", // Center items horizontally
                                            alignItems: "center", // Center items vertically
                                          }}
                                          className="full-content-images card-request-images"
                                        >
                                          {selectedItem.image && (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                              }}
                                            >
                                              {/* If selectedItem.image is an array, map through it */}
                                              {Array.isArray(
                                                selectedItem.image
                                              ) ? (
                                                selectedItem.image.map(
                                                  (image, index) => (
                                                    <div
                                                      key={index}
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      <img
                                                        src={image}
                                                        alt={`upload-${index}`}
                                                        style={{
                                                          width: "100px",
                                                          height: "auto",
                                                          margin: "5px",
                                                          cursor: "pointer",
                                                          border:
                                                            "1px solid #ddd",
                                                          borderRadius: "4px",
                                                        }}
                                                        onClick={() =>
                                                          handleImageClick(
                                                            image
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  )
                                                )
                                              ) : (
                                                // If selectedItem.image is a single string, display it directly
                                                <img
                                                  src={selectedItem.image}
                                                  alt="uploaded"
                                                  style={{
                                                    width: "100px",
                                                    height: "auto",
                                                    margin: "5px",
                                                    cursor: "pointer",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "4px",
                                                  }}
                                                  onClick={() =>
                                                    handleImageClick(
                                                      selectedItem.image
                                                    )
                                                  }
                                                />
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
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
      </Layout>
      {fullScreenImage && (
        <div
          className="full-screen-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleExitFullScreen}
        >
          <img
            src={fullScreenImage}
            alt="Full-screen"
            style={{ maxHeight: "90%", maxWidth: "90%", cursor: "pointer" }}
          />
        </div>
      )}
    </>
  );
};

export default Report;
