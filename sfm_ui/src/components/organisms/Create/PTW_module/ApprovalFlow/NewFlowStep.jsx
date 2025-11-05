import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import React, { useState, useEffect } from "react";
import Form from "../../../../molecules/Form/Form";
import FormFooter from "../../../../atoms/FormFooter/FormFooter";
import FormHeader from "../../../../atoms/FormHeader/FormHeader";
import axiosInstance from "../../../../../services/service";
import { getUserData } from "../../../../../utils/utils";

const NewFlowStep = ({ id, onSave, onCancel, showAlert }) => {
  const userdata = getUserData();
  const [validationError, setValidationError] = useState({});
  const [account, setAccount] = useState([]);
  const [flowStep, setFlowStep] = useState({
    statusName: "",
    declaration: "",
    userId: "",
    createdBy: "",
  });

  const handleClear = () => {
    setFlowStep({
      statusName: "",
      declaration: "",
      userId: "",
    });
    setValidationError({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlowStep({
      ...flowStep,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/account/names`);
        setAccount(
          response.data.map((item) => ({
            value: item.userId,
            label: item.displayName,
          }))
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const validate = () => {
    const errors = {};

    if (!flowStep.statusName) {
      errors.statusName = "Status Name is required!";
    }
    if (!flowStep.declaration) {
      errors.declaration = "Declaration is required!";
    }

    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const formData = {
        statusName: flowStep.statusName,
        declaration: flowStep.declaration,
        userId: flowStep.userId ? Number(flowStep.userId) : null,
        createdBy: userdata.user.userId,
      };

      try {
        const response = await axiosInstance.post(
          `/flow/addStep/${id}`,
          formData
        );
        handleClear();
        onSave();
        showAlert({
          type: "success",
          message: `New step has been successfully created.`,
          duration: 3000,
          icon: <CheckCircleOutlineIcon />,
        });
      } catch (err) {
        console.error("Error submitting form:", err);
        showAlert({
          type: "error",
          message: "Failed to add new step.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      }
    }
  };

  const handleCancel = () => {
    onCancel();
    handleClear();
  };
  return (
    <>
      <FormHeader title="Create New Step" />
      <div className="form-body">
        <Form
          label="Status Name"
          name="statusName"
          type="text"
          value={flowStep.statusName}
          onChange={handleChange}
          error={validationError.statusName}
          required={true}
        />
        <Form
          label="Declaration"
          type="textarea"
          name="declaration"
          value={flowStep.declaration}
          onChange={handleChange}
          error={validationError.declaration}
          required={true}
        />

        <Form
          label="Assign To"
          type="select"
          name="userId"
          value={flowStep.userId}
          onChange={handleChange}
          options={account}
          required={false}
        />
      </div>
      <FormFooter
        onSave={handleSubmit}
        onCancel={handleCancel}
        saveLabel="Save"
        cancelLabel="Cancel"
      />
    </>
  );
};

export default NewFlowStep;
