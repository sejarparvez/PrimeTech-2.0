import Loading from "@/components/helper/Loading";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface UserData {
  // Replace these fields with the actual structure of your user data
  id: string;
  name: string;
  email: string;
}

interface UserDataFetcherProps {
  children: React.ReactElement<{ userData: UserData | null }>;
}

const UserDataFetcher: React.FC<UserDataFetcherProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>("/api/profile");
        setUserData(response.data);
        setError(null); // Clear any previous error
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  return React.isValidElement(children)
    ? React.cloneElement(children, { userData })
    : null;
};

export default UserDataFetcher;
