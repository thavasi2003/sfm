import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CiCircleRemove, CiCirclePlus } from "react-icons/ci";
import axiosInstance from "../../services/service";
import Layout from "../../components/molecules/Layout/Layout";

const Add_Request = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const [faultreport, setFaultreport] = useState({
    fault_type: "",
    priority: "",
    zone: queryParams.get("zone") || "",
    school: queryParams.get("school_name") || "",
    block: queryParams.get("block") || "",
    level: queryParams.get("level") || "",
    room_number: queryParams.get("room_no") || "",
    room_name: queryParams.get("room_name") || "",
    droup_down: "",
    requestor_name: "",
    requestor_contact: "",
    description: "",
    images: [], // Store image data for submission
    report_said: "Public",
  });

  const [imagePreviews, setImagePreviews] = useState([]); // State for image previews
  const fileInputRef = useRef(null); // Reference for file input
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "images" && files && files.length > 0) {
      const fileArray = Array.from(files).map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
        });
      });

      Promise.all(fileArray).then((images) => {
        setFaultreport((prevState) => ({
          ...prevState,
          images: [...prevState.images, ...images],
        }));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...images]);
      });
    } else {
      setFaultreport((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFaultreport((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(faultreport).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      } else {
        formData.append(key, value);
      }
    });

    axiosInstance
      .post("/report/add_request", formData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/display/report");
          //   alert("Your Fault Report was successfully submitted. We will resolve your issue soon.");
          //
        } else {
          alert(result.data.Error);
          console.error(result.data.Error); // Log the actual error message from the server
        }
      })
      .catch((err) => {
        console.log(err); // Log the error if the request fails
      });
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
                    <div className="row">
                      <div className="col-md-12">
                        <div className="main-card mb-3 card bg-subtle">
                          <div className="box-body ">
                            <div className="dataTables_wrapper ">
                              <div className="container ">
                                <section className="content-header">
                                  <h4
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    Fault Report
                                  </h4>
                                </section>
                                <div className="row justify-content-center ">
                                  <div className="col-md-12">
                                    <div className="p-2 rounded">
                                      <form
                                        className="row g-2"
                                        onSubmit={handleSubmit}
                                      >
                                        <div className="form-control p-2 ">
                                          <div className="mb-2 text-secondary">
                                            What can we help you with?
                                          </div>

                                          <div className="col-13 mb-2">
                                            <label
                                              htmlFor="fault_type"
                                              className="form-label"
                                            >
                                              Fault Type :
                                            </label>
                                            <select
                                              required
                                              name="fault_type"
                                              id="fault_type"
                                              className="form-select"
                                              onChange={(e) =>
                                                setFaultreport({
                                                  ...faultreport,
                                                  fault_type: e.target.value,
                                                })
                                              }
                                            >
                                              <option selected disabled>
                                                {" "}
                                                Select Type
                                              </option>
                                              <option value="Fault Report">
                                                Fault Report
                                              </option>
                                              <option value="Service Request">
                                                Service Request
                                              </option>
                                            </select>
                                          </div>

                                          <div className="col-12 ">
                                            <label
                                              htmlFor="priority"
                                              className="form-label"
                                            >
                                              Priority :
                                            </label>
                                            <select
                                              required
                                              id="priority"
                                              className="form-select"
                                              onChange={(e) =>
                                                setFaultreport({
                                                  ...faultreport,
                                                  priority: e.target.value,
                                                })
                                              }
                                            >
                                              <option selected disabled>
                                                Select Priority{" "}
                                              </option>
                                              <option value="Low">Low</option>
                                              <option value="Medium">
                                                Medium
                                              </option>
                                              <option value="High">High</option>
                                            </select>
                                          </div>

                                          <div className="col-12">
                                            <label
                                              htmlFor="droup_down"
                                              className="form-label"
                                            >
                                              which equipment from drop down :
                                            </label>
                                            <select
                                              required
                                              id="droup_down"
                                              className="form-select"
                                              onChange={(e) =>
                                                setFaultreport({
                                                  ...faultreport,
                                                  droup_down: e.target.value,
                                                })
                                              }
                                            >
                                              <option selected disabled>
                                                {" "}
                                                Select equipment
                                              </option>
                                              <option value="Fan System">
                                                Fan System
                                              </option>
                                              <option value="Light fitting and accessories">
                                                Light fitting and accessories
                                              </option>
                                              <option value="Dryer system">
                                                Dryer system
                                              </option>
                                              <option value="Electrical installation ( LOW)">
                                                Electrical installation ( LOW)
                                              </option>
                                              <option value="Switchboard">
                                                Switchboard
                                              </option>
                                              <option value="LPS">LPS</option>
                                              <option value="ACMV System">
                                                ACMV System
                                              </option>
                                              <option value="">
                                                Automatic/Motorised Gates/Roller
                                                Shutters
                                              </option>
                                              <option value="Fresh Air / Extraction Systems">
                                                Fresh Air / Extraction Systems
                                              </option>
                                              <option value="Synthetic Field Water Sprinkler System">
                                                Synthetic Field Water Sprinkler
                                                System
                                              </option>
                                              <option value="Stomwater Detection Tank System">
                                                Stomwater Detection Tank System
                                              </option>
                                              <option value="Carpark Barrier">
                                                Carpark Barrier
                                              </option>
                                              <option value="Automatic Irrigation System">
                                                Automatic Irrigation System
                                              </option>
                                            </select>
                                          </div>
                                        </div>

                                        <div className="form-control p-2">
                                          <div className="mb-2 text-secondary">
                                            Where is the issue?
                                          </div>
                                          <div className="col-12 mb-2">
                                            <label
                                              htmlFor="zone"
                                              className="form-label"
                                            >
                                              Zone:
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="zone"
                                              value={faultreport.zone}
                                              readOnly
                                            />
                                          </div>
                                          <div className="col-12 mb-2">
                                            <label
                                              htmlFor="school"
                                              className="form-label"
                                            >
                                              School:
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="school"
                                              value={faultreport.school}
                                              readOnly
                                            />
                                          </div>
                                          <div className="col-12 mb-2">
                                            <label
                                              htmlFor="block"
                                              className="form-label"
                                            >
                                              Block:
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="block"
                                              value={faultreport.block}
                                              readOnly
                                            />
                                          </div>
                                          <div className="col-12 mb-2">
                                            <label
                                              htmlFor="level"
                                              className="form-label"
                                            >
                                              Level:
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="level"
                                              value={faultreport.level}
                                              readOnly
                                            />
                                          </div>
                                          <div className="col-12 mb-2">
                                            <label
                                              htmlFor="room_info"
                                              className="form-label"
                                            >
                                              Room Number/Room Name:
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="room_info"
                                              value={`${faultreport.room_number} / ${faultreport.room_name}`}
                                              readOnly
                                            />
                                          </div>
                                        </div>

                                        <div className="form-control p-2 ">
                                          <div className="mb-2 text-secondary">
                                            How can we contact you?
                                          </div>

                                          <div className="col-12 mb-2">
                                            <label
                                              htmlFor="requestor_name"
                                              className="form-label"
                                            >
                                              Requestor Name :
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="requestor_name"
                                              required
                                              autoComplete="off"
                                              onChange={(e) =>
                                                setFaultreport({
                                                  ...faultreport,
                                                  requestor_name:
                                                    e.target.value,
                                                })
                                              }
                                            />
                                          </div>

                                          <div className="col-12 ">
                                            <label
                                              htmlFor="requestor_contact"
                                              className="form-label"
                                            >
                                              Requestor Contact Number :
                                            </label>
                                            <input
                                              type="tel"
                                              className="form-control"
                                              id="requestor_contact"
                                              required
                                              pattern="[0-9]{8,10}"
                                              autoComplete="off"
                                              onChange={(e) =>
                                                setFaultreport({
                                                  ...faultreport,
                                                  requestor_contact:
                                                    e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>

                                        <div className="form-control p-2">
                                          <div className="mb-2 text-secondary">
                                            Tell us more?
                                          </div>

                                          {/* Image Previews in Vertical Layout */}
                                          <div className="col-12 mb-2">
                                            <label className="form-label">
                                              Uploaded Images:
                                            </label>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "start",
                                                gap: "10px",
                                                maxHeight: "400px", // Set a max height for the container
                                                overflowY: "auto", // Scroll if too many images
                                              }}
                                            >
                                              {imagePreviews.map(
                                                (image, index) => (
                                                  <div
                                                    key={index}
                                                    className="image-preview"
                                                    style={{
                                                      position: "relative", // Enable absolute positioning for the remove icon
                                                      width: "100px",
                                                      height: "100px",
                                                      marginBottom: "10px",
                                                    }}
                                                  >
                                                    <img
                                                      src={image}
                                                      alt={`Preview ${index}`}
                                                      style={{
                                                        width: "100%", // Ensure the image fits within its container
                                                        height: "100%",
                                                        objectFit: "cover", // Keep the image aspect ratio without overflow
                                                        borderRadius: "8px", // Optional: Add rounded corners
                                                      }}
                                                    />
                                                    {/* Remove Icon */}
                                                    <button
                                                      type="button"
                                                      className="btn btn-danger"
                                                      onClick={() =>
                                                        handleRemoveImage(index)
                                                      }
                                                      style={{
                                                        position: "absolute",
                                                        top: "-10px", // Adjust to place above the image
                                                        right: "-10px", // Adjust to place above the image
                                                        padding: "2px", // Smaller button size
                                                        borderRadius: "50%", // Make the button circular
                                                      }}
                                                    >
                                                      <CiCircleRemove
                                                        size={16}
                                                      />
                                                    </button>
                                                  </div>
                                                )
                                              )}

                                              {/* Add Image Button */}
                                              <button
                                                type="button"
                                                className="btn btn-light"
                                                onClick={handleAddImageClick}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  width: "100px",
                                                  height: "100px",
                                                  border: "1px dashed #ccc", // Dashed border to indicate add action
                                                  borderRadius: "8px",
                                                }}
                                              >
                                                <CiCirclePlus size={40} />
                                              </button>
                                            </div>

                                            {/* Hidden file input */}
                                            <input
                                              type="file"
                                              ref={fileInputRef}
                                              name="images"
                                              accept="image/*"
                                              multiple
                                              onChange={handleChange}
                                              style={{ display: "none" }}
                                            />
                                          </div>

                                          <div className="col-12">
                                            <label
                                              htmlFor="description"
                                              className="form-label"
                                            >
                                              Description:
                                            </label>
                                            <textarea
                                              name="description"
                                              id="description"
                                              rows="2"
                                              className="form-control"
                                              required
                                              onChange={(e) =>
                                                setFaultreport({
                                                  ...faultreport,
                                                  description: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
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
    </>
  );
};

export default Add_Request;
