import { useState, useRef } from "react";
import { getUserData } from "../../../../../utils/utils";
import axiosInstance from "../../../../../services/service";
import Form from "../../../../molecules/Form/Form";
import FormHeader from "../../../../atoms/FormHeader/FormHeader";
import FormFooter from "../../../../atoms/FormFooter/FormFooter";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const AddParts = ({ onSave, onCancel, showAlert }) => {
  const userdata = getUserData();
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false); // Track loading state

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
    if (partsImageRef.current) {
      partsImageRef.current.value = null;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true); // Start loading

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
        const response = await axiosInstance.post(`/parts/add`, formData);
        handleClear();
        onSave();
        showAlert({
          type: "success",
          message: "New Parts Added successfully.",
          duration: 3000,
          icon: <CheckCircleOutlineIcon />,
        });
      } catch (error) {
        console.error("Error:", error);
        showAlert({
          type: "error",
          message: "Failed to add parts.",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  const handleCancel = () => {
    onCancel();
    handleClear();
  };

  return (
    <>
      <FormHeader title="Add Parts" onClose={handleCancel} />
      <div className="form-body">
        <Form
          label="Part Name"
          name="partname"
          type="text"
          value={parts.partname}
          onChange={handleChange}
          required={true}
          error={validationError.partname}
        />
        <Form
          label="Part Type"
          name="partsType"
          type="text"
          value={parts.partsType}
          onChange={handleChange}
          required={true}
          error={validationError.partsType}
        />
        <Form
          label="Quantity"
          name="quantity"
          type="number"
          value={parts.quantity}
          onChange={handleChange}
          required={true}
          error={validationError.quantity}
        />
        <Form
          label="Unit of Measure"
          name="unitOfMeasure"
          type="text"
          value={parts.unitOfMeasure}
          onChange={handleChange}
          required={true}
          error={validationError.unitOfMeasure}
        />
        <Form
          label="Link to Asset ID"
          name="linkToAssetId"
          type="number"
          value={parts.linkToAssetId}
          onChange={handleChange}
          required={true}
          error={validationError.linkToAssetId}
        />
        <Form
          label="Zone"
          name="locationZone"
          type="text"
          value={parts.locationZone}
          onChange={handleChange}
          required={true}
          error={validationError.locationZone}
        />
        <Form
          label="School ID"
          name="locationSchoolId"
          type="number"
          value={parts.locationSchoolId}
          onChange={handleChange}
          required={true}
          error={validationError.locationSchoolId}
        />
        <Form
          label="School Name"
          name="locationSchoolName"
          type="text"
          value={parts.locationSchoolName}
          onChange={handleChange}
          required={true}
          error={validationError.locationSchoolName}
        />
        <Form
          label="Block"
          name="locationBlock"
          type="text"
          value={parts.locationBlock}
          onChange={handleChange}
          required={true}
          error={validationError.locationBlock}
        />
        <Form
          label="Level"
          name="locationLevel"
          type="text"
          value={parts.locationLevel}
          onChange={handleChange}
          required={true}
          error={validationError.locationLevel}
        />
        <Form
          label="Room No"
          name="locationRoomNo"
          type="text"
          value={parts.locationRoomNo}
          onChange={handleChange}
          required={true}
          error={validationError.locationRoomNo}
        />
        <Form
          label="Room Name"
          name="locationRoomName"
          type="text"
          value={parts.locationRoomName}
          onChange={handleChange}
          required={true}
          error={validationError.locationRoomName}
        />
        <Form
          label="QR ID"
          name="locQRID"
          type="number"
          value={parts.locQRID}
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
          value={parts.storeName}
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
      />
    </>
  );
};

export default AddParts;
