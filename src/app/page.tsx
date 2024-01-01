import LeftSidebar from "@/components/layout/LeftSidebar";
import Navbar from "@/components/layout/Navbar";
import RightSidebar from "@/components/layout/RightSidebar";
import Featured from "@/components/pages/home/Featured";
import RecentPost from "@/components/pages/home/RecentPost";

export default function Home() {
  return (
    <div className="flex">
      <div className="w-20">
        <LeftSidebar />
      </div>
      <div className="w-full border-l">
        <Navbar />
        <div className="grid grid-cols-12">
          <div className="col-span-9 border-r px-4 pt-4">
            <Featured />
            <RecentPost />
          </div>
          <div className="col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
