import { useState, useRef, useCallback, useEffect } from "react";
import { getUserData } from "../../utils/utils";
import axiosInstance from "../../services/service";
import useAlertSnackbar from "../../common/hooks/useAlertSnackbar";

export const useParts = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
  const [drawerMode, setDrawerMode] = useState("");
  const userdata = getUserData();
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);
  const { alertState, showAlert, hideAlert } = useAlertSnackbar();

  const [parts, setParts] = useState({
    partname: "",
    partsType: "",
    quantity: "",
    unitOfMeasure: "",
    linkToAssetId: "",
    locationZone: "",
    locationSchoolId: "",
    locationSchoolName: "",
    locationBlock: "",
    locationLevel: "",
    locationRoomNo: "",
    locationRoomName: "",
    locQRID: "",
    partsImage: null,
    storeName: "",
  });

  const partsImageRef = useRef(null);

  const fieldLabels = {
    partname: "Part Name",
    partsType: "Part Type",
    quantity: "Quantity",
    unitOfMeasure: "Unit of Measure",
    linkToAssetId: "Link to Asset ID",
    locationZone: "Zone",
    locationSchoolId: "School ID",
    locationSchoolName: "School Name",
    locationBlock: "Block",
    locationLevel: "Level",
    locationRoomNo: "Room No",
    locationRoomName: "Room Name",
    locQRID: "QR ID",
    partsImage: "Parts Image",
    storeName: "Store Name",
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "partsImage" && files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setValidationError((prevErrors) => ({
          ...prevErrors,
          partsImage: "File should be within 5MB.",
        }));
        partsImageRef.current.value = null;
        return;
      } else {
        setValidationError((prevErrors) => ({
          ...prevErrors,
          partsImage: "",
        }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setParts({
            ...parts,
            partsImage: reader.result,
          });
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setParts({
        ...parts,
        [name]: value,
      });
    }
  };

  const handleClear = () => {
    setParts({
      partname: "",
      partsType: "",
      quantity: "",
      unitOfMeasure: "",
      linkToAssetId: "",
      locationZone: "",
      locationSchoolId: "",
      locationSchoolName: "",
      locationBlock: "",
      locationLevel: "",
      locationRoomNo: "",
      locationRoomName: "",
      locQRID: "",
      partsImage: "",
      storeName: "",
    });
    setValidationError({});
    setIsDialogOpen(false);
    setEditData(null);
    if (partsImageRef.current) {
      partsImageRef.current.value = null;
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setIsDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setDeleteModalOpen(false);
  };

  const validate = () => {
    const errors = {};
    Object.keys(parts).forEach((field) => {
      if (!parts[field]) {
        errors[field] = `${fieldLabels[field]} is required!`;
      }
    });
    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);

      const formData = {
        partname: parts.partname,
        partsType: parts.partsType,
        quantity: Number(parts.quantity),
        unitOfMeasure: parts.unitOfMeasure,
        linkToAssetId: Number(parts.linkToAssetId),
        locationZone: parts.locationZone,
        locationSchoolId: Number(parts.locationSchoolId),
        locationSchoolName: parts.locationSchoolName,
        locationBlock: parts.locationBlock,
        locationLevel: parts.locationLevel,
        locationRoomNo: parts.locationRoomNo,
        locationRoomName: parts.locationRoomName,
        locQRID: parts.locQRID,
        partsImage: parts.partsImage,
        storeName: parts.storeName,
        createdBy: Number(userdata.user.userId),
      };

      try {
        await axiosInstance.post(`/parts/add`, formData);
        handleClear();
        getPartsIndex();
        showAlert("New Parts Added successfully.", "success");
      } catch (error) {
        console.error("Error:", error);
        showAlert("Failed to add parts.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    handleClear();
  };

  const getPartsIndex = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/parts/index");
      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        setData(response.data.data);
      } else {
        showAlert("Failed to fetch data", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch data", "error");
    }
  }, []);

  useEffect(() => {
    getPartsIndex();
  }, [getPartsIndex]);

  const handleOpenDrawer = (mode, row = null) => {
    setDrawerMode(mode);
    setCurrentRow(row);
    // setDrawerOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    getPartsIndex();
    showAlert(
      currentRow
        ? "Parts has been successfully updated."
        : "New parts has been successfully added.",
      "success"
    );
    // setDrawerOpen(false);
    setCurrentRow(null);
  };

  return {
    setIsDialogOpen,
    isDialogOpen,
    data,
    currentRow,
    drawerMode,
    validationError,
    loading,
    parts,
    partsImageRef,
    handleChange,
    handleClear,
    handleSaveSubmit,
    handleCancel,
    handleOpenDrawer,
    handleCloseDialog,
    handleSave,
    alertState,
    hideAlert,
  };
};
