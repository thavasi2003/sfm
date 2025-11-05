// import { useState } from "react";
// import {
//   Button,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
// } from "@mui/material";
// import { CloudUpload, Delete } from "@mui/icons-material";

// const ImageField= ({props}) => {
//   const [imagePreview, setImagePreview] = useState<string | null>(
//     value || null
//   );
//   const [openDialog, setOpenDialog] = useState(false);

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files[0]) {
//       const file = files[0];
//       const reader = new FileReader();
//       reader.onload = () => {
//         const imageUrl = reader.result as string;
//         setImagePreview(imageUrl);
//         onChange?.(imageUrl); // Notify parent component
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageDelete = () => {
//     setImagePreview(null);
//     onChange?.(null); // Notify parent component
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//   };

//   const handleDialogOpen = () => {
//     setOpenDialog(true);
//   };

//   // const fieldError = props.error?.[props.data.fieldName!]; // Get specific error message

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//       <TextField
//         label={label}
//         variant="outlined"
//         disabled={readonly || disabled}
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
//                   onChange={handleImageUpload}
//                   disabled={disabled}
//                   required={required}
//                 />
//               </IconButton>
//             ),
//           },
//         }}
//         {...rest}
//       />

//       {imagePreview && (
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <img
//             src={imagePreview}
//             alt="Preview"
//             style={{
//               width: "100px",
//               height: "100px",
//               objectFit: "cover",
//               borderRadius: "4px",
//             }}
//           />
//           <IconButton
//             color="error"
//             onClick={handleImageDelete}
//             disabled={readonly || disabled}
//             aria-label="Delete Image"
//           >
//             <Delete />
//           </IconButton>
//         </div>
//       )}

//       <Button
//         variant="outlined"
//         onClick={handleDialogOpen}
//         disabled={!imagePreview}
//         color="secondary"
//         size="small"
//       >
//         View Full Image
//       </Button>

//       <Dialog open={openDialog} onClose={handleDialogClose}>
//         <DialogTitle>Image Preview</DialogTitle>
//         <DialogContent>
//           {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="Dialog Preview"
//               style={{
//                 width: "100%",
//                 borderRadius: "4px",
//               }}
//             />
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default ImageField;
