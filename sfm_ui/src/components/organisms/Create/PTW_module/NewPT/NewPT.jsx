import React, { useState, useEffect } from "react";
import Form from "../../../../molecules/Form/Form";
import "./NewPT.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FormFooter from "../../../../atoms/FormFooter/FormFooter";
import FormHeader from "../../../../atoms/FormHeader/FormHeader";
import axiosInstance from "../../../../../services/service";
import { getUserData } from "../../../../../utils/utils";

const NewPT = ({ onSave, onCancel, showAlert }) => {
  const userdata = getUserData();
  const [permitType, setNewPermitType] = useState({
    ptName: "",
    checklistId: "",
    flowId: "",
    reqId: "",
    remarks: "",
    active: "",
  });
  const fieldLabels = {
    ptName: "Permit Type Name",
    checklistId: "Checklist Name",
    flowId: "Flow Name",
    reqId: "Req Tag",
    remarks: "Remarks",
    active: "Active Status",
  };

  const [validationError, setValidationError] = useState({});
  const [checklists, setChecklists] = useState([]);
  const [flows, setFlows] = useState([]);
  const [reqTags, setReqTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const checklistResponse = await axiosInstance.get("/checklist/names");
        setChecklists(
          checklistResponse.data.map((item) => ({
            value: item.checklistId,
            label: item.cName,
          }))
        );
        const flowResponse = await axiosInstance.get("/flow/names");
        setFlows(
          flowResponse.data.map((item) => ({
            value: item.flowId,
            label: item.flowName,
          }))
        );
        const reqTagResponse = await axiosInstance.get("/requestor/names");
        setReqTags(
          reqTagResponse.data.map((item) => ({
            value: item.reqId,
            label: item.reqName,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewPermitType((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setNewPermitType({
      ptName: "",
      checklistId: "",
      flowId: "",
      reqId: "",
      remarks: "",
      active: "",
    });
    setValidationError({});
  };

  const validate = () => {
    const errors = {};

    Object.keys(permitType).forEach((field) => {
      if (!permitType[field]) {
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
        ptName: permitType.ptName,
        checklistId: Number(permitType.checklistId),
        flowId: Number(permitType.flowId),
        reqId: Number(permitType.reqId),
        remarks: permitType.remarks,
        active: permitType.active,
        createdBy: userdata.user.userId,
      };

      try {
        const response = await axiosInstance.post("/permitType/add", formData);
        handleClear();
        onSave();
        showAlert({
          type: "success",
          message: "Permit Type has been successfully created.",
          duration: 3000,
          icon: <CheckCircleOutlineIcon />,
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        showAlert({
          type: "error",
          message: "Failed to create Permit Type.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      }
    } else {
      console.error("Form validation failed.");
    }
  };

  const handleCancel = () => {
    onCancel();
    handleClear();
  };

  return (
    <>
      <FormHeader title="New Permit Type" />
      <div className="form-body">
        <Form
          label="Permit Type Name"
          name="ptName"
          type="text"
          value={permitType.ptName}
          onChange={handleChange}
          required={true}
          error={validationError.ptName}
        />
        <Form
          label="Checklist Name"
          name="checklistId"
          type="select"
          value={permitType.checklistId}
          onChange={handleChange}
          options={checklists}
          required={true}
          error={validationError.checklistId}
        />
        <Form
          label="Flow Name"
          name="flowId"
          type="select"
          value={permitType.flowId}
          onChange={handleChange}
          options={flows}
          required={true}
          error={validationError.flowId}
        />
        <Form
          label="Req Tag"
          name="reqId"
          type="select"
          value={permitType.reqId}
          onChange={handleChange}
          options={reqTags}
          required={true}
          error={validationError.reqId}
        />
        <Form
          label="Remarks"
          name="remarks"
          type="text"
          value={permitType.remarks}
          onChange={handleChange}
          required={true}
          error={validationError.remarks}
        />
        <Form
          label="Active Status"
          name="active"
          type="select"
          value={permitType.active}
          onChange={handleChange}
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          required={true}
          error={validationError.active}
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

export default NewPT;
