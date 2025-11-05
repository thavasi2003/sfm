import { useCallback, useState, useEffect } from "react";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Layout from "../../components/molecules/Layout/Layout";
import Table from "../../components/molecules/Table/Table";
import Tooltip from "../../components/atoms/Tooltip/Tooltip";
import axiosInstance from "../../services/service";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Button from "../../components/atoms/Button/Button";
import AddIcon from "@mui/icons-material/Add";
import Drawer from "../../components/molecules/Drawer/Drawer";
import AddParts from "../../components/organisms/Create/Parts_module/AddParts/AddParts";
import Alert from "../../components/atoms/Alert/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import UpdateParts from "../../components/organisms/Update/Parts_module/UpdateParts/UpdateParts";
import ViewParts from "../../components/organisms/Create/Parts_module/ViewParts/ViewParts";
import DeleteParts from "../../components/organisms/Delete/Parts_nodule/DeleteParts/DeleteParts";

const Parts = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
  const [drawerMode, setDrawerMode] = useState("");
  const [deleteRow, setDeleteRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: "",
    message: "",
    duration: 3000,
    icon: null,
  });

  const handleOpenDeleteModal = (row) => {
    setDeleteRow(row);
    setModalOpen(true);
  };

  const getActionCell = (row) => (
    <div className="ptw-actions-icon">
      <Tooltip text="View" position="top">
        <VisibilityOutlinedIcon
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenDrawer("view", row)}
        />
      </Tooltip>
      <Tooltip text="Edit" position="top">
        <BorderColorOutlinedIcon
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenDrawer("edit", row)}
        />
      </Tooltip>
      <Tooltip text="Delete" position="top">
        <DeleteOutlineSharpIcon
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenDeleteModal(row)}
        />
      </Tooltip>
    </div>
  );

  const headers = [
    { key: "partId", label: "Part ID", sortable: true },
    { key: "partname", label: "Part Name", sortable: true },
    { key: "partsType", label: "Part Type", sortable: true },
    { key: "quantity", label: "Quantity", sortable: true },
    { key: "unitOfMeasure", label: "Unit of Measure", sortable: true },
    { key: "linkToAssetId", label: "Link To Asset_ID", sortable: true },
    { key: "locationZone", label: "Location Zone", sortable: true },
    { key: null, label: "Action", renderer: getActionCell },
  ];

  const getPartsIndex = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/parts/index");
      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        setData(response.data.data);
      } else {
        showAlertHandler({
          type: "error",
          message: "Failed to fetch Parts.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      }
    } catch (error) {
      console.error(error);
      showAlertHandler({
        type: "error",
        message: "Failed to fetch Parts.",
        duration: 3000,
        icon: <ErrorOutlineOutlinedIcon />,
      });
    }
  }, []);

  useEffect(() => {
    getPartsIndex();
  }, [getPartsIndex]);

  const handleOpenDrawer = (mode, row = null) => {
    setDrawerMode(mode);
    setCurrentRow(row);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setCurrentRow(null);
  };

  // Function to handle the close action in the delete confirmation modal
  const handleCloseDeleteModal = () => {
    setModalOpen(false);
    setDeleteRow(null);
    getPartsIndex();
  };

  const handleSave = () => {
    getPartsIndex();
    showAlertHandler({
      type: "success",
      message: currentRow
        ? "Parts has been successfully updated."
        : "New parts has been successfully added.",
      duration: 3000,
      icon: <CheckCircleOutlineIcon />,
    });
    setDrawerOpen(false);
    setCurrentRow(null);
  };

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
      {deleteRow && (
        <DeleteParts
          row={deleteRow}
          onClose={handleCloseDeleteModal}
          showAlert={showAlertHandler}
        />
      )}
      <div className="container-wrapper">
        <div className="container-header">
          <div className="container-header-text">Parts</div>
        </div>
        <div className="container-body">
          <div className="container-body-nav">
            <Button
              label="Add Parts"
              icon={AddIcon}
              iconSize="1rem"
              variant="success"
              type="button"
              size="medium"
              onClick={() => handleOpenDrawer("add")}
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
        {drawerMode === "edit" && currentRow ? (
          <UpdateParts
            row={currentRow}
            onSave={handleSave}
            onCancel={handleCloseDrawer}
            showAlert={showAlertHandler}
          />
        ) : drawerMode === "add" ? (
          <AddParts
            onSave={handleSave}
            onCancel={handleCloseDrawer}
            showAlert={showAlertHandler}
          />
        ) : drawerMode === "view" && currentRow ? (
          <ViewParts row={currentRow} onCancel={handleCloseDrawer} />
        ) : null}
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

export default Parts;

// import { useCallback, useState, useEffect } from "react";
// import Layout from "../../components/molecules/Layout/Layout";
// import axiosInstance from "../../services/service";
// import Button from "../../components/atoms/Button/Button";
// import Drawer from "../../components/molecules/Drawer/Drawer";
// import AddParts from "../../components/organisms/Create/Parts_module/AddParts/AddParts";
// import Box from "@mui/material/Box";
// import UpdateParts from "../../components/organisms/Update/Parts_module/UpdateParts/UpdateParts";
// import ViewParts from "../../components/organisms/Create/Parts_module/ViewParts/ViewParts";
// import DeleteParts from "../../components/organisms/Delete/Parts_nodule/DeleteParts/DeleteParts";
// import PartsTable from "./PartsTable";
// import PageTitle from "../../common/components/PageTitle";
// import ConfirmDialog from "../../common/components/ConfirmDialog";
// import AlertSnackbar from "../../common/components/AlertSnackbar";
// import { useParts } from "./useParts";
// import PartsForm from "./PartsForm";

// const Parts = () => {
//   const {
//     data,
//     currentRow,
//     drawerMode,
//     deleteRow,
//     modalOpen,
//     validationError,
//     loading,
//     parts,
//     partsImageRef,
//     handleChange,
//     handleClear,
//     handleSaveSubmit,
//     handleCancel,
//     handleOpenDeleteModal,
//     handleCloseDeleteModal,
//     handleOpenDrawer,
//     handleCloseDrawer,
//     handleSave,
//     alertState,
//     hideAlert,
//     setIsDialogOpen,
//     isDialogOpen,
//     handleCloseDialog,
//   } = useParts();

//   return (
//     <Layout>
//       <Box sx={{ display: "flex", flexDirection: "column" }}>
//         <PageTitle title="Parts" />
//         <PartsTable partsData={data} open={setIsDialogOpen} />
//         <PartsForm
//           open={isDialogOpen}
//           onClose={handleCloseDialog}
//           onCancel={handleCancel}
//           onSave={handleSaveSubmit}
//           handleChange={handleChange}
//           parts={parts}
//           validationError={validationError}
//           partsImageRef={partsImageRef}
//         />

//         {/* <ConfirmDialog
//           open={openDialog}
//           onClose={handleCancel}
//           onConfirm={handleConfirm}
//           confirmButtonText="Confirm"
//           cancelButtonText="Cancel"
//           title="Confirm Delete"
//           message={
//             confirmActionType === "publish"
//               ? "Are you sure you want to publish the page?"
//               : confirmActionType === "delete"
//               ? "Are you sure you want to delete this item?"
//               : ""
//           }
//         /> */}

//         <AlertSnackbar
//           onClose={hideAlert}
//           message={alertState.message}
//           severity={alertState.severity}
//         />
//       </Box>
//     </Layout>
//   );
// };

// export default Parts;

// // {deleteRow && (
// //   <DeleteParts
// //     row={deleteRow}
// //     onClose={handleCloseDeleteModal}
// //     showAlert={showAlert}
// //   />
// // )}
// // <div className="container-wrapper">
// //   <div className="container-header">
// //     <div className="container-header-text">Parts</div>
// //   </div>
// //   <div className="container-body">
// //     <div className="container-body-nav">
// //       <Button
// //         label="Add Parts"
// //         icon={}
// //         iconSize="1rem"
// //         variant="success"
// //         type="button"
// //         size="medium"
// //         onClick={() => handleOpenDrawer("add")}
// //       />
// //     </div>
// //   </div>
// // </div>
// // <Drawer
// //   direction="fromRight"
// //   open={drawerOpen}
// //   onClose={handleCloseDrawer}
// //   size="800px"
// // >
// //   {drawerMode === "edit" && currentRow ? (
// //     <UpdateParts
// //       row={currentRow}
// //       onSave={handleSave}
// //       onCancel={handleCloseDrawer}
// //       showAlert={showAlert}
// //     />
// //   ) : drawerMode === "add" ? (
// //     <AddParts
// //       onSave={handleSave}
// //       onCancel={handleCloseDrawer}
// //       showAlert={showAlert}
// //     />
// //   ) : drawerMode === "view" && currentRow ? (
// //     <ViewParts row={currentRow} onCancel={handleCloseDrawer} />
// //   ) : null}
// // </Drawer>
