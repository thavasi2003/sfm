import React, { useState } from "react";
import Modal from "../../../../molecules/Modal/Modal";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axiosInstance from "../../../../../services/service";
import { getUserData } from "../../../../../utils/utils";

const CancelPermitApp = ({ row, showAlert, onClose }) => {
  const userdata = getUserData();
  const [modalOpen, setModalOpen] = useState(true);

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  const cancelPermitApp = async () => {
    const payload = {
      workStatus: 0,
      appStatus: "Canceled",
      statusName: "Canceled",
      userId: userdata.user.userId,
      updatedBy: userdata.user.userId,
    };

    try {
      await axiosInstance.put(`/ptw/cancelPermit/${row.appId}`, payload);

      showAlert({
        type: "success",
        message: "Cancel Successful",
        duration: 3000,
        icon: <CheckCircleOutlineIcon />,
      });

      handleCloseModal();
    } catch (error) {
      showAlert({
        type: "error",
        message: "Failed to cancel",
        duration: 3000,
        icon: <ErrorOutlineOutlinedIcon />,
      });

      console.error("Error cancelling permit application:", error);
    }
  };

  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      title={`Confirm Cancel`}
      buttons={[
        { label: "Yes", onClick: cancelPermitApp, className: "confirm" },
        { label: "No", onClick: handleCloseModal, className: "cancel" },
      ]}
    >
      <p>Are you sure you want to cancel this permit to work?</p>
      <p>Application ID: {row.appId}</p>
    </Modal>
  );
};

export default CancelPermitApp;
