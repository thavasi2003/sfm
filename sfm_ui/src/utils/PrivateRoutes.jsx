import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoutes = () => {
  const authData = sessionStorage.getItem("userdata");
  let isAuthenticated = false;

  if (authData) {
    try {
      const parsedAuthData = JSON.parse(authData);
      const token = parsedAuthData?.token;

      if (token) {
        const { exp } = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        isAuthenticated = exp > currentTime;
      } else {
        console.warn("No token found in userdata.");
      }
    } catch (e) {
      console.error("Failed to decode JWT token:", e);
    }
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
