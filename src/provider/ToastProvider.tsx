"use client";

import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientSideToastContainer = () => {
  const { theme } = useTheme(); // Get the current theme (dark or light)

  // Define toast styles based on the theme
  const toastStyle =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme} // Pass the theme prop
        toastClassName={toastStyle} // Apply theme-based class for each toast
      />
    </>
  );
};

export default ClientSideToastContainer;
