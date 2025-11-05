import Form from "../../../../../molecules/Form/Form";
import { useEffect, useState, useRef } from "react";
import FormFooter from "../../../../../atoms/FormFooter/FormFooter";
import "./SignOffPermit.css";
import axiosInstance from "../../../../../../services/service";
import SignatureCanvas from "react-signature-canvas";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { getUserData } from "../../../../../../utils/utils";

const SignOffPermit = ({ row, onClose }) => {
  const userdata = getUserData();
  const [declaration, setDeclaration] = useState("");
  const [data, setData] = useState({
    signOffRemarks: "",
    signature: "",
  });
  const [signatureError, setSignatureError] = useState(false);
  const signaturePadRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    onClose();
  };

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
    setSignatureError(false); // Clear error when signature is cleared
  };

  const handleSubmit = async () => {
    if (signaturePadRef.current) {
      const signatureImage = signaturePadRef.current.toDataURL(); // Convert signature to base64 string
      if (
        signaturePadRef.current.isEmpty() ||
        !signatureImage.startsWith("data:image/png;base64,")
      ) {
        setSignatureError(true);
        console.error("Signature is required and should be valid.");
        return;
      }
      const formdata = {
        appId: row.appId,
        statusName: row.statusName,
        userId: userdata.user.userId,
        signOffRemarks: data.signOffRemarks,
        signature: signatureImage,
        email: row.email,
      };

      try {
        await axiosInstance.post(`/ptw/add/signOff/${row.appId}`, formdata);
        handleCancel();
      } catch (error) {
        console.error("Error submitting sign off permit:", error);
      }
    } else {
      console.error("Signature is not valid.");
    }
  };

  useEffect(() => {
    const getDeclaration = async () => {
      if (!row.appId) {
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/ptw/signOff/declaration/${row.appId}`
        );
        if (
          response.data.status === "success" &&
          Array.isArray(response.data.data)
        ) {
          const declarationData = response.data.data.find(
            (item) => item.appId === row.appId
          );
          if (declarationData) {
            setDeclaration(declarationData.declaration);
          }
        }
      } catch (err) {
        console.error("Error fetching declaration:", err);
      }
    };

    getDeclaration();
  }, [row]);

  return (
    <>
      <div className="signOff-permit-wrapper">
        <div className="signoff-permit-declaration">
          <h3>Declaration</h3>
        </div>
        <div className="signoff-permit-declaration-content">{declaration}</div>
        <div className="signoff-permit-form-remarks">
          <Form
            label="Remarks"
            name="signOffRemarks"
            type="text"
            value={data.signOffRemarks}
            onChange={handleChange}
          />
        </div>
        <div className="signoff-permit-form-signature">
          <label className="signoff-permit-form-signature-text">
            <span className="required-asterisk">*</span>Signature
          </label>
          <div className="signature-container">
            <SignatureCanvas
              ref={signaturePadRef}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className: "signature-canvas",
              }}
            />
            <IconButton
              className="signature-clear-icon"
              onClick={handleClear}
              color="primary"
            >
              <ClearIcon />
            </IconButton>
          </div>
          {signatureError && (
            <div className="error-message">Signature is required.</div>
          )}
        </div>
        <div className="signoff-permit-footer">
          <FormFooter
            onSave={handleSubmit}
            onCancel={handleCancel}
            saveLabel="Save"
            cancelLabel="Cancel"
          />
        </div>
      </div>
    </>
  );
};

export default SignOffPermit;
