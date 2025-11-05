import Layout from "../../../../components/molecules/Layout/Layout";
import Table from "../../../../components/molecules/Table/Table";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { useState, useCallback, useEffect } from "react";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SignOffPermit from "../../../../components/organisms/Create/PTW_module/PermitToWorkFunctions/SignOff/SignOffPermit";
import FormHeader from "../../../../components/atoms/FormHeader/FormHeader";
import Drawer from "../../../../components/molecules/Drawer/Drawer";
import Button from "../../../../components/atoms/Button/Button";
import Tooltip from "../../../../components/atoms/Tooltip/Tooltip";
import ViewChecklist from "../../../../components/organisms/Create/PTW_module/PermitToWorkFunctions/ViewChecklist/ViewChecklist";
import SignOffHistory from "../../../../components/organisms/Create/PTW_module/PermitToWorkFunctions/SignOffHistory/SignOffHistory";
import axiosInstance from "../../../../services/service";
import DeletePermit from "../../../../components/organisms/Delete/PTW_module/DeletePermit/DeletePermit";
import UpdateAssignTo from "../../../../components/organisms/Update/PTW_module/PermitToWork/UpdateAssignTo";
import { getUserData } from "../../../../utils/utils";
import CancelPermitApp from "../../../../components/organisms/Delete/PTW_module/CancelPermitApp/CancelPermitApp";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import RequestChange from "../../../../components/organisms/Create/PTW_module/PermitToWorkFunctions/RequestChange/RequestChange";
import UpdateChecklist from "../../../../components/organisms/Update/PTW_module/Checklist/UpdateChecklist";
import GeneratePDF from "../../../../components/organisms/Create/PTW_module/GeneratePDF/GeneratePDF";
import Alert from "../../../../components/atoms/Alert/Alert";

const PermitToWork = () => {
  const userdata = getUserData();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerContent, setDrawerContent] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [cancelRow, setCancelRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [requestChange, setRequestChange] = useState(null);
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: "",
    message: "",
    duration: 3000,
    icon: null,
  });

  const isAdmin = userdata.user.role === "Admin";
  const isAssignedUser = userdata.user.userId;

  const handleOpenDrawer = (title, selectedRow) => {
    setDrawerTitle(title);
    setDrawerContent(getDrawerContentComponent(title, selectedRow));
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    getPermitToWorkIndex();
    setDrawerTitle("");
    setDrawerContent(null);
  };

  const getDrawerContentComponent = (title, selectedRow) => {
    switch (title) {
      case "View":
        return <ViewChecklist row={selectedRow} onClose={handleCloseDrawer} />;
      case "Edit":
        return (
          <UpdateChecklist
            row={selectedRow}
            onClose={handleCloseDrawer}
            showAlert={showAlertHandler}
          />
        );
      case "Sign Off":
        return (
          <SignOffPermit
            row={selectedRow}
            onClose={handleCloseDrawer}
            showAlert={showAlertHandler}
          />
        );
      case "Assign To":
        return (
          <UpdateAssignTo
            row={selectedRow}
            onClose={handleCloseDrawer}
            showAlert={showAlertHandler}
          />
        );
      case "History":
        return <SignOffHistory row={selectedRow} onClose={handleCloseDrawer} />;
      default:
        return null;
    }
  };

  const handleOpenDeleteModal = (row) => {
    setDeleteRow(row);
    setModalOpen(true);
  };

  const handleOpenCancelModal = (row) => {
    setCancelRow(row);
    setModalOpen(true);
  };

  const handleOpenRequestChangeModal = (row) => {
    setRequestChange(row);
    setModalOpen(true);
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

  const getActionCell = (row) => {
    const canEdit = !(
      row.appStatus === "Completed" || row.appStatus === "Canceled"
    );
    const canView = isAdmin || row.userId === isAssignedUser;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Tooltip text="View" position="top">
          <VisibilityOutlinedIcon
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleOpenDrawer("View", row);
            }}
          />
        </Tooltip>

        {row.appStatus === "Change Requested" &&
          row.createdBy === isAssignedUser && (
            <Tooltip text="Edit" position="top">
              <BorderColorOutlinedIcon
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleOpenDrawer("Edit", row);
                }}
              />
            </Tooltip>
          )}

        {canEdit && canView && !(row.appStatus === "Change Requested") && (
          <Tooltip text="Sign Off" position="top">
            <CheckCircleOutlineSharpIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleOpenDrawer("Sign Off", row)}
            />
          </Tooltip>
        )}

        {canEdit &&
          row.userId === isAssignedUser &&
          !(row.appStatus === "Change Requested") && (
            <Tooltip text="Request Change" position="top">
              <SyncOutlinedIcon
                style={{ cursor: "pointer" }}
                onClick={() => handleOpenRequestChangeModal(row)}
              />
            </Tooltip>
          )}

        {canEdit && canView && !(row.appStatus === "Change Requested") && (
          <Tooltip text="Assign To" position="top">
            <GroupAddOutlinedIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleOpenDrawer("Assign To", row)}
            />
          </Tooltip>
        )}

        <Tooltip text="History" position="top">
          <UpdateOutlinedIcon
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenDrawer("History", row)}
          />
        </Tooltip>

        {!canEdit && (
          <Tooltip text="Generate PDF" position="top">
            <GeneratePDF row={row} />
          </Tooltip>
        )}

        {canEdit && (
          <Tooltip text="Cancel" position="top">
            <DoNotDisturbIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleOpenCancelModal(row)}
            />
          </Tooltip>
        )}

        {isAdmin && (
          <Tooltip text="Delete" position="top">
            <DeleteOutlineSharpIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleOpenDeleteModal(row)}
            />
          </Tooltip>
        )}
      </div>
    );
  };

  const renderStatus = (row) => {
    return row.appStatus ? row.appStatus : row.statusName;
  };
  const renderAssignedTo = (row) => {
    if (row.appStatus === "Change Requested") {
      return row.creatorName;
    } else if (row.appStatus === "Completed" || row.appStatus === "Canceled") {
      return "";
    } else {
      return row.displayName;
    }
  };

  const getHeaders = () => {
    return [
      { key: "appId", label: "Application Id", sortable: true },
      { key: "ptName", label: "Permit Type", sortable: true },
      {
        key: "statusName",
        label: "Status",
        sortable: true,
        renderer: renderStatus,
      },
      {
        key: "displayName",
        label: "Assigned To",
        sortable: true,
        renderer: renderAssignedTo,
      },
      { key: "updatedOn", label: "Last Updated At", sortable: true },
      { key: null, label: "Actions", renderer: getActionCell },
    ];
  };

  const headers = getHeaders();

  const getPermitToWorkIndex = useCallback(() => {
    axiosInstance
      .get("/ptw/index")
      .then((res) => {
        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          const uniqueData = res.data.data.reduce((acc, current) => {
            const x = acc.find(
              (item) =>
                item.appId === current.appId &&
                item.createdBy === current.createdBy
            );
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          setData(uniqueData);
        } else {
          setData([]);
          showAlertHandler({
            type: "error",
            message: "Received data is not in the correct format.",
            duration: 3000,
            icon: <ErrorOutlineOutlinedIcon />,
          });
        }
      })
      .catch((err) => {
        showAlertHandler({
          type: "error",
          message: "Failed to fetch Permit To Work.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      });
  }, []);

  useEffect(() => {
    getPermitToWorkIndex();
  }, [getPermitToWorkIndex]);

  // Function to handle the close action in the delete confirmation modal
  const handleCloseDeleteModal = () => {
    setModalOpen(false);
    setDeleteRow(null);
    getPermitToWorkIndex();
  };

  const handleCloseCancelModal = () => {
    setModalOpen(false);
    setCancelRow(null);
    getPermitToWorkIndex();
  };

  const handleCloseRequestChangeModal = () => {
    setModalOpen(false);
    setRequestChange(null);
    getPermitToWorkIndex();
  };

  return (
    <>
      <Layout>
        {deleteRow && (
          <DeletePermit
            row={deleteRow}
            onClose={handleCloseDeleteModal}
            showAlert={showAlertHandler}
          />
        )}
        {cancelRow && (
          <CancelPermitApp
            row={cancelRow}
            onClose={handleCloseCancelModal}
            showAlert={showAlertHandler}
          />
        )}
        {requestChange && (
          <RequestChange
            row={requestChange}
            onClose={handleCloseRequestChangeModal}
            showAlert={showAlertHandler}
          />
        )}
        <div className="container-wrapper">
          <div className="container-header">
            <div className="container-header-text">Permit to Work</div>
          </div>
          <div className="container-body">
            <div className="container-body-nav">
              <Button
                label="New Permit Application"
                icon={AddIcon}
                iconSize="1rem"
                variant="success"
                type="button"
                size="large"
                onClick={() => navigate("/newPermitApp")}
              />
              <Button
                label="Manage Permit Types"
                variant="primary"
                type="button"
                size="large"
                onClick={() => navigate("/managePTW")}
              />
              <Drawer
                direction="fromRight"
                open={drawerOpen}
                onClose={handleCloseDrawer}
                size="800px"
              >
                <FormHeader title={drawerTitle} onClose={handleCloseDrawer} />
                {drawerContent}
              </Drawer>
            </div>
            <Table data={data} headers={headers} />
          </div>
        </div>
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

export default PermitToWork;
