import { useState, useEffect } from "react";
import "./UpdatePTW.css";
import Form from "../../../../molecules/Form/Form";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FormHeader from "../../../../atoms/FormHeader/FormHeader";
import FormFooter from "../../../../atoms/FormFooter/FormFooter";
import axiosInstance from "../../../../../services/service";
import { getUserData } from "../../../../../utils/utils";

const UpdatePTW = ({ row, onSave, onCancel, showAlert }) => {
  const userdata = getUserData();
  const [updatePermitType, setUpdatePermitType] = useState({
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

  useEffect(() => {
    if (row) {
      setUpdatePermitType({
        ptName: row.ptName,
        checklistId: row.checklistId,
        flowId: row.flowId,
        reqId: row.reqId,
        remarks: row.remarks,
        active: row.active,
      });
    }
  }, [row]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatePermitType((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setUpdatePermitType({
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

    Object.keys(updatePermitType).forEach((field) => {
      if (!updatePermitType[field]) {
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
        ptName: updatePermitType.ptName,
        checklistId: Number(updatePermitType.checklistId),
        flowId: Number(updatePermitType.flowId),
        reqId: Number(updatePermitType.reqId),
        remarks: updatePermitType.remarks,
        active: updatePermitType.active,
        updatedBy: userdata.user.userId,
      };

      try {
        const response = await axiosInstance.put(
          `/permitType/update/${row.ptId}`,
          formData
        );
        handleClear();
        onSave();
        showAlert({
          type: "success",
          message: "Permit Type has been successfully updated.",
          duration: 3000,
          icon: <CheckCircleOutlineIcon />,
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        showAlert({
          type: "error",
          message: "Failed to update Permit Type.",
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
      <FormHeader title="Update Permit Type" />
      <div className="form-body">
        <Form
          label="Permit Type Name"
          name="ptName"
          type="text"
          value={updatePermitType.ptName}
          onChange={handleChange}
          error={validationError.ptName}
        />
        <Form
          label="Checklist Name"
          name="checklistId"
          type="select"
          value={updatePermitType.checklistId}
          onChange={handleChange}
          options={checklists}
          error={validationError.checklistId}
        />
        <Form
          label="Flow Name"
          name="flowId"
          type="select"
          value={updatePermitType.flowId}
          onChange={handleChange}
          options={flows}
          error={validationError.flowId}
        />
        <Form
          label="Req Tag"
          name="reqId"
          type="select"
          value={updatePermitType.reqId}
          onChange={handleChange}
          options={reqTags}
          error={validationError.reqId}
        />
        <Form
          label="Remarks"
          name="remarks"
          type="text"
          value={updatePermitType.remarks}
          onChange={handleChange}
          error={validationError.remarks}
        />
        <Form
          label="Active Status"
          name="active"
          type="select"
          value={updatePermitType.active}
          onChange={handleChange}
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
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

export default UpdatePTW;
