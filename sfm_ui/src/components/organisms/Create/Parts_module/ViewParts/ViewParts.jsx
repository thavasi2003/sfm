import { useState, useEffect } from "react";
import Form from "../../../../molecules/Form/Form.jsx";
import FormHeader from "../../../../atoms/FormHeader/FormHeader.jsx";
import Button from "../../../../atoms/Button/Button.jsx";

const ViewParts = ({ row, onCancel }) => {
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
    createdOn: null,
    creatorName: '',
    updatorName: '',
    lastUpdate: null,
  });


  useEffect(() => {
    if (row) {
      setParts({
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
        createdOn: row.createdOn,
        creatorName: row.creatorName,
        updatorName: row.updatorName,
        lastUpdate: row.lastUpdate,
      });
    }
  }, [row]);

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <FormHeader title='View Parts' onClose={handleCancel} />
      <div className="form-body">
        <Form label="Part Name" name="partname" type="text" value={parts.partname} disabled={true} />
        <Form label="Part Type" name="partsType" type="text" value={parts.partsType} disabled={true} />
        <Form label="Quantity" name="quantity" type="text" value={parts.quantity} disabled={true} />
        <Form label="Unit of Measure" name="unitOfMeasure" type="text" value={parts.unitOfMeasure} disabled={true} />
        <Form label="Link to Asset ID" name="linkToAssetId" type="text" value={parts.linkToAssetId} disabled={true} />
        <Form label="Zone" name="locationZone" type="text" value={parts.locationZone} disabled={true} />
        <Form label="School ID" name="locationSchoolId" type="text" value={parts.locationSchoolId} disabled={true} />
        <Form label="School Name" name="locationSchoolName" type="text" value={parts.locationSchoolName} disabled={true} />
        <Form label="Block" name="locationBlock" type="text" value={parts.locationBlock} disabled={true} />
        <Form label="Level" name="locationLevel" type="text" value={parts.locationLevel} disabled={true} />
        <Form label="Room No" name="locationRoomNo" type="text" value={parts.locationRoomNo} disabled={true} />
        <Form label="Room Name" name="locationRoomName" type="text" value={parts.locationRoomName} disabled={true} />
        <Form label="QR ID" name="locQRID" type="text" value={parts.locQRID} disabled={true} />
        <div className="form-group">
          <label htmlFor="partsImage">Parts Image:</label>
              <img src={parts.partsImage} alt={parts.partname} style={{ width: '400px', height: 'auto' }} />
        </div>

        <Form label="Store Name" name="storeName" type="text" value={parts.storeName} disabled={true} />
        <Form label="Added By" name="creatorName" type="text" value={parts.creatorName} disabled={true} />
        <Form label="Added On" name="createdOn" type="text" value={parts.createdOn} disabled={true} />
    {parts.updatorName && parts.lastUpdate &&(
        <>
        <Form label="Updated By" name="updatorName" type="text" value={parts.updatorName} disabled={true} />
        <Form label="Updated On" name="lastUpdate" type="text" value={parts.lastUpdate} disabled={true} />
        </>
    )}
      </div>
      <div style={{"padding":"15px 20px", "border-top":"0.8px solid #a0a4a8","display":"flex","justify-content":"end"}}>
      <Button variant="cancel" size='small' label='Cancel' onClick={handleCancel} />
      </div>
    </>
  );
};

export default ViewParts;
