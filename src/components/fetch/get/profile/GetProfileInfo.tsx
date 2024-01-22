import Loading from "@/components/helper/Loading";
import axios from "axios";
import React, { ReactNode, useEffect, useState } from "react";

interface UserDataFetcherProps {
  children: ReactNode;
}

const UserDataFetcher: React.FC<UserDataFetcherProps> = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/profile");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    React.cloneElement(children as React.ReactElement, { userData })
  );
};

export default UserDataFetcher;
