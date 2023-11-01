"use client";
import formatDate from "@/components/helper/FormattedDate";
import Loading from "@/components/helper/Loading";
import ToolTipHookDown from "@/components/helper/ToolTipHookDown";
import RecentPostModel from "@/components/pages/home/RecentPostModel";
import CommentsModel from "@/components/pages/profile/CommentModel";
import PostModel from "@/components/pages/profile/PostModel";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

export default function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    image: null,
    status: "",
    createdAt: "",
    bio: ''
  });
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

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-28 flex flex-col items-center justify-center gap-20">
          <Card className="flex w-11/12 flex-col md:flex-row lg:w-10/12">
            <div className="md:w-4/12">
              {userData.image ? (
                <Image
                  src={userData.image}
                  alt=""
                  className="h-52 w-full rounded-lg object-cover md:h-40 lg:h-80"
                  height={200}
                  width={200}
                />
              ) : (
                <div className="flex h-52 w-full items-center justify-center border text-2xl text-muted-foreground">
                  No Image Found
                </div>
              )}
            </div>
            <div className="md:w-8/12">
              <CardHeader>
                <div className="flex items-center gap-8">
                  <CardTitle className="text-2xl font-extrabold">
                    {userData.name}
                  </CardTitle>
                  <Badge>{userData.status}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div>
                  <div className="flex items-center gap-4">
                    <span>Member Since:</span>
                    <span>{formatDate(userData.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Total Post:</span>
                    <span>9</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Total Comment:</span>
                    <span>19</span>
                  </div>
                </div>
                <div className="mt-3 text-muted-foreground">
                 {userData.bio}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap">
                <div>Connect with me:</div>
                <div className="flex flex-wrap gap-4 pl-4 text-muted-foreground hover:[&>*]:text-foreground">
                  <ToolTipHookDown
                    text="GitHub"
                    icon={<FaFacebook size={20} />}
                  />
                  <ToolTipHookDown
                    text="GitHub"
                    icon={<FaTwitter size={20} />}
                  />
                  <ToolTipHookDown
                    text="GitHub"
                    icon={<FaLinkedin size={20} />}
                  />
                  <ToolTipHookDown
                    text="GitHub"
                    icon={<FaWhatsapp size={20} />}
                  />
                  <ToolTipHookDown
                    text="GitHub"
                    icon={<FaTelegram size={20} />}
                  />
                  <ToolTipHookDown
                    text="GitHub"
                    icon={<FaInstagram size={20} />}
                  />
                </div>
              </CardFooter>
            </div>
          </Card>
          <div className="flex w-11/12 flex-col gap-10 lg:flex-row">
            <Card className="lg:w-9/12">
              <CardHeader className="text-2xl font-extrabold">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span>All Post Published By</span>
                  <span className="text-primary">SEJAR PARVEZ</span>
                </div>
              </CardHeader>
              <div className="mx-2 my-8 grid grid-cols-1 gap-12 md:grid-cols-2">
                <RecentPostModel />
                <RecentPostModel />
                <RecentPostModel />
                <RecentPostModel />
                <RecentPostModel />
                <RecentPostModel />
                <RecentPostModel />
                <RecentPostModel />
              </div>
            </Card>
            <div className="flex flex-col gap-10 md:flex-row lg:w-3/12 lg:flex-col">
              <Card className="h-fit pb-10">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center text-xl underline">
                    All Comments
                  </CardTitle>
                </CardHeader>
                <div className="flex flex-col gap-3">
                  <CommentsModel />
                  <CommentsModel />
                  <CommentsModel />
                  <CommentsModel />
                  <CommentsModel />
                  <CommentsModel />
                </div>
              </Card>
              <Card className="h-fit pb-10">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center text-xl underline">
                    Liked Post
                  </CardTitle>
                </CardHeader>
                <div className="flex flex-col gap-3">
                  <PostModel />
                  <PostModel />
                  <PostModel />
                  <PostModel />
                  <PostModel />
                  <PostModel />
                  <PostModel />
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
