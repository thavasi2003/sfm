import React, { useState } from "react";
import axiosInstance from "../../../../../../services/service";
import { getUserData } from "../../../../../../utils/utils";
import Modal from "../../../../../molecules/Modal/Modal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Form from "../../../../../molecules/Form/Form";

const RequestChange = ({ row, showAlert, onClose }) => {
  const userdata = getUserData();
  const [modalOpen, setModalOpen] = useState(true);
  const [signOffRemarks, setSignOffRemarks] = useState("");
  const [errors, setErrors] = useState({
    signOffRemarks: "",
  });

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  const handleChange = (e) => {
    setSignOffRemarks(e.target.value);
    setErrors({ ...errors, signOffRemarks: "" });
  };
  const handleClear = () => {
    setSignOffRemarks("");
  };

  const requestChange = async () => {
    const payload = {
      appId: row.appId,
      statusName: "Change Requested",
      userId: userdata.user.userId,
      signOffRemarks: signOffRemarks,
      updatedBy: userdata.user.userId,
      username: userdata.user.displayName,
      email: row.email,
      ptId: row.ptId,
      checklistId: row.checklistId,
    };

    try {
      await axiosInstance.post(`/ptw/restartAppFlow`, payload);
      showAlert({
        type: "success",
        message: "Request Change Successful",
        duration: 3000,
        icon: <CheckCircleOutlineIcon />,
      });
      handleClear();
      handleCloseModal();
    } catch (error) {
      showAlert({
        type: "error",
        message: "Failed to Request Change",
        duration: 3000,
        icon: <ErrorOutlineOutlinedIcon />,
      });

      console.error("Error Request Change:", error);
    }
  };

  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      title={`Request Change`}
      buttons={[
        { label: "Yes", onClick: requestChange, className: "confirm" },
        { label: "No", onClick: handleCloseModal, className: "cancel" },
      ]}
    >
      <p>
        Do you want to send this Permit to Work application back to the
        applicant for edits?
      </p>
      <Form
        label="Remarks"
        type="text"
        name="signOffRemarks"
        value={signOffRemarks}
        onChange={handleChange}
        required={true}
      />
    </Modal>
  );
};

export default RequestChange;
