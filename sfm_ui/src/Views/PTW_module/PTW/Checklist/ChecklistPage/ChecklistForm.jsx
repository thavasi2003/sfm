import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "../../../../../components/molecules/Form/Form";
import Button from "../../../../../components/atoms/Button/Button";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Alert from "../../../../../components/atoms/Alert/Alert";
import axios from "axios";

const ChecklistForm = () => {
  const { email, ptid, token } = useParams(); // Extract parameters from URL
  const navigate = useNavigate();
  // Ensure email and ptid are decoded safely
  const decryptedEmail = email ? atob(email) : null;
  const ptId = ptid ? atob(ptid) : null;
  const [data, setData] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState({});
  const [permitTypeName, setPermitTypeName] = useState("");
  const [checklistId, setChecklistId] = useState(0);
  const [isRemarksValid, setIsRemarksValid] = useState(true);
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: "",
    message: "",
    duration: 3000,
    icon: null,
  });

  useEffect(() => {
    const getPermitTypeData = async () => {
      try {
        if (!token || !ptId) {
          showAlertHandler({
            type: "error",
            message: "Invalid request. Missing required parameters.",
            duration: 3000,
            icon: <ErrorOutlineOutlinedIcon />,
          });
          return;
        }
        const res = await axios.get(
          `http://coedev.smartbuildinginspection.com/api/v1/ptw_email/permitType/${ptId}/${token}`
        );
        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          setData(res.data.data);
          setPermitTypeName(res.data.data[0]?.ptName || "");
          setChecklistId(res.data.data[0]?.checklistId || 0);
        } else if (res.data.status === "Invalid") {
          showAlertHandler({
            type: "error",
            message: "This checklist has already been submitted.",
            duration: 3000,
            icon: <ErrorOutlineOutlinedIcon />,
          });
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching permit type data:", err);
      }
    };

    getPermitTypeData();
  }, [ptId, token]);

  const handleChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const handleRemarksChange = (e) => {
    const value = e.target.value;
    setRemarks(value);
    const trimmedValue = value.trim();
    setIsRemarksValid(trimmedValue !== "");
    if (!trimmedValue) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        remarks: "Remarks are required",
      }));
    } else {
      setErrors((prevErrors) => {
        const { remarks, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isRemarksValid) {
      const formData = data.map((item) => ({
        serialNo: item.serialNo,
        checkOptions: item.response,
        remarks,
      }));

      const payload = {
        token,
        ptId,
        permitTypeName,
        activeStatus: "1",
        email: decryptedEmail,
        responses: formData,
        statusName: "Application",
      };

      try {
        await axios.post(
          "http://coedev.smartbuildinginspection.com/api/v1/ptw_email/addResponse",
          payload
        );
        handleClear(); // Clear the form on successful save
        navigate("/success", { replace: true }); // Redirect to success page and prevent going back
      } catch (error) {
        console.error("Error submitting form:", error);
        showAlertHandler({
          type: "error",
          message: "Failed to submit the form. Please try again.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      }
    } else {
      setErrors({ remarks: "Remarks are required" });
    }
  };

  const handleClear = () => {
    setData(data.map((item) => ({ ...item, response: "" })));
    setRemarks("");
    setErrors({});
    setIsRemarksValid(true);
  };

  const showAlertHandler = ({ type, message, duration, icon }) => {
    setShowAlert({
      show: true,
      type,
      message,
      duration,
      icon,
    });
    setTimeout(() => {
      setShowAlert({
        show: false,
        type: "",
        message: "",
        duration: 3000,
        icon: null,
      });
    }, duration);
  };

  return (
    <>
      <div className="checklist-form-wrapper">
        {data.length > 0 && (
          <>
            <div className="container-header-checklist">
              <div className="container-header-text-checklist">
                {permitTypeName}
              </div>
              <div className="container-header-id-checklist">
                Checklist ID: {checklistId}
              </div>
            </div>
            <div className="container-body">
              <form className="checklist-form" onSubmit={handleFormSubmit}>
                <div className="checklist-table">
                  <div className="checklist-table-header">
                    <div className="checklist-header-item">S/N</div>
                    <div className="checklist-header-item">Description</div>
                    <div className="checklist-header-item">Checks</div>
                  </div>
                  {data.map((item, index) => (
                    <div key={item.serialNo} className="checklist-row">
                      <div className="checklist-item-serialNo">{index + 1}</div>
                      <div className="checklist-item-description">
                        {item.description}
                      </div>
                      <div className="checklist-item-checks">
                        <label>
                          <input
                            type="radio"
                            name={`response-${index}`}
                            value="yes"
                            checked={item.response === "yes"}
                            onChange={() =>
                              handleChange(index, "response", "yes")
                            }
                          />{" "}
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`response-${index}`}
                            value="no"
                            checked={item.response === "no"}
                            onChange={() =>
                              handleChange(index, "response", "no")
                            }
                          />{" "}
                          No
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`response-${index}`}
                            value="na"
                            checked={item.response === "na"}
                            onChange={() =>
                              handleChange(index, "response", "na")
                            }
                          />{" "}
                          N/A
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="checklist-item-remarks">
                  <Form
                    label="Remarks"
                    type="text"
                    name="remarks"
                    value={remarks}
                    onChange={handleRemarksChange}
                    required={true}
                    error={errors.remarks}
                  />
                </div>
                <div className="checklist-footer">
                  <Button
                    label="Submit"
                    size="small"
                    variant="success"
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </>
        )}

        {showAlert.show && (
          <Alert
            type={showAlert.type}
            message={showAlert.message}
            duration={showAlert.duration}
            icon={showAlert.icon}
          />
        )}
      </div>
    </>
  );
};

export default ChecklistForm;
