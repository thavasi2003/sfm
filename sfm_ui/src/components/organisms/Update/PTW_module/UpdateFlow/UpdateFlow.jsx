import { useState, useEffect, useCallback } from "react";
import Form from "../../../../molecules/Form/Form";
import Layout from "../../../../molecules/Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../../../../molecules/Table/Table";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import Tooltip from "../../../../atoms/Tooltip/Tooltip";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteFlowStep from "../../../Delete/PTW_module/DeleteFlow/DeleteFlowStep";
import Drawer from "../../../../molecules/Drawer/Drawer";
import Alert from "../../../../atoms/Alert/Alert";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import UpdateFlowStep from "./UpdateFlowStep";
import NewFlowStep from "../../../Create/PTW_module/ApprovalFlow/NewFlowStep";
import "../UpdateFlow/UpdateFlow.css";
import Button from "../../../../atoms/Button/Button";
import axiosInstance from "../../../../../services/service";
import { getUserData } from "../../../../../utils/utils";

const UpdateFlow = () => {
  const navigate = useNavigate();
  const userdata = getUserData();
  const [data, setData] = useState([]);
  const location = useLocation();
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: "",
    message: "",
    duration: 3000,
    icon: null,
  });
  const [drawerOpen, setDrawerOpen] = useState(false); // Controls the visibility of the drawer
  const [deleteId, setDeleteId] = useState(null);
  const [deleteStep, setDeleteStep] = useState(null);
  const [updateRow, setUpdateRow] = useState(null);
  const [addStep] = useState(location.state.flowId);
  const [updateFlowName, setUpdateFlowName] = useState("");
  const [validationError, setValidationError] = useState({});
  const flowId = location.state.flowId;

  const getFlowDetails = useCallback(async () => {
    if (flowId) {
      await axiosInstance
        .get(`/flow/flowDetails/${flowId}`)
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
    }
  }, [flowId]);

  const getFlowName = useCallback(async () => {
    if (flowId) {
      await axiosInstance
        .get(`/flow/FlowName/${flowId}`)
        .then((res) => {
          setUpdateFlowName(res.data.flowName);
        })
        .catch((err) => {
          console.error(err);
          showAlertHandler({
            type: "error",
            message: "Failed to fetch Flow Name.",
            duration: 3000,
            icon: <ErrorOutlineOutlinedIcon />,
          });
        });
    }
  }, [flowId]);

  useEffect(() => {
    getFlowDetails();
    getFlowName();
  }, [getFlowDetails, getFlowName]);

  const handleClear = () => {
    setUpdateFlowName("");
    setValidationError({});
  };

  const validate = async () => {
    const errors = {};
    if (!updateFlowName.trim()) {
      errors.flowName = "Flow Name is required!";
    } else {
      try {
        const response = await axiosInstance.get(`/flow/checkname`, {
          params: {
            flowName: updateFlowName,
          },
        });

        const isUnique = response.data;

        if (!isUnique) {
          errors.flowName = "Flow Name must be unique!";
        }
      } catch (err) {
        console.error("Error checking flow name uniqueness:", err);
        errors.flowName =
          "Unable to verify flow name uniqueness. Please try again later.";
      }
    }
    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await validate()) {
      const formData = {
        flowName: updateFlowName,
        updatedBy: userdata.user.userId,
      };

      try {
        const response = await axiosInstance.put(
          `/flow/updateFlowName/${flowId}`,
          formData
        );
        handleClear();
        saveFlowName();
      } catch (error) {
        console.error("Error submitting form:", error);
        showAlertHandler({
          type: "error",
          message: "Failed to update Flow name.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      }
    }
  };

  const CancelFlowName = () => {
    handleClear();
    navigate("/approvalFlow");
  };
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setUpdateRow(null);
  };

  // Function to handle the save action in the drawer
  const handleSave = () => {
    getFlowDetails();
    showAlertHandler({
      type: "success",
      message: updateRow
        ? `Step ${updateRow.stepNo} has been successfully updated.`
        : `New step has been successfully created`,
      duration: 3000,
      icon: <CheckCircleOutlineIcon />,
    });
    setDrawerOpen(false);
  };

  const saveFlowName = () => {
    getFlowDetails();
    getFlowName(); // Fetch the updated flow name
    showAlertHandler({
      show: true,
      type: "success",
      message: `Flow name has been successfully updated.`,
      duration: 3000,
      icon: <CheckCircleOutlineIcon />,
    });
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

  // Function to handle the close action in the delete confirmation modal
  const onModalClose = () => {
    getFlowDetails();
    setDeleteId(null);
    setDeleteStep(null);
  };
  const handleFlowNameChange = (event) => {
    setUpdateFlowName(event.target.value);
  };

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
            setDeleteId(row.flowId);
            setDeleteStep(row.stepNo);
          }}
        >
          <Tooltip text="Delete" position="top">
            <DeleteOutlineSharpIcon />
          </Tooltip>
        </button>
      </div>
    );
  };

  const headers = [
    { key: "stepNo", label: "Step No.", sortable: true },
    { key: "statusName", label: "Status Name" },
    { key: "declaration", label: "Declaration" },
    { key: "displayName", label: "Assign To" },
    { key: null, label: "Actions", renderer: getActionCell },
  ];

  return (
    <>
      <Layout>
        {deleteId > 0 && (
          <DeleteFlowStep
            id={deleteId}
            onClose={onModalClose}
            stepNo={deleteStep}
            showAlert={showAlertHandler}
          />
        )}
        <div className="container-wrapper">
          <div className="container-header">
            <div className="container-header-text">Edit Approval Flow</div>
          </div>
          <div className="container-body">
            <div className="container-body-nav">
              <Button
                type="button"
                label="Add Step"
                variant="success"
                size="medium"
                icon={AddIcon}
                iconSize="1rem"
                onClick={handleOpenDrawer}
              />
            </div>
            <div className="updateflow-container">
              <div className="updateflow-container-form">
                <Form
                  className
                  label="Flow Name"
                  name="flowName"
                  type="text"
                  value={updateFlowName}
                  onChange={handleFlowNameChange}
                  required={true}
                />
                {validationError.flowName && (
                  <div className="error">{validationError.flowName}</div>
                )}
              </div>
              <div className="updateflow-buttons">
                <Button
                  type="button"
                  label="Save"
                  variant="primary"
                  size="small"
                  onClick={handleSubmit}
                />
                <Button
                  type="button"
                  label="Cancel"
                  variant="cancel"
                  size="small"
                  onClick={CancelFlowName}
                />
              </div>
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
            <UpdateFlowStep
              row={updateRow}
              onSave={handleSave}
              onCancel={handleCloseDrawer}
              showAlert={showAlertHandler}
            />
          ) : (
            <NewFlowStep
              id={addStep}
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
    </>
  );
};

export default UpdateFlow;
