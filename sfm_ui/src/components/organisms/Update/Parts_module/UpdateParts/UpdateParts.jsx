import { useEffect, useState, useRef } from "react";
import { getUserData } from "../../../../../utils/utils";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Form from "../../../../molecules/Form/Form";
import FormHeader from "../../../../atoms/FormHeader/FormHeader";
import FormFooter from "../../../../atoms/FormFooter/FormFooter";
import axiosInstance from "../../../../../services/service";

const UpdateParts = ({ row, onSave, onCancel, showAlert }) => {
  const userdata = getUserData();
  const [validationError, setValidationError] = useState({});
  const [updateParts, setUpdateParts] = useState({
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
    locQRID: "QR_ID",
    partsImage: "Parts Image",
    storeName: "Store Name",
  };

  const partsImageRef = useRef(null);

  useEffect(() => {
    if (row) {
      setUpdateParts({
        partname: row.partname,
        partsType: row.partsType,
        quantity: row.quantity,
        unitOfMeasure: row.unitOfMeasure,
        linkToAssetId: row.linkToAssetId,
        locationZone: row.locationZone,
        locationSchoolId: row.locationSchoolId,
        locationSchoolName: row.locationSchoolName,
        locationBlock: row.locationBlock,
        locationLevel: row.locationLevel,
        locationRoomNo: row.locationRoomNo,
        locationRoomName: row.locationRoomName,
        locQRID: row.locQRID,
        partsImage: row.partsImage,
        storeName: row.storeName,
      });
    }
  }, [row]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "partsImage" && files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        // Check if file size is greater than 5MB
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
          setUpdateParts((prevState) => ({
            ...prevState,
            partsImage: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setUpdateParts((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleClear = () => {
    setUpdateParts({
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
    if (partsImageRef.current) {
      partsImageRef.current.value = null;
    }
  };

  const validate = () => {
    const errors = {};
    Object.keys(updateParts).forEach((field) => {
      if (!updateParts[field]) {
        errors[field] = `${fieldLabels[field]} is required!`;
      }
    });
    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = {
        partname: updateParts.partname,
        partsType: updateParts.partsType,
        quantity: Number(updateParts.quantity),
        unitOfMeasure: updateParts.unitOfMeasure,
        linkToAssetId: Number(updateParts.linkToAssetId),
        locationZone: updateParts.locationZone,
        locationSchoolId: Number(updateParts.locationSchoolId),
        locationSchoolName: updateParts.locationSchoolName,
        locationBlock: updateParts.locationBlock,
        locationLevel: updateParts.locationLevel,
        locationRoomNo: updateParts.locationRoomNo,
        locationRoomName: updateParts.locationRoomName,
        locQRID: updateParts.locQRID,
        partsImage: updateParts.partsImage,
        storeName: updateParts.storeName,
        updateBy: Number(userdata.user.userId),
      };

      try {
        const response = await axiosInstance.put(
          `/parts/update/${row.partId}`,
          formData
        );
        handleClear();
        onSave();
        showAlert({
          type: "success",
          message: "Parts updated successfully.",
          duration: 3000,
          icon: <CheckCircleOutlineIcon />,
        });
      } catch (error) {
        console.error("Error:", error);
        showAlert({
          type: "error",
          message: "Failed to update parts.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      }
    }
  };

  const handleCancel = () => {
    onCancel();
    handleClear();
  };

  return (
    <>
      <FormHeader title="Edit Parts" onClose={handleCancel} />
      <div className="form-body">
        <Form
          label="Part Name"
          name="partname"
          type="text"
          value={updateParts.partname}
          onChange={handleChange}
          required={true}
          error={validationError.partname}
        />
        <Form
          label="Part Type"
          name="partsType"
          type="text"
          value={updateParts.partsType}
          onChange={handleChange}
          required={true}
          error={validationError.partsType}
        />
        <Form
          label="Quantity"
          name="quantity"
          type="text"
          value={updateParts.quantity}
          onChange={handleChange}
          required={true}
          error={validationError.quantity}
        />
        <Form
          label="Unit of Measure"
          name="unitOfMeasure"
          type="text"
          value={updateParts.unitOfMeasure}
          onChange={handleChange}
          required={true}
          error={validationError.unitOfMeasure}
        />
        <Form
          label="Link to Asset ID"
          name="linkToAssetId"
          type="text"
          value={updateParts.linkToAssetId}
          onChange={handleChange}
          required={true}
          error={validationError.linkToAssetId}
        />
        <Form
          label="Zone"
          name="locationZone"
          type="text"
          value={updateParts.locationZone}
          onChange={handleChange}
          required={true}
          error={validationError.locationZone}
        />
        <Form
          label="School ID"
          name="locationSchoolId"
          type="text"
          value={updateParts.locationSchoolId}
          onChange={handleChange}
          required={true}
          error={validationError.locationSchoolId}
        />
        <Form
          label="School Name"
          name="locationSchoolName"
          type="text"
          value={updateParts.locationSchoolName}
          onChange={handleChange}
          required={true}
          error={validationError.locationSchoolName}
        />
        <Form
          label="Block"
          name="locationBlock"
          type="text"
          value={updateParts.locationBlock}
          onChange={handleChange}
          required={true}
          error={validationError.locationBlock}
        />
        <Form
          label="Level"
          name="locationLevel"
          type="text"
          value={updateParts.locationLevel}
          onChange={handleChange}
          required={true}
          error={validationError.locationLevel}
        />
        <Form
          label="Room No"
          name="locationRoomNo"
          type="text"
          value={updateParts.locationRoomNo}
          onChange={handleChange}
          required={true}
          error={validationError.locationRoomNo}
        />
        <Form
          label="Room Name"
          name="locationRoomName"
          type="text"
          value={updateParts.locationRoomName}
          onChange={handleChange}
          required={true}
          error={validationError.locationRoomName}
        />
        <Form
          label="QR ID"
          name="locQRID"
          type="text"
          value={updateParts.locQRID}
          onChange={handleChange}
          required={true}
          error={validationError.locQRID}
        />
        <Form
          label="Parts Image"
          name="partsImage"
          type="file"
          onChange={handleChange}
          required={true}
          error={validationError.partsImage}
          inputRef={partsImageRef}
        />
        <Form
          label="Store Name"
          name="storeName"
          type="text"
          value={updateParts.storeName}
          onChange={handleChange}
          required={true}
          error={validationError.storeName}
        />
      </div>
      <FormFooter
        saveLabel="Save"
        cancelLabel="Cancel"
        onSave={handleSubmit}
        onCancel={handleCancel}
        onClear={handleClear}
      />
    </>
  );
};
export default UpdateParts;
