import React, { useState, useCallback, useEffect } from "react";
import Form from "../../../../molecules/Form/Form";
import Layout from "../../../../molecules/Layout/Layout";
import Button from "../../../../atoms/Button/Button";
import "./NewPermitApp.css";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import axiosInstance from "../../../../../services/service";
import Checklist from "../../../../../Views/PTW_module/PTW/Checklist/ChecklistComponent/Checklist";
import { getUserData } from "../../../../../utils/utils";

const NewPermitApp = () => {
  const userdata = getUserData();
  const [permitType, setPermitType] = useState("");
  const [permitTypeName, setPermitTypeName] = useState("");
  const [permitTypeOptions, setPermitTypeOptions] = useState([]);
  const [checklistId, setChecklistId] = useState(0);
  const [email, setEmail] = useState("");
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  const [showAlert, setShowAlert] = useState({
    show: false,
    type: "",
    message: "",
    duration: 3000,
    icon: null,
  });

  const [checklistData, setChecklistData] = useState([]);
  const [errors, setErrors] = useState({
    permitType: "",
    email: "",
  });

  const handlePermitTypeChange = async (e) => {
    const selectedPermitType = e.target.value;
    setPermitType(selectedPermitType);

    const selectedOption = permitTypeOptions.find(
      (option) => option.value === +selectedPermitType
    );
    if (selectedOption) {
      setPermitTypeName(selectedOption.label);
      setChecklistId(selectedOption.id);
      setIsEmailVisible(true);
      setErrors({ ...errors, permitType: "" });
      setLoading(true); // Start loading when fetching data

      try {
        const res = await axiosInstance.get(
          `/ptw/permitType/${selectedPermitType}`
        );
        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          setChecklistData(res.data.data);
        } else {
          setChecklistData([]);
          showAlertHandler({
            type: "error",
            message: "Received data is not in the correct format.",
            duration: 3000,
            icon: <ErrorOutlineOutlinedIcon />,
          });
        }
      } catch (err) {
        console.error(err);
        showAlertHandler({
          type: "error",
          message: "Failed to fetch Checklist data.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors({ ...errors, email: "" });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPermitTypeName = useCallback(async () => {
    setLoading(true); // Start loading while fetching permit types

    try {
      const res = await axiosInstance.get(`/ptw/permitTypeName`);
      if (res.data.status === "success" && Array.isArray(res.data.data)) {
        setPermitTypeOptions(
          res.data.data.map((option) => ({
            value: option.ptId,
            label: option.ptName,
            id: option.checklistId,
          }))
        );
      } else {
        setPermitTypeOptions([]);
        showAlertHandler({
          type: "error",
          message: "Received data is not in the correct format.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      }
    } catch (err) {
      console.error(err);
      showAlertHandler({
        type: "error",
        message: "Failed to fetch Permit Type.",
        duration: 3000,
        icon: <ErrorOutlineOutlinedIcon />,
      });
    } finally {
      setLoading(false); // Stop loading after data is fetched
    }
  }, []);

  useEffect(() => {
    getPermitTypeName();
  }, [getPermitTypeName]);

  // Function to show an alert
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

  const handleClearEmail = () => {
    setEmail("");
  };

  const handleSendEmail = async () => {
    if (validateEmail(email)) {
      const payload = {
        email: email,
        checklistId: checklistId,
        permitTypeName: permitTypeName,
        permitType: permitType,
        username: userdata.user.displayName,
      };
      setLoading(true); // Start loading when sending email

      try {
        const response = await axiosInstance.post(
          `/api/email/send-notification`,
          payload
        );
        if (response.data.status === "success") {
          handleClearEmail();
          showAlertHandler({
            type: "success",
            message: "Email sent successfully!",
            duration: 3000,
            icon: <ErrorOutlineOutlinedIcon />,
          });
        } else {
          showAlertHandler({
            type: "error",
            message: "Failed to send the email.",
            duration: 3000,
            icon: <ErrorOutlineOutlinedIcon />,
          });
        }
      } catch (err) {
        console.error(err);
        showAlertHandler({
          type: "error",
          message: "Failed to send the email.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      } finally {
        setLoading(false); // Stop loading after email is sent
      }
    } else {
      setErrors({ ...errors, email: "Invalid email address" });
    }
  };

  const handleSubmit = () => {
    // Add form submission logic here
  };

  return (
    <>
      <Layout>
        <div className="container-wrapper">
          <div className="container-header">
            <div className="container-header-text">New Permit Application</div>
          </div>
          <div className="container-body">
            <div className="container-body-newpta">
              <div className="container-body-newpta-form">
                <Form
                  label="Permit Type"
                  type="select"
                  name="permitType"
                  value={permitType}
                  onChange={handlePermitTypeChange}
                  options={permitTypeOptions}
                  error={errors.permitType}
                  required={true}
                />
              </div>
              {isEmailVisible && (
                <div className="container-body-newpta-email">
                  <div className="container-body-newpta-email-form">
                    <Form
                      label="Email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      error={errors.email}
                      required={true}
                    />
                  </div>
                  <div className="container-body-newpta-email-form-button">
                    <Button
                      label="Send Email"
                      variant="success"
                      size="medium"
                      onClick={handleSendEmail}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {showAlert.show && (
            <div className={`alert ${showAlert.type}`}>
              {showAlert.icon}
              {showAlert.message}
            </div>
          )}
          {permitType && !loading && (
            <Checklist
              ptId={permitType}
              permitTypeName={permitTypeName}
              checklistId={checklistId}
              checklistData={checklistData}
              onSave={handleSubmit}
            />
          )}
        </div>
      </Layout>
    </>
  );
};

export default NewPermitApp;
