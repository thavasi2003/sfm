import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../../../../services/service";
import "./SignOffHistory.css";

const SignOffHistory = ({ row }) => {
  const [data, setData] = useState([]);
  const [appId, setAppId] = useState(null);
  const [createdOn, setCreatedOn] = useState(null);

  const headers = [
    { key: "statusName", label: "Status" },
    { key: "displayName", label: "Processed by" },
    { key: "processedAt", label: "Processed at" },
    { key: "signOff_remarks", label: "Remarks" },
    {
      key: "signature",
      label: "Signature",
      render: (value) => {
        if (value) {
          const isValidBase64 = value.startsWith("data:image/png;base64,");
          return isValidBase64 ? (
            <img
              src={value}
              alt="Signature"
              style={{ width: "200px", height: "auto" }}
            />
          ) : (
            "Invalid Signature Data"
          );
        }
        return "No Signature";
      },
    },
  ];

  const getSignOffHistoryData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/ptw/signOff/history/${row.appId}`
      );
      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        setData(response.data.data);
        setAppId(response.data.data[0].appId);
        setCreatedOn(response.data.data[0].createdOn);
      }
    } catch (err) {
      console.error("Error fetching sign off history:", err);
    }
  }, [row.appId]);

  useEffect(() => {
    getSignOffHistoryData();
  }, [getSignOffHistoryData]);

  const Table = ({ data, headers }) => {
    return (
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header.key}>
                  {header.render
                    ? header.render(row[header.key])
                    : row[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="signoff-history-container">
      <div className="signoff-history-header">
        <div className="signoff-history-appid">
          <span className="signoff-history-appid-text">Application ID:</span>
          <span className="signoff-history-appid-value">{appId}</span>
        </div>
        <div className="signoff-history-createdon">
          <span className="signoff-history-createdon-text">Created At:</span>
          <span className="signoff-history-createdon-value">{createdOn}</span>
        </div>
      </div>
      <div className="signoff-history-table">
        <Table data={data} headers={headers} />
      </div>
    </div>
  );
};

export default SignOffHistory;
