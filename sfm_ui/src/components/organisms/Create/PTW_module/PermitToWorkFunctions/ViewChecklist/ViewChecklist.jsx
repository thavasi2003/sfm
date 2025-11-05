import { useState, useEffect, useCallback } from "react";
import "./ViewChecklist.css";
import Form from "../../../../../molecules/Form/Form";
import axiosInstance from "../../../../../../services/service";

const ViewChecklist = ({ row }) => {
  const [data, setData] = useState([]);
  const [fields, setFields] = useState({});
  const [remarks, setRemarks] = useState("");

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
            response: item.checkOptions,
          }));
          setData(fetchedData);
          if (fetchedData.length > 0) {
            setFields({
              cName: fetchedData[0].cName,
              checklistId: fetchedData[0].checklistId,
              remarks: fetchedData[0].remarks,
              createdOn: fetchedData[0].createdOn,
            });
            setRemarks(fetchedData[0].remarks);
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

  return (
    <>
      <div className="container-header-checklist">
        <div className="container-header-text-checklist">{fields.cName}</div>
      </div>
      <div className="container-header-text-checklist-header">
        <div className="container-header-id-checklist">
          <span className="container-header-id-checklist-text">
            Checklist ID:
          </span>
          <span className="container-header-id-checklist-value">
            {fields.checklistId}
          </span>
        </div>
        <div className="container-header-text-checklist-createdon">
          <span className="container-header-checklist-createdon-text">
            Created At:
          </span>
          <span className="container-header-checklist-createdon-value">
            {fields.createdOn}
          </span>
        </div>
      </div>
      <div className="checklist-form">
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
                    readOnly
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`response-${index}`}
                    value="no"
                    checked={item.response === "no"}
                    readOnly
                  />{" "}
                  No
                </label>
                <label>
                  <input
                    type="radio"
                    name={`response-${index}`}
                    value="na"
                    checked={item.response === "na"}
                    readOnly
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
            disabled={true}
            required={true}
          />
        </div>
      </div>
    </>
  );
};

export default ViewChecklist;
