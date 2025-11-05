// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import dayjs from 'dayjs';
// import Layout from '../../components/molecules/Layout/Layout';
// import axiosInstance from '../../services/service';

// const EditVisitor = () => {
//   const { id } = useParams();
//   const [visitor, setVisitor] = useState({
//     requestor_name: '',
//     visitor_name: '',
//     visitor_email: '',
//     expected_arrival_time: '',
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     axiosInstance.get(`/visitor/get_visitor/${id}`)
//       .then(result => {
//         const fetchedVisitor = result.data.Result[0];
//         setVisitor({
//           requestor_name: fetchedVisitor.requestor_name,
//           visitor_name: fetchedVisitor.visitor_name,
//           visitor_email: fetchedVisitor.visitor_email,
//           expected_arrival_time: fetchedVisitor.expected_arrival_time
//             ? dayjs(fetchedVisitor.expected_arrival_time).format('YYYY-MM-DDTHH:mm')
//             : "",
//         });
//       })
//       .catch(err => console.log(err));
//   }, [id]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const formattedVisitor = {
//       ...visitor,
//       expected_arrival_time: visitor.expected_arrival_time
//         ? dayjs(visitor.expected_arrival_time).format('YYYY-MM-DD HH:mm:ss')
//         : ""
//     };

//     console.log("Formatted data being sent to the server:", formattedVisitor);

//     axiosInstance.put(`/visitor/edit_visitor/${id}`, formattedVisitor)
//       .then(result => {
//         if (result.data.Status) {
//          navigate('/display/visitor');

//         } else {
//           alert(result.data.Error);
//         }
//       })
//       .catch(err => console.log("Error in update request:", err));
//   };

//   return (
//     <Layout>
//       <div id="page-wrapper">
//         <div className="app-inner-layout app-inner-layout-page">
//           <div className="app-inner-layout__wrapper">
//             <div className="app-inner-layout__content pt-1">
//               <div className="tab-content">
//                 <div className="container-fluid">
//                   <section className="content-header">
//                     <h4>Visitor List</h4>
//                   </section>
//                   <div className="row">
//                     <div className="col-md-12">
//                       <div className="main-card mb-3 card">
//                         <div className="card-body">
//                           <div className="box-body">
//                             <div className="dataTables_wrapper">
//                               <div className="container">
//                                 <div className="row justify-content-center">
//                                   <div className="col-md-9">
//                                     <div className="p-3 rounded">
//                                       <form className="row g-1" onSubmit={handleSubmit}>
//                                         <div className="col-12">
//                                           <label htmlFor="inputName" className="form-label">Requestor Name</label>
//                                           <input
//                                             type="text"
//                                             className="form-control rounded-0"
//                                             id="inputName"
//                                             required
//                                             value={visitor.requestor_name}
//                                             onChange={(e) =>
//                                               setVisitor({ ...visitor, requestor_name: e.target.value })
//                                             }
//                                           />
//                                         </div>

//                                         <div className="col-12">
//                                           <label htmlFor="inputType" className="form-label">Visitor Name</label>
//                                           <input
//                                             type="text"
//                                             className="form-control rounded-0"
//                                             id="inputType"
//                                             required
//                                             placeholder="Enter visitor Name"
//                                             value={visitor.visitor_name}
//                                             onChange={(e) =>
//                                               setVisitor({ ...visitor, visitor_name: e.target.value })
//                                             }
//                                           />
//                                         </div>

//                                         <div className="col-12">
//                                           <label htmlFor="inputEmail" className="form-label">Visitor Email</label>
//                                           <input
//                                             type="email"
//                                             className="form-control rounded-0"
//                                             id="inputEmail"
//                                             value={visitor.visitor_email}
//                                             onChange={(e) =>
//                                               setVisitor({ ...visitor, visitor_email: e.target.value })
//                                             }
//                                           />
//                                         </div>

//                                         <div className="col-12 mb-2">
//                                           <label htmlFor="inputArrival" className="form-label">Expected Arrival Time</label>
//                                           <input
//                                             type="datetime-local"
//                                             className="form-control rounded-0"
//                                             id="inputArrival"
//                                             value={visitor.expected_arrival_time}
//                                             onChange={(e) =>
//                                               setVisitor({ ...visitor, expected_arrival_time: e.target.value })
//                                             }
//                                           />
//                                         </div>

//                                         <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                                           <button className="btn btn-success me-md-2" type="submit">Update</button>
//                                           <button
//                                             className="btn btn-danger"
//                                             type="button"
//                                             onClick={() => navigate('/display/visitor')}
//                                           >Cancel</button>
//                                         </div>
//                                       </form>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                               <br />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <br />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default EditVisitor;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import Layout from "../../components/molecules/Layout/Layout";
import axiosInstance from "../../services/service";

const EditVisitor = () => {
  const { id } = useParams();
  const [visitor, setVisitor] = useState({
    requestor_name: "",
    visitor_name: "",
    visitor_email: "",
    expected_arrival_time: "",
    visiting_purpose: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/visitor/get_visitor/${id}`)
      .then((result) => {
        const fetchedVisitor = result.data.Result[0];
        setVisitor({
          requestor_name: fetchedVisitor.requestor_name,
          visitor_name: fetchedVisitor.visitor_name,
          visitor_email: fetchedVisitor.visitor_email,
          expected_arrival_time: fetchedVisitor.expected_arrival_time
            ? dayjs(fetchedVisitor.expected_arrival_time).format(
                "YYYY-MM-DDTHH:mm"
              )
            : "",
          visiting_purpose: fetchedVisitor.visiting_purpose || "",
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedVisitor = {
      ...visitor,
      expected_arrival_time: visitor.expected_arrival_time
        ? dayjs(visitor.expected_arrival_time).format("YYYY-MM-DD HH:mm:ss")
        : "",
    };

    axiosInstance
      .put(`/visitor/edit_visitor/${id}`, formattedVisitor)
      .then((result) => {
        if (result.data.Status) {
          navigate("/display/visitor");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log("Error in update request:", err));
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
                    <h4 style={{ color: "black" }}>Visitor List</h4>
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
                                      <form
                                        className="row g-1"
                                        onSubmit={handleSubmit}
                                      >
                                        <div className="col-12">
                                          <label
                                            htmlFor="requestor_name"
                                            className="form-label"
                                          >
                                            Requestor Name
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control rounded-0"
                                            id="requestor_name"
                                            required
                                            value={visitor.requestor_name}
                                            onChange={(e) =>
                                              setVisitor({
                                                ...visitor,
                                                requestor_name: e.target.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="visitor_name"
                                            className="form-label"
                                          >
                                            Visitor Name
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control rounded-0"
                                            id="visitor_name"
                                            required
                                            placeholder="Enter visitor name"
                                            value={visitor.visitor_name}
                                            onChange={(e) =>
                                              setVisitor({
                                                ...visitor,
                                                visitor_name: e.target.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="visitor_email"
                                            className="form-label"
                                          >
                                            Visitor Email
                                          </label>
                                          <input
                                            type="email"
                                            className="form-control rounded-0"
                                            id="visitor_email"
                                            value={visitor.visitor_email}
                                            onChange={(e) =>
                                              setVisitor({
                                                ...visitor,
                                                visitor_email: e.target.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div className="col-12 mb-2">
                                          <label
                                            htmlFor="expected_arrival_time"
                                            className="form-label"
                                          >
                                            Expected Arrival Time
                                          </label>
                                          <input
                                            type="datetime-local"
                                            className="form-control rounded-0"
                                            id="expected_arrival_time"
                                            value={
                                              visitor.expected_arrival_time
                                            }
                                            onChange={(e) =>
                                              setVisitor({
                                                ...visitor,
                                                expected_arrival_time:
                                                  e.target.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="visiting_purpose"
                                            className="form-label"
                                          >
                                            Visiting Purpose
                                          </label>
                                          <select
                                            className="form-control rounded-0"
                                            id="visiting_purpose"
                                            value={visitor.visiting_purpose}
                                            onChange={(e) =>
                                              setVisitor({
                                                ...visitor,
                                                visiting_purpose:
                                                  e.target.value,
                                              })
                                            }
                                            required
                                          >
                                            <option value="">
                                              Select purpose
                                            </option>
                                            <option value="Meeting">
                                              Meeting
                                            </option>
                                            <option value="Maintenance">
                                              Maintenance
                                            </option>
                                            <option value="Service Request">
                                              Service Request
                                            </option>
                                            <option value="Meet person">
                                              Meet person
                                            </option>
                                            <option value="Others">
                                              Others
                                            </option>
                                          </select>
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
                                              navigate("/display/visitor")
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
  );
};

export default EditVisitor;
