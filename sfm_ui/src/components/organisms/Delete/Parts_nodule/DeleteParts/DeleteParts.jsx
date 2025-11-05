import Modal from "../../../../molecules/Modal/Modal";
import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import axiosInstance from "../../../../../services/service";

const DeleteParts = ({ row, onClose, showAlert }) => {
  const [modalOpen, setModalOpen] = useState(true);

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  const deleteParts = async () => {
    try {
      const response = await axiosInstance.delete(
        `/parts/delete/${row.partId}`
      );
      if (response.data.status === "success") {
        handleCloseModal();
        showAlert({
          type: "success",
          message: `Part deleted successfull.`,
          duration: 3000,
          icon: <CheckCircleOutlineIcon />,
        });
      } else {
        showAlert({
          type: "error",
          message: `Failed to delete part.`,
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
        title={`Confirm Delete`}
        buttons={[
          { label: "Yes", onClick: deleteParts, className: "confirm" },
          { label: "No", onClick: handleCloseModal, className: "cancel" },
        ]}
      >
        <p>Are you sure you want to delete this Part?</p>
        <p>
          Part ID:<strong>{row.partId}</strong>{" "}
        </p>
      </Modal>
    </>
  );
};
export default DeleteParts;
