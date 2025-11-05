import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../services/service';
import Layout from '../../components/molecules/Layout/Layout';

const Add_Reading = () => {

  const { id } = useParams();  
  const [mreading, setReading] = useState({   
    meter_name: "",
    meter_reading: "",
    meter_unit: "",
    update_on: "",
    update_by: "",        
    image: "",
    meter_id: id, 
  });
   
  const navigate = useNavigate();
  const [meter, setMeter] = useState({});
  const imageRef = useRef(null);

  useEffect(() => {
    // Get Meter Table 
    axiosInstance.get(`/meter/meter/${id}`)
      .then(result => {
        const firstResult = result.data.Result[0];
        if (firstResult) {
          const { meter_name, meter_unit, school, zone, block, level } = firstResult;
          setMeter({
            meter_name,
            meter_unit, 
            school,
            zone,
            block,
            level, 
          });
          setReading(prevState => ({
            ...prevState,
            meter_name,
            meter_unit,
          }));
        }
      }).catch(err => console.log(err));
  }, [id]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setReading((prevState) => ({
          ...prevState,
          image: reader.result, // Store base64 string
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setReading((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();           
    const formData = new FormData();
    formData.append("meter_name", mreading.meter_name);
    formData.append("meter_reading", mreading.meter_reading);
    formData.append("meter_unit", mreading.meter_unit);
    formData.append("update_on", mreading.update_on);
    formData.append("update_by", mreading.update_by);
    formData.append("image", mreading.image);
    formData.append("meter_id", mreading.meter_id);

    axiosInstance.post("/reading/add_readings", formData)
      .then((result) => {
        if (result.data.Status) {
          navigate(`/display/reading/${id}`);
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
                    <h4>Meter List</h4>
                  </section>
                  <div className="text-uppercase fs-6 fw-bold p-2">
                    <span className="text-secondary"> Zone :</span> {meter.zone} 
                    <span className="text-secondary"> - School : </span> {meter.school}
                  </div>
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
                                      <h3 className="text-secondary text-center">Add Reading</h3>
                                      <form className="row g-3 mt-3" onSubmit={handleSubmit}>
                                        <div className="col-12">
                                          <label htmlFor="inputreading" className="form-label">
                                            {meter.meter_name}  :
                                          </label>
                                          <div className='input-group col-12'>    
                                            <input
                                              type="number"
                                              className="form-control"
                                              id="inputreading"
                                              name="meter_reading"  // Added name attribute
                                              required                        
                                              placeholder="Enter meter Reading"
                                              onChange={handleChange}
                                            />
                                            <div className="input-append">
                                              <label className="input-group-text bg-transparent border-0 search-label">
                                                {meter.meter_unit}
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="col-12">
                                          <label htmlFor="datetimeInput" className="form-label">
                                            Updated on :
                                          </label>
                                          <input
                                            name="update_on"  // Added name attribute
                                            className="form-control"
                                            required
                                            type="datetime-local"
                                            id="datetimeInput"
                                            onChange={handleChange}
                                          />
                                        </div>
                                        
                                        <div className="col-12">
                                          <label htmlFor="inputLocation" className="form-label">
                                            Updated By :
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="inputLocation"
                                            name="update_by"  // Added name attribute
                                            required                                        
                                            placeholder="User Name"
                                            autoComplete="off"
                                            onChange={handleChange}
                                          />
                                        </div>                           
                                        
                                        <div className="col-12 mb-3">
                                          <label htmlFor="image" className="form-label">
                                            Image :
                                          </label>
                                          <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            name="image"  // Added name attribute
                                            required
                                            autoComplete="off"
                                            onChange={handleChange}
                                            ref={imageRef}
                                          />
                                        </div>

                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                          <button className="btn btn-success me-md-2" type="submit">Save</button>
                                          <button className="btn btn-danger" onClick={() => navigate(-1)} type="button">Back</button>
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
      </div>
    </Layout>
  );
};

export default Add_Reading;
