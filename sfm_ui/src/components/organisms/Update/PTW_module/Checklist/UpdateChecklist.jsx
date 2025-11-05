import React, { useState, useEffect, useCallback } from "react";
import { getUserData } from "../../../../../utils/utils";
import axiosInstance from "../../../../../services/service";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Form from "../../../../molecules/Form/Form";
import FormFooter from "../../../../atoms/FormFooter/FormFooter";

const UpdateChecklist = ({ row, showAlert, onClose }) => {
  const userdata = getUserData();
  const [data, setData] = useState([]);
  const [fields, setFields] = useState({});
  const [remarks, setRemarks] = useState("");
  const [isRemarksValid, setIsRemarksValid] = useState(true);
  const [errors, setErrors] = useState({});

  const getChecklistData = useCallback(async () => {
    if (row && row.appId) {
      try {
        const response = await axiosInstance.get(
          `/ptw/checklistResponse/${row.appId}`
        );
        if (
          response.data.status === "success" &&
          Array.isArray(response.data.data)
        ) {
          const fetchedData = response.data.data.map((item) => ({
            ...item,
            response: item.checkOptions, // Set response based on checkOptions
          }));
          setData(fetchedData);
          if (fetchedData.length > 0) {
            setFields({
              cName: fetchedData[0].cName,
              checklistId: fetchedData[0].checklistId,
              remarks: fetchedData[0].remarks,
            });
            setRemarks(fetchedData[0].remarks); // Set initial remarks
          }
        }
      } catch (err) {
        console.error("Error fetching checklist data:", err);
      }
    }
  }, [row]);

  useEffect(() => {
    getChecklistData();
  }, [getChecklistData]);

  const handleChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const handleRemarksChange = (e) => {
    const value = e.target.value;
    setRemarks(value);
    setIsRemarksValid(value.trim() !== "");
    if (!value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        remarks: "Remarks are required",
      }));
    } else {
      setErrors((prevErrors) => {
        const { remarks, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleFormSubmit = async () => {
    // Validate remarks
    if (isRemarksValid) {
      const payload = data.map((item) => ({
        appId: item.appId,
        checklistId: item.checklistId,
        serialNo: item.serialNo,
        checkOptions: item.response,
        remarks: remarks,
        updatedBy: userdata.user.userId,
      }));

      try {
        // Update checklist responses
        const updateResponse = await axiosInstance.put(
          `/ptw/updateChecklistResponse/${row.appId}`,
          payload
        );
        if (updateResponse.data.status === "success") {
          // Proceed to update application status and insert sign off
          await axiosInstance.put(`/ptw/updateAppStatus/${row.appId}`, {
            appStatus: "",
            updatedBy: userdata.user.userId,
          });

          await axiosInstance.post(`/ptw/appSignOff`, {
            appId: row.appId,
            statusName: "Application",
            userId: userdata.user.userId,
          });

          showAlert({
            type: "success",
            message: "Checklist updated and sign off completed successfully",
            duration: 3000,
            icon: <CheckCircleOutlineIcon />,
          });
          onClose();
        } else {
          throw new Error("Failed to update checklist");
        }
      } catch (error) {
        showAlert({
          type: "error",
          message: "Failed to update checklist",
          duration: 3000,
          icon: <ErrorOutlineOutlinedIcon />,
        });
        console.error("Error updating checklist:", error);
      }
    } else {
      setErrors({ remarks: "Remarks are required" });
    }
  };

  return (
    <>
      <div className="container-header-checklist">
        <div className="container-header-text-checklist">{fields.cName}</div>
        <div className="container-header-id-checklist">
          Checklist ID: {fields.checklistId}
        </div>
      </div>
      <div className="container-body">
        <form className="checklist-form">
          <div className="checklist-table">
            <div className="checklist-table-header">
              <div className="checklist-header-item">S/N</div>
              <div className="checklist-header-item">Description</div>
              <div className="checklist-header-item">Checks</div>
            </div>
            {data.map((item, index) => (
              <div key={item.serialNo} className="checklist-row">
                <div className="checklist-item-serialNo">{index + 1}</div>
                <div className="checklist-item-description">
                  {item.description}
                </div>
                <div className="checklist-item-checks">
                  <label>
                    <input
                      type="radio"
                      name={`response-${index}`}
                      value="yes"
                      checked={item.response === "yes"}
                      onChange={() => handleChange(index, "response", "yes")}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`response-${index}`}
                      value="no"
                      checked={item.response === "no"}
                      onChange={() => handleChange(index, "response", "no")}
                    />{" "}
                    No
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`response-${index}`}
                      value="na"
                      checked={item.response === "na"}
                      onChange={() => handleChange(index, "response", "na")}
                    />{" "}
                    N/A
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="checklist-item-remarks">
            <Form
              label="Remarks"
              type="text"
              name="remarks"
              value={remarks}
              onChange={handleRemarksChange}
              required={true}
              error={errors.remarks}
            />
          </div>
          <div className="checklist-footer">
            <FormFooter
              onSave={handleFormSubmit}
              onCancel={() => onClose()}
              saveLabel="Save"
              cancelLabel="Cancel"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateChecklist;
