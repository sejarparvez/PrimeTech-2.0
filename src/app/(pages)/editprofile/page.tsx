"use client";
import Loading from "@/components/helper/Loading";
import AccountTab from "@/components/pages/editprofile/AccountTab";
import MoreTab from "@/components/pages/editprofile/MoreTab";
import PasswordTab from "@/components/pages/editprofile/PasswordTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    bio: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    github: "",
  });
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      await router.prefetch("/login");

      if (status === "loading") {
        return;
      }

      if (!session) {
        router.push("/login");
      }
    };

    redirectUser();
  }, [session, status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get("/api/editprofile/account");
        setUserData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-24 flex items-center justify-center">
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <AccountTab name={userData.name} email={userData.email} />
            </TabsContent>
            <TabsContent value="password">
              <PasswordTab />
            </TabsContent>
            <TabsContent value="more">
              <MoreTab
                bio={userData.bio}
                facebook={userData.facebook}
                twitter={userData.twitter}
                linkedin={userData.linkedin}
                instagram={userData.instagram}
                github={userData.github}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}
