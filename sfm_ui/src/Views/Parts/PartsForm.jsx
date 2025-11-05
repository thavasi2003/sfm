import { Box, TextField } from "@mui/material";
import DialogForm from "../../common/components/DialogForm";
import DialogFormTitle from "../../common/components/DialogFormTitle";
import DialogFormContent from "../../common/components/DialogFormContent";
import DialogFormAction from "../../common/components/DialogFormAction";

const PartsForm = ({
  onSave,
  onClose,
  onCancel,
  open,
  partId,
  handleChange,
  parts,
  validationError,
  partsImageRef,
}) => {
  return (
    <DialogForm
      open={open}
      onClose={onClose}
      sx={{ width: "auto", maxWidth: "none", minWidth: "60%" }}
    >
      <DialogFormTitle
        title={partId ? "Edit Parts" : "Add Parts"}
        onClose={onClose}
      />
      <DialogFormContent>
        <Box display="flex" flexDirection={{ xs: "column", md: "column" }}>
          {/* First Row */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "column" }} // Single column on xs, multi-column on md
          >
            <Box display="flex" flexDirection="column">
              <TextField
                label="Part Name"
                name="partname"
                fullWidth
                variant="standard"
                value={parts.partname}
                onChange={handleChange}
                required={true}
                error={validationError.partname}
                helperText={validationError.partname}
              />
              <TextField
                label="Part Type"
                name="partsType"
                type="text"
                fullWidth
                variant="standard"
                value={parts.partsType}
                onChange={handleChange}
                required={true}
                error={validationError.partsType}
                helperText={validationError.partsType}
              />
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={parts.quantity}
                onChange={handleChange}
                required={true}
                error={validationError.quantity}
                fullWidth
                variant="standard"
                helperText={validationError.quantity}
              />
              <TextField
                label="Unit of Measure"
                name="unitOfMeasure"
                type="text"
                value={parts.unitOfMeasure}
                onChange={handleChange}
                required={true}
                error={validationError.unitOfMeasure}
                fullWidth
                variant="standard"
                helperText={validationError.unitOfMeasure}
              />
              <TextField
                label="Link to Asset ID"
                name="linkToAssetId"
                type="number"
                value={parts.linkToAssetId}
                onChange={handleChange}
                required={true}
                error={validationError.linkToAssetId}
                fullWidth
                variant="standard"
                helperText={validationError.linkToAssetId}
              />
              <TextField
                label="Zone"
                name="locationZone"
                type="text"
                value={parts.locationZone}
                onChange={handleChange}
                required={true}
                error={validationError.locationZone}
                fullWidth
                variant="standard"
                helperText={validationError.locationZone}
              />
              <TextField
                label="School ID"
                name="locationSchoolId"
                type="number"
                variant="standard"
                value={parts.locationSchoolId}
                onChange={handleChange}
                required={true}
                error={validationError.locationSchoolId}
                fullWidth
                helperText={validationError.locationSchoolId}
              />
              <TextField
                label="School Name"
                name="locationSchoolName"
                type="text"
                variant="standard"
                value={parts.locationSchoolName}
                onChange={handleChange}
                required={true}
                error={validationError.locationSchoolName}
                fullWidth
                helperText={validationError.locationSchoolName}
              />
              <TextField
                label="Block"
                name="locationBlock"
                type="text"
                variant="standard"
                value={parts.locationBlock}
                onChange={handleChange}
                required={true}
                error={validationError.locationBlock}
                fullWidth
                helperText={validationError.locationBlock}
              />
              <TextField
                label="Level"
                name="locationLevel"
                type="text"
                variant="standard"
                value={parts.locationLevel}
                onChange={handleChange}
                required={true}
                error={validationError.locationLevel}
                fullWidth
                helperText={validationError.locationLevel}
              />
              <TextField
                label="Room No"
                name="locationRoomNo"
                type="text"
                variant="standard"
                value={parts.locationRoomNo}
                onChange={handleChange}
                required={true}
                error={validationError.locationRoomNo}
                fullWidth
                helperText={validationError.locationRoomNo}
              />
              <TextField
                label="Room Name"
                name="locationRoomName"
                type="text"
                variant="standard"
                value={parts.locationRoomName}
                onChange={handleChange}
                required={true}
                error={validationError.locationRoomName}
                fullWidth
                helperText={validationError.locationRoomName}
              />
              <TextField
                label="QR ID"
                name="locQRID"
                type="number"
                variant="standard"
                value={parts.locQRID}
                onChange={handleChange}
                required={true}
                error={validationError.locQRID}
                fullWidth
                helperText={validationError.locQRID}
              />
              <TextField
                label="Parts Image"
                name="partsImage"
                type="file"
                variant="standard"
                onChange={handleChange}
                required={true}
                error={validationError.partsImage}
                inputRef={partsImageRef}
                fullWidth
                helperText={validationError.partsImage}
              />
              <TextField
                label="Store Name"
                name="storeName"
                type="text"
                variant="standard"
                value={parts.storeName}
                onChange={handleChange}
                required={true}
                error={validationError.storeName}
                fullWidth
                helperText={validationError.storeName}
              />
            </Box>
          </Box>
        </Box>
      </DialogFormContent>
      <DialogFormAction
        saveText="Save"
        cancelText="Cancel"
        onCancel={onCancel}
        onSave={onSave}
      />
    </DialogForm>
  );
};

export default PartsForm;
