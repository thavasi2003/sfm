import axiosInstance from "../../../../../services/service";
import Modal from "../../../../molecules/Modal/Modal";
import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const DeletePermit = ({ row, onClose, showAlert }) => {
  const [modalOpen, setModalOpen] = useState(true);

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  const deletePermitToWork = async () => {
    try {
      const response = await axiosInstance.delete(
        `/ptw/deleteApp/${row.appId}`
      );
      if (response.data.status === "success") {
        handleCloseModal();
        showAlert({
          type: "success",
          message: `Application ID:${row.appId} has been successfully deleted.`,
          duration: 3000,
          icon: <CheckCircleOutlineIcon />,
        });
      } else {
        showAlert({
          type: "error",
          message: `Failed to delete Permit Application ID:${row.appId}.`,
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      }
    } catch (err) {
      console.error("Failed to delete Permit Application", err);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={`Do you want to delete Permit Application ID:${row.appId}`}
        buttons={[
          {
            label: "Delete",
            onClick: deletePermitToWork,
            className: "confirm",
          },
          { label: "Cancel", onClick: handleCloseModal, className: "cancel" },
        ]}
      >
        <p>
          This item will be deleted immediately. You cannot undo this action.
        </p>
      </Modal>
    </>
  );
};

export default DeletePermit;
