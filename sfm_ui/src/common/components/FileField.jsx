// import { useState } from "react";
// import {
//   IconButton,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Avatar,
//   TextField,
// } from "@mui/material";
// import { Delete, CloudUpload } from "@mui/icons-material";

// const FileField = ({ props }) => {
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [previews, setPreviews] = useState<string[]>([]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const fileArray = Array.from(files);

//       // Generate previews for files
//       const filePreviews = fileArray.map((file) => URL.createObjectURL(file));

//       setSelectedFiles((prevFiles) => {
//         const newFiles = multiple ? [...prevFiles, ...fileArray] : fileArray;
//         onFilesChange?.(newFiles); // Notify parent component of the files
//         return newFiles;
//       });

//       setPreviews((prevPreviews) => {
//         const newPreviews = multiple
//           ? [...prevPreviews, ...filePreviews]
//           : filePreviews;
//         return newPreviews;
//       });
//     }
//   };

//   const handleDeleteFile = (fileToDelete: File, index: number) => {
//     setSelectedFiles((prevFiles) => {
//       const updatedFiles = prevFiles.filter((file) => file !== fileToDelete);
//       onFilesChange?.(updatedFiles); // Notify parent component of the files
//       return updatedFiles;
//     });

//     setPreviews((prevPreviews) => {
//       const updatedPreviews = prevPreviews.filter((_, i) => i !== index);
//       return updatedPreviews;
//     });
//   };

//   // const fieldError = props.error?.[props.data.fieldName!]; // Get specific error message

//   return (
//     <div style={{ marginTop: "1rem", ...customStyles }}>
//       <TextField
//         variant="outlined"
//         size="small"
//         label={label}
//         slotProps={{
//           input: {
//             startAdornment: (
//               <IconButton
//                 component="label"
//                 disabled={disabled || readonly}
//                 style={{ cursor: "pointer" }}
//               >
//                 <CloudUpload />
//                 <input
//                   type="file"
//                   style={{ display: "none" }}
//                   accept={accept}
//                   multiple={multiple}
//                   onChange={handleFileChange}
//                   disabled={disabled}
//                   required={required}
//                 />
//               </IconButton>
//             ),
//           },
//         }}
//         disabled={disabled || readonly}
//         {...rest}
//       />

//       {/* Display Selected Files */}
//       {selectedFiles.length > 0 && (
//         <List>
//           {selectedFiles.map((file, index) => (
//             <ListItem
//               key={index}
//               secondaryAction={
//                 <IconButton
//                   edge="end"
//                   onClick={() => handleDeleteFile(file, index)}
//                   disabled={disabled || readonly}
//                 >
//                   <Delete />
//                 </IconButton>
//               }
//             >
//               {previews[index] && (
//                 <ListItemAvatar>
//                   <Avatar src={previews[index]} alt={file.name} />
//                 </ListItemAvatar>
//               )}
//               <ListItemText primary={file.name} />
//             </ListItem>
//           ))}
//         </List>
//       )}
//     </div>
//   );
// };

// export default FileField;
