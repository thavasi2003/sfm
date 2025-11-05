import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { FaTachometerAlt } from "react-icons/fa";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";

const Meter = () => {
  const [meter, setMeter] = useState([]);

  useEffect(() => {
    //Get Meter Table
    axiosInstance
      .get("/meter/meter")
      .then((result) => {
        if (result.data.Status) {
          setMeter(result.data.Result);
          setFilterMeter(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error fetching meter data:", err);
        alert("Error fetching meter data. Please try again.");
      });
  }, []);

  // Delete Operation
  const handleDelete = (id) => {
    axiosInstance
      .delete("/meter/delete_meter/" + id)
      .then((result) => {
        if (result.data.Status) {
          // Remove the deleted item from state instead of reloading window
          setMeter(filtermeter.filter((item) => item.id !== id));
          setFilterMeter(filtermeter.filter((item) => item.id !== id));
          // alert("Deleted Successfully")
        } else {
          // alert(result.data.Error)
          alert("You Can't delete anything with the Reading table.");
        }
      })
      .catch((err) => {
        console.error("Error deleting meter:", err);
        alert("Error deleting meter. Please try again.");
      });
  };

  // Search function
  const [filtermeter, setFilterMeter] = useState([]);

  const handleSearchchange = (em) => {
    const searchText = em.target.value.toLowerCase();
    const filtermeter = meter.filter(
      (e) =>
        e.meter_name.toLowerCase().includes(searchText) ||
        e.meter_unit.toLowerCase().includes(searchText) ||
        e.block.toLowerCase().includes(searchText) ||
        e.zone.toLowerCase().includes(searchText)
    );
    setFilterMeter(filtermeter);
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
                      <h4 style={{ color: "black" }}>Meter List</h4>
                    </section>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="main-card mb-3 card">
                          <div className="card-body">
                            <div className="box-header with-border">
                              <div className="box_add">
                                <button>
                                  <Link
                                    to="/display/add_meter"
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    Add Meter
                                  </Link>
                                </button>
                              </div>
                              <div className="input-search">
                                <input
                                  type="search"
                                  placeholder="Search"
                                  onChange={handleSearchchange}
                                />
                              </div>
                            </div>
                            <div className="box-body">
                              <div className="dataTables_wrapper">
                                <table className="meter_table">
                                  <thead>
                                    <tr>
                                      <th>Meter Name</th>
                                      <th>Unit</th>
                                      <th>Zone</th>
                                      <th>Block</th>
                                      <th>Warranty Till</th>
                                      <th>Image</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filtermeter.map((e) => (
                                      <tr key={e.id}>
                                        <td>
                                          {e.meter_name}
                                          <br />
                                          <b className="fw-medium">
                                            Asset id :
                                          </b>
                                          {e.asset_id}
                                        </td>

                                        <td>{e.meter_unit}</td>
                                        <td>{e.zone}</td>
                                        <td>{e.block}</td>
                                        <td>
                                          {new Date(
                                            e.warranty_till
                                          ).toLocaleDateString("en-GB")}
                                        </td>
                                        <td>
                                          <img
                                            src={e.image}
                                            alt={e.meter_name}
                                            style={{
                                              width: "100px",
                                              height: "auto",
                                            }}
                                          />
                                        </td>
                                        <td>
                                          <Link
                                            onClick={() => {
                                              const isConfirmed =
                                                window.confirm(
                                                  "Are you sure you want to Edit?"
                                                );
                                              if (isConfirmed) {
                                                // Redirect to the edit request page after deletion
                                                window.location.href = `/display/meter_edit/${e.id}`;
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
                                                handleDelete(e.id);
                                              }
                                            }}
                                            // onClick={() => handleDelete(e.id)}
                                          >
                                            <MdDelete />
                                          </button>
                                          <Link
                                            to={`/display/reading/${e.id}`}
                                            title="Meter Reading"
                                            className="btn btn-primary btn-sm "
                                          >
                                            <FaTachometerAlt />
                                          </Link>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
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

export default Meter;
