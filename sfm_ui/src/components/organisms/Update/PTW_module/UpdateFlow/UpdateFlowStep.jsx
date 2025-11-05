import { useState, useEffect } from "react";
import Form from "../../../../molecules/Form/Form";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FormHeader from "../../../../atoms/FormHeader/FormHeader";
import FormFooter from "../../../../atoms/FormFooter/FormFooter";
import axiosInstance from "../../../../../services/service";
import { getUserData } from "../../../../../utils/utils";

const UpdateFlowStep = ({ row, onSave, onCancel, showAlert }) => {
  const userdata = getUserData();
  const [updateStep, setUpdateStep] = useState({
    statusName: "",
    declaration: "",
    userId: "",
  });

  const [validationError, setValidationError] = useState({});
  const [account, setAccount] = useState([]);

  const fieldLabels = {
    statusName: "Status Name",
    declaration: "Declaration",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountResponse = await axiosInstance.get("/account/names");
        setAccount(
          accountResponse.data.map((item) => ({
            value: item.userId,
            label: item.displayName,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (row) {
      setUpdateStep({
        statusName: row.statusName,
        declaration: row.declaration,
        userId: row.userId || "",
      });
    }
  }, [row]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdateStep((prevStep) => ({
      ...prevStep,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setUpdateStep({
      statusName: "",
      declaration: "",
      userId: "",
    });
    setValidationError({});
  };

  const validate = () => {
    const errors = {};

    Object.keys(updateStep).forEach((field) => {
      if (!updateStep[field] && field !== "userId") {
        errors[field] = `${fieldLabels[field]} is required!`;
      }
    });

    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = {
        statusName: updateStep.statusName,
        declaration: updateStep.declaration,
        userId: updateStep.userId ? Number(updateStep.userId) : null,
        updatedBy: userdata.user.userId,
      };

      try {
        const response = await axiosInstance.put(
          `/flow/updateStep/${row.flowId}/${row.stepNo}`,
          formData
        );
        handleClear();
        onSave();
        showAlert({
          type: "success",
          message: `Step ${row.stepNo} has been successfully updated.`,
          duration: 3000,
          icon: <CheckCircleOutlineIcon />,
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        showAlert({
          type: "error",
          message: `Failed to update Step ${row.stepNo}.`,
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
      <FormHeader title="Edit Step" />
      <div className="form-body">
        <Form
          label="Status Name"
          name="statusName"
          type="text"
          value={updateStep.statusName}
          onChange={handleChange}
          error={validationError.statusName}
          required={true}
        />
        <Form
          label="Declaration"
          type="textarea"
          name="declaration"
          value={updateStep.declaration}
          onChange={handleChange}
          error={validationError.declaration}
          required={true}
        />
        <Form
          label="Assign To"
          type="select"
          name="userId"
          value={updateStep.userId || ""}
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

export default UpdateFlowStep;
