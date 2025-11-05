import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axiosInstance from "../../../../../services/service";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

const GeneratePDF = ({ row }) => {
  const generatePDF = async () => {
    try {
      // Fetch checklist data
      const response = await axiosInstance.get(
        `/ptw/checklistPdf/${row.appId}`
      );
      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        const fetchedData = response.data.data.map((item) => ({
          ...item,
          response: item.checkOptions,
        }));

        // Fetch sign-off data
        const signOffResponse = await axiosInstance.get(
          `/ptw/signOffPdf/${row.appId}`
        );
        if (
          signOffResponse.data.status === "success" &&
          Array.isArray(signOffResponse.data.data)
        ) {
          const signOffData = signOffResponse.data.data;

          // Create a temporary div to hold the HTML content
          const tempDiv = document.createElement("div");
          tempDiv.style.position = "absolute";
          tempDiv.style.left = "-9999px";
          tempDiv.style.width = "210mm"; // A4 width
          tempDiv.style.minHeight = "297mm"; // A4 height
          tempDiv.style.padding = "20px";
          tempDiv.style.boxSizing = "border-box";
          tempDiv.style.fontFamily = "Arial, sans-serif";
          tempDiv.style.margin = "0"; // Reset margin to avoid extra spacing
          tempDiv.style.paddingTop = "10px"; // Add top padding for the content

          // Combine checklist and sign-off data into a single HTML structure
          tempDiv.innerHTML = `
            <div>
              <div style="display: flex; align-items:center; justify-content:space-between;">
                <div>
                  <h1>${row.ptName}</h1>
                  <p><strong>Permit To Work ID: ${row.appId}</strong></p>
                </div>
                <div>
                  <img src="./logo.png" alt="Logo" style="width: 100px; height: auto;"/>
                </div>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #000; padding: 8px;">S/N</th>
                    <th style="border: 1px solid #000; padding: 8px;">Description</th>
                    <th style="border: 1px solid #000; padding: 8px;">Checks</th>
                  </tr>
                </thead>
                <tbody>
                  ${fetchedData
                    .map(
                      (item, index) => `
                    <tr>
                      <td style="border: 1px solid #000; padding: 8px;">${
                        index + 1
                      }</td>
                      <td style="border: 1px solid #000; padding: 8px;">${
                        item.description
                      }</td>
                      <td style="border: 1px solid #000; padding: 8px;">${
                        item.response
                          ? item.response.toUpperCase()
                          : "Not Selected"
                      }</td>
                    </tr>
                  `
                    )
                    .join("")}
                  <tr>
                    <td colspan="3" style="border: 1px solid #000; padding: 8px;"><strong>Remarks:</strong> ${
                      fetchedData[0].remarks
                    }</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #000; padding: 8px;"><strong>Processed By:</strong> ${
                      response.data.data[0].updatorName ||
                      response.data.data[0].creatorName
                    }</td>
                    <td style="border: 1px solid #000; padding: 8px;" colspan="2"><strong>Processed At:</strong> ${
                      response.data.data[0].updatedOn ||
                      response.data.data[0].createdon
                    }</td>
                  </tr>
                </tbody>
              </table>
              <br />
              ${signOffData
                .map(
                  (item) => `
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr>
                      <th colspan="2" style="border: 1px solid #000; padding: 8px;">Step ${
                        item.stepNo
                      }: ${item.appStatusName}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="border: 1px solid #000; padding: 8px;" ><strong>Processed By:</strong> ${
                        item.displayName
                      }</td>
                      <td style="border: 1px solid #000; padding: 8px;" colspan="2"><strong>Processed At:</strong> ${
                        item.processedAt
                      }</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #000; padding: 8px;" colspan="2"><strong>Declaration:</strong> ${
                        item.declaration
                      }</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #000; padding: 8px;" colspan="2"><strong>Remarks:</strong> ${
                        item.signOff_remarks
                      }</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #000; padding: 8px;"><strong>Signature:</strong></td>
                      <td style="border: 1px solid #000; padding: 8px;">
                        ${
                          item.signature
                            ? `<img src="${item.signature}" style="width: 500px; height: auto;" />`
                            : ""
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
              `
                )
                .join("")}
            </div>
          `;

          // Append the temporary div to the body
          document.body.appendChild(tempDiv);

          // Use html2canvas to capture the temporary div content
          const canvas = await html2canvas(tempDiv, { scale: 2 });
          const imgData = canvas.toDataURL("image/jpeg", 0.6); // Set quality to 0.6 for compression
          const pdf = new jsPDF("p", "mm", "a4");
          const margin = 10; // 10mm margin
          const topMargin = 10; // Top margin in mm
          const imgWidth = 210 - 2 * margin; // A4 width in mm minus margins
          const pageHeight = 297 - 2 * margin; // A4 height in mm minus margins
          const canvasHeight = canvas.height;
          const imgHeight = (canvasHeight * imgWidth) / canvas.width; // Calculate imgHeight based on the width
          let heightLeft = imgHeight;

          let position = topMargin; // Start position with top margin

          pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            pdf.addPage();
            position = heightLeft - imgHeight;
            pdf.addImage(
              imgData,
              "JPEG",
              margin,
              position + topMargin,
              imgWidth,
              imgHeight
            ); // Add top margin on new pages
            heightLeft -= pageHeight;
          }

          pdf.save(
            `${row.ptName}_PTW${row.appId}_${new Date()
              .toISOString()
              .split("T")[0]
              .split("-")
              .reverse()
              .join("-")}.pdf`
          );

          // Remove the temporary div from the body
          document.body.removeChild(tempDiv);
        }
      }
    } catch (err) {
      console.error("Error fetching checklist data:", err);
    }
  };

  return (
    <div onClick={generatePDF} style={{ cursor: "pointer" }}>
      <PictureAsPdfOutlinedIcon />
    </div>
  );
};

export default GeneratePDF;
