import { Box, Button, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useNavigate } from "react-router-dom";

export const NoDataFoundMessage = () => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      sx={{ color: "gray", py: 20 }}
    >
      <SearchOffIcon sx={{ fontSize: 80, mb: 2, color: "primary.main" }} />
      <Typography>No Data Found</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(0)}>
        Retry
      </Button>
    </Box>
  );
};
