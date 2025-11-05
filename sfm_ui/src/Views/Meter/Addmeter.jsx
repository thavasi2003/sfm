import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";

const AddMeter = () => {
  const [meter, setMeter] = useState({
    meter_name: "",
    meter_unit: "",
    zone: "",
    school: "",
    install_on: "",
    warranty_till: "",
    asset_id: "",
    asset_location: "",
    block: "",
    level: "",
    image: "",
  });

  const imageRef = useRef(null);
  const [schools, setSchools] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get School Table
    axiosInstance
      .get("/auth/school")
      .then((result) => {
        if (result.data.Status) {
          setSchools(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Get Asset table
    axiosInstance
      .get("/auth/asset")
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
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
        setMeter((prevState) => ({
          ...prevState,
          image: reader.result, // Store base64 string
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setMeter((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("meter_name", meter.meter_name);
    formData.append("meter_unit", meter.meter_unit);
    formData.append("zone", meter.zone);
    formData.append("school", meter.school);
    formData.append("install_on", meter.install_on);
    formData.append("warranty_till", meter.warranty_till);
    formData.append("asset_id", meter.asset_id);
    formData.append("asset_location", meter.asset_location);
    formData.append("block", meter.block);
    formData.append("level", meter.level);
    formData.append("image", meter.image);

    axiosInstance
      .post("/meter/add_meter", formData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/meter");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
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
                    <h4 style={{ color: "black" }}>Meter List</h4>
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
                                      Add Meter
                                    </h3>
                                    <form
                                      className="row g-3"
                                      onSubmit={handleSubmit}
                                    >
                                      <div className="col-12">
                                        <label
                                          htmlFor="meter_name"
                                          className="form-label"
                                        >
                                          Meter Name:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="meter_name"
                                          name="meter_name"
                                          required
                                          placeholder="Enter meter Name"
                                          value={meter.meter_name}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label
                                          htmlFor="meter_unit"
                                          className="form-label"
                                        >
                                          Meter Type:
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="meter_unit"
                                          name="meter_unit"
                                          required
                                          placeholder="Enter meter Type"
                                          value={meter.meter_unit}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label
                                          htmlFor="zone"
                                          className="form-label"
                                        >
                                          Zone:
                                        </label>
                                        <select
                                          name="zone"
                                          id="zone"
                                          className="form-select"
                                          required
                                          value={meter.zone}
                                          onChange={handleChange}
                                        >
                                          <option value="" disabled>
                                            Select Zone
                                          </option>
                                          {schools.map((c) => (
                                            <option key={c.id} value={c.zone}>
                                              {c.zone}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div className="col-12">
                                        <label
                                          htmlFor="school"
                                          className="form-label"
                                        >
                                          School Name:
                                        </label>
                                        <select
                                          name="school"
                                          id="school"
                                          className="form-select"
                                          required
                                          value={meter.school}
                                          onChange={handleChange}
                                        >
                                          <option value="" disabled>
                                            Select School
                                          </option>
                                          {schools.map((c) => (
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
                                          htmlFor="install_on"
                                          className="form-label"
                                        >
                                          Install on:
                                        </label>
                                        <input
                                          type="date"
                                          className="form-control"
                                          id="install_on"
                                          name="install_on"
                                          required
                                          value={meter.install_on}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label
                                          htmlFor="warranty_till"
                                          className="form-label"
                                        >
                                          Warranty till:
                                        </label>
                                        <input
                                          type="date"
                                          className="form-control"
                                          id="warranty_till"
                                          name="warranty_till"
                                          required
                                          value={meter.warranty_till}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label
                                          htmlFor="asset_id"
                                          className="form-label"
                                        >
                                          Link to Asset Id (Equipment):
                                        </label>
                                        <select
                                          name="asset_id"
                                          id="asset_id"
                                          className="form-select"
                                          required
                                          value={meter.asset_id}
                                          onChange={handleChange}
                                        >
                                          <option value="" disabled>
                                            Select Asset
                                          </option>
                                          {categories.map((c) => (
                                            <option key={c.name} value={c.name}>
                                              {c.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div className="col-12">
                                        <label
                                          htmlFor="asset_location"
                                          className="form-label"
                                        >
                                          Asset Location (LOCQRID):
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="asset_location"
                                          name="asset_location"
                                          required
                                          placeholder="Eg.55432"
                                          value={meter.asset_location}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <div className="col-12">
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
                                          name="block"
                                          required
                                          placeholder="Enter Block"
                                          value={meter.block}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <div className="col-12">
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
                                          name="level"
                                          required
                                          placeholder="Enter Level"
                                          value={meter.level}
                                          onChange={handleChange}
                                        />
                                      </div>

                                      <div className="col-12 mb-3">
                                        <label
                                          className="form-label"
                                          htmlFor="image"
                                        >
                                          Upload Image:
                                        </label>
                                        <input
                                          className="form-control"
                                          type="file"
                                          id="image"
                                          name="image"
                                          accept="image/*"
                                          onChange={handleChange}
                                          ref={imageRef}
                                        />
                                      </div>

                                      <div className="col-12">
                                        <button
                                          type="submit"
                                          className="btn btn-primary"
                                        >
                                          Submit
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

export default AddMeter;
