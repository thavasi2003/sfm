import Table from "../../../../components/molecules/Table/Table";
import { useState, useEffect, useCallback } from "react";
import Tooltip from "../../../../components/atoms/Tooltip/Tooltip";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Layout from "../../../../components/molecules/Layout/Layout";
import Alert from "../../../../components/atoms/Alert/Alert";
import AddIcon from "@mui/icons-material/Add";
import DeleteFlow from "../../../../components/organisms/Delete/PTW_module/DeleteFlow/DeleteFlow";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useNavigate } from "react-router-dom";
import NewFlow from "../../../../components/organisms/Create/PTW_module/ApprovalFlow/NewFlow";
import Drawer from "../../../../components/molecules/Drawer/Drawer";
import Button from "../../../../components/atoms/Button/Button";
import axiosInstance from "../../../../services/service";

const ApprovalFlow = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // Stores the fetched permit types
  const [drawerOpen, setDrawerOpen] = useState(false); // Controls the visibility of the drawer
  const [deleteId, setDeleteId] = useState(null); // Stores the ID of the permit type to be deleted
  const [deleteName, setDeleteName] = useState(""); // Stores the name of the permit type to be deleted
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
            navigate("/updateFlow", {
              state: { flowId: row.flowId, flowName: row.flowName },
            });
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
            setDeleteId(row.flowId);
            setDeleteName(row.flowName);
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
    { key: "flowName", label: "Approval Flow Name", sortable: true },
    { key: "nofSteps", label: "No. of Steps", sortable: true },
    { key: null, label: "Actions", renderer: getActionCell }, // Use the getActionCell function as the renderer for the Actions column
  ];

  // Function to fetch the Approval Flow Index from the server
  const getFlowIndex = useCallback(async () => {
    await axiosInstance
      .get("/flow/flowIndex")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
        showAlertHandler({
          type: "error",
          message: "Failed to fetch Approval Flow.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      });
  }, []);

  // Fetch the Approval Flow Index when the component mounts
  useEffect(() => {
    getFlowIndex();
  }, [getFlowIndex]);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    // setUpdateRow(null);
  };

  // Function to handle the save action in the drawer
  const handleSave = () => {
    getFlowIndex();
    showAlertHandler({
      type: "success",
      message: "Approval Flow has been successfully created.",
      duration: 3000,
      icon: <CheckCircleOutlineIcon />,
    });
    setDrawerOpen(false);
  };

  // Function to handle the close action in the delete confirmation modal
  const onModalClose = () => {
    getFlowIndex();
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
        <DeleteFlow
          id={deleteId}
          onClose={onModalClose}
          name={deleteName}
          showAlert={showAlertHandler}
        />
      )}
      <div className="container-wrapper">
        <div className="container-header">
          <div className="container-header-text">Manage Approval Flow</div>
        </div>
        <div className="container-body">
          <div className="container-body-nav">
            <Button
              type="button"
              label="New Approval Flow"
              variant="success"
              size="large"
              icon={AddIcon}
              iconSize="1rem"
              onClick={handleOpenDrawer}
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
        <NewFlow
          onSave={handleSave}
          onCancel={handleCloseDrawer}
          showAlert={showAlertHandler}
        />
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
export default ApprovalFlow;
