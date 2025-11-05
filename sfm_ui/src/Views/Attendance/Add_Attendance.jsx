import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/service";
import Layout from "../../components/molecules/Layout/Layout";

const Add_Attendance = () => {
  const [attendance, setAttendance] = useState({
    zone: "",
    school: "",
    tech_name: "",
    date: "",
    checkin: "",
    checkout: "",
    image: "", // Use string for base64
  });

  const [school, setSchool] = useState([]);
  const navigate = useNavigate();
  const imageRef = useRef(null);

  useEffect(() => {
    // Get School Table
    axiosInstance
      .get("/auth/school")
      .then((result) => {
        if (result.data.Status) {
          setSchool(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image" && files && files[0]) {
      // Handle file input
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttendance((prevState) => ({
          ...prevState,
          image: reader.result, // Store base64 string
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setAttendance((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct FormData
    const formData = new FormData();
    formData.append("zone", attendance.zone);
    formData.append("school", attendance.school);
    formData.append("tech_name", attendance.tech_name);
    formData.append("date", attendance.date);
    formData.append("checkin", attendance.checkin);
    formData.append("checkout", attendance.checkout);
    formData.append("image", attendance.image); // Append base64 string directly

    axiosInstance
      .post("/attendance/add_attendance", formData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/display/attendance");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
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
                      <h4 style={{ color: "black" }}>Add Attendance</h4>
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
                                        Add Attendance
                                      </h3>
                                      <form
                                        className="row g-3"
                                        onSubmit={handleSubmit}
                                      >
                                        <div className="col-12">
                                          <label
                                            htmlFor="inputzone"
                                            className="form-label"
                                          >
                                            Zone:
                                          </label>
                                          <select
                                            name="zone" // Updated name
                                            id="inputzone"
                                            className="form-select"
                                            required
                                            onChange={handleChange}
                                          >
                                            <option value="" disabled selected>
                                              Choose Zone
                                            </option>
                                            {school.map((c) => (
                                              <option key={c.id} value={c.zone}>
                                                {c.zone}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="inputschool"
                                            className="form-label"
                                          >
                                            School:
                                          </label>
                                          <select
                                            name="school" // Updated name
                                            id="inputschool"
                                            className="form-select"
                                            required
                                            onChange={handleChange}
                                          >
                                            <option value="" disabled selected>
                                              Choose school
                                            </option>
                                            {school.map((c) => (
                                              <option
                                                key={c.id}
                                                value={c.school_name}
                                              >
                                                {c.school_name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="inputtName"
                                            className="form-label"
                                          >
                                            Technician Name:
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="inputtName"
                                            name="tech_name" // Updated name
                                            required
                                            placeholder="Enter Name"
                                            onChange={handleChange}
                                          />
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="inputdate"
                                            className="form-label"
                                          >
                                            Date:
                                          </label>
                                          <input
                                            type="date"
                                            className="form-control"
                                            id="inputdate"
                                            name="date" // Updated name
                                            required
                                            onChange={handleChange}
                                          />
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="inputcheckin"
                                            className="form-label"
                                          >
                                            Check In:
                                          </label>
                                          <input
                                            type="time"
                                            className="form-control"
                                            id="inputcheckin"
                                            name="checkin" // Updated name
                                            required
                                            onChange={handleChange}
                                          />
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="inputcheckout"
                                            className="form-label"
                                          >
                                            Check Out:
                                          </label>
                                          <input
                                            type="time"
                                            className="form-control"
                                            id="inputcheckout"
                                            name="checkout" // Updated name
                                            required
                                            onChange={handleChange}
                                          />
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="image"
                                            className="form-label"
                                          >
                                            Attachment:
                                          </label>
                                          <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            name="image" // Updated name
                                            onChange={handleChange}
                                            ref={imageRef}
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
    </>
  );
};

export default Add_Attendance;
