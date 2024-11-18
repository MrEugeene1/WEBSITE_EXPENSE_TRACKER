import React from "react";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "./context/globalContext";

const PrivateRoute = ({ children }) => {
  const { token } = useGlobalContext();
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
