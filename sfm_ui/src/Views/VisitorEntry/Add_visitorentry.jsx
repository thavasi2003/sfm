import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";
import dayjs from "dayjs";

const AddVisitor = () => {
  const checkInTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [visitor, setVisitor] = useState({
    visitor_code: "",
    visitor_name: "",
    expected_arrival_time: "",
    from_organization: "",
    check_in: checkInTime,
    image: "",
  });
  const [fetchedVisitorCode, setFetchedVisitorCode] = useState(null); // Track fetched visitor code

  const imageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (visitor.visitor_code && visitor.visitor_code !== fetchedVisitorCode) {
      // Fetch only if a new visitor code is entered
      axiosInstance
        .post("/entry/get_visitor_by_code", {
          visitor_code: visitor.visitor_code,
        })
        .then((result) => {
          const fetchedVisitor = result.data.visitor;

          if (fetchedVisitor) {
            setVisitor((prevVisitor) => ({
              ...prevVisitor,
              visitor_name: fetchedVisitor.visitor_name || "",
              expected_arrival_time: fetchedVisitor.expected_arrival_time
                ? dayjs(fetchedVisitor.expected_arrival_time).format(
                    "YYYY-MM-DDTHH:mm"
                  )
                : "",
              from_organization: fetchedVisitor.from_organization || "",
              check_in:
                fetchedVisitor.check_in ||
                dayjs(fetchedVisitor.check_in).format("YYYY-MM-DD HH:mm:ss"),
            }));
            setFetchedVisitorCode(visitor.visitor_code); // Update the fetched visitor code
          } else {
            alert("No visitor data found with this code.");
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          alert("Visitor has already been checked in.");
        });
    }
  }, [visitor.visitor_code, fetchedVisitorCode]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "visitor_code") {
      // Reset fetchedVisitorCode if visitor_code changes
      setFetchedVisitorCode(null);
    }

    if (name === "image" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setVisitor((prevState) => ({
          ...prevState,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setVisitor((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("visitor_name", visitor.visitor_name);
    formData.append("visitor_code", visitor.visitor_code);
    formData.append("expected_arrival_time", visitor.expected_arrival_time);
    formData.append("from_organization", visitor.from_organization);
    formData.append("check_in", visitor.check_in);
    formData.append("image", visitor.image);

    axiosInstance
      .post(`/entry/add_visitor`, formData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/display/visitor_entry");
        } else {
          alert(`Error: ${result.data.Error}`);
        }
      })
      .catch((err) => {
        console.error("Error adding visitor:", err);
        alert("An error occurred while adding the visitor.");
      });
  };

  return (
    <Layout>
      <div id="page-wrapper">
        <div className="app-inner-layout app-inner-layout-page">
          <div className="app-inner-layout__wrapper">
            <div className="app-inner-layout__content pt-1">
              <div className="container-fluid">
                <section className="content-header">
                  <h4 style={{ color: "black" }}> Visitor Entry</h4>
                </section>
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="card p-4">
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="visitor_code" className="form-label">
                            Visitor Code:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="visitor_code"
                            name="visitor_code"
                            required
                            placeholder="Enter visitor code"
                            value={visitor.visitor_code}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="visitor_name" className="form-label">
                            Visitor Name:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="visitor_name"
                            name="visitor_name"
                            required
                            placeholder="Enter visitor's name"
                            value={visitor.visitor_name}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-3">
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
                            value={visitor.expected_arrival_time}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="from_organization"
                            className="form-label"
                          >
                            From:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="from_organization"
                            name="from_organization"
                            required
                            placeholder="Enter where you are from"
                            value={visitor.from_organization}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-12 mb-3">
                          <label className="form-label" htmlFor="image">
                            Image:
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

                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-success me-2"
                            type="submit"
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => navigate(-1)}
                          >
                            Back
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
    </Layout>
  );
};

export default AddVisitor;
