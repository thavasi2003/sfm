import React, { useEffect, useState, useCallback } from "react";
import Table from "../../../../components/molecules/Table/Table";
import Layout from "../../../../components/molecules/Layout/Layout";
import "./ManagePTW.css";
import AddIcon from "@mui/icons-material/Add";
import NewPT from "../../../../components/organisms/Create/PTW_module/NewPT/NewPT";
import Drawer from "../../../../components/molecules/Drawer/Drawer";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeletePTW from "../../../../components/organisms/Delete/PTW_module/DeletePTW/DeletePTW";
import UpdatePTW from "../../../../components/organisms/Update/PTW_module/UpdatePTW/UpdatePTW";
import Alert from "../../../../components/atoms/Alert/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Tooltip from "../../../../components/atoms/Tooltip/Tooltip";
import { useNavigate } from "react-router-dom";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Button from "../../../../components/atoms/Button/Button";
import axiosInstance from "../../../../services/service";

const ManagePTW = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // Stores the fetched permit types
  const [drawerOpen, setDrawerOpen] = useState(false); // Controls the visibility of the drawer
  const [deleteId, setDeleteId] = useState(null); // Stores the ID of the permit type to be deleted
  const [deleteName, setDeleteName] = useState(""); // Stores the name of the permit type to be deleted
  const [updateRow, setUpdateRow] = useState(null); // Stores the row data of the permit type to be updated
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: "",
    message: "",
    duration: 3000,
    icon: null,
  });

  // Function to generate the action cell for each row in the table
  const getActionCell = (row) => {
    return (
      <div className="actions-icon">
        <button
          type="button"
          name="edit"
          onClick={() => {
            setUpdateRow(row);
            handleOpenDrawer();
          }}
        >
          <Tooltip text="Edit" position="top">
            <BorderColorOutlinedIcon />
          </Tooltip>
        </button>
        <button
          type="button"
          name="delete"
          onClick={() => {
            setDeleteId(row.ptId);
            setDeleteName(row.ptName);
          }}
        >
          <Tooltip text="Delete" position="top">
            <DeleteOutlineSharpIcon />
          </Tooltip>
        </button>
      </div>
    );
  };

  // Define the headers for the table
  const headers = [
    { key: "ptName", label: "Permit Type", sortable: true },
    { key: "checklistName", label: "Checklist Name", sortable: true },
    { key: "flowName", label: "Flow Name", sortable: true },
    { key: "reqTag", label: "Req Tag", sortable: true },
    { key: "remarks", label: "Remarks" },
    { key: null, label: "Actions", renderer: getActionCell }, // Use the getActionCell function as the renderer for the Actions column
  ];

  // Function to fetch the permit types from the server
  const getPermitTypes = useCallback(async () => {
    await axiosInstance
      .get("/permitType/fetch")
      .then((res) => {
        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        showAlertHandler({
          type: "error",
          message: "Failed to fetch Permit Type.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      });
  }, []);

  // Fetch the permit types when the component mounts
  useEffect(() => {
    getPermitTypes();
  }, [getPermitTypes]);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setUpdateRow(null);
  };

  // Function to handle the save action in the drawer
  const handleSave = () => {
    getPermitTypes();
    showAlertHandler({
      type: "success",
      message: updateRow
        ? "Permit Type has been successfully updated."
        : "Permit Type has been successfully created.",
      duration: 3000,
      icon: <CheckCircleOutlineIcon />,
    });
    setUpdateRow(null); // Clear update row state after save
    setDrawerOpen(false);
  };

  // Function to handle the close action in the delete confirmation modal
  const onModalClose = () => {
    getPermitTypes();
    setDeleteId(0);
  };

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

  return (
    <Layout>
      {deleteId > 0 && (
        <DeletePTW
          id={deleteId}
          onClose={onModalClose}
          name={deleteName}
          showAlert={showAlertHandler}
        />
      )}
      <div className="container-wrapper">
        <div className="container-header">
          <div className="container-header-text">
            Manage Permit to Work Types
          </div>
        </div>
        <div className="container-body">
          <div className="container-body-nav">
            <Button
              type="button"
              label="New Permit Type"
              variant="success"
              size="large"
              icon={AddIcon}
              iconSize="1rem"
              onClick={() => {
                setUpdateRow(null); // Ensure updateRow is null for new permit type
                handleOpenDrawer();
              }}
            />
            <Button
              type="button"
              label="Manage Approval Flow"
              variant="primary"
              size="large"
              onClick={() => navigate("/approvalFlow")}
            />
          </div>
          <Table data={data} headers={headers} />
        </div>
      </div>
      <Drawer
        direction="fromRight"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        size="800px"
      >
        {updateRow ? (
          <UpdatePTW
            row={updateRow}
            onSave={handleSave}
            onCancel={handleCloseDrawer}
            showAlert={showAlertHandler}
          />
        ) : (
          <NewPT
            onSave={handleSave}
            onCancel={handleCloseDrawer}
            showAlert={showAlertHandler}
          />
        )}
      </Drawer>
      {showAlert.show && (
        <Alert
          type={showAlert.type}
          message={showAlert.message}
          duration={showAlert.duration}
          icon={showAlert.icon}
        />
      )}
    </Layout>
  );
};

export default ManagePTW;
