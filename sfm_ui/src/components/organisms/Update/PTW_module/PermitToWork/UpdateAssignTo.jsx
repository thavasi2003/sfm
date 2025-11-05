import React, { useState, useEffect } from "react";
import { getUserData } from "../../../../../utils/utils";
import Form from "../../../../molecules/Form/Form";
import axiosInstance from "../../../../../services/service";
import FormFooter from "../../../../atoms/FormFooter/FormFooter";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import "./UpdateAssignTo.css";

const UpdateAssignTo = ({ row, onClose, showAlert }) => {
  const userdata = getUserData();
  const [updateAssignTo, setUpdateAssignTo] = useState({
    userId: "",
    updatedBy: userdata.user.userId,
  });
  const [account, setAccount] = useState([]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateAssignTo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        `/ptw/updateAssignTo/${row.flowId}/${row.stepNo}`,
        updateAssignTo
      );
      onClose();
      showAlert({
        type: "success",
        message: `Assign To has been successfully updated.`,
        duration: 3000,
        icon: <CheckCircleOutlineIcon />,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert({
        type: "error",
        message: "Failed to update Assign To.",
        duration: 3000,
        icon: <ErrorOutlineOutlinedIcon />,
      });
    }
  };

  return (
    <>
      <div className="update-assign-to-body">
        <div className="update-assign-to-form">
          <Form
            label="Assign To"
            type="select"
            name="userId"
            value={updateAssignTo.userId}
            onChange={handleChange}
            options={account}
            required
          />
        </div>
      </div>
      <div className="update-assign-to-form-footer">
        <FormFooter
          onSave={handleSubmit}
          onCancel={onClose}
          saveLabel="Save"
          cancelLabel="Cancel"
        />
      </div>
    </>
  );
};

export default UpdateAssignTo;
