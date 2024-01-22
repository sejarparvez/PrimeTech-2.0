import RightSidebar from "@/components/layout/rightsidebar/RightSidebar";
import Featured from "@/components/pages/home/Featured/Featured";
import RecentPost from "@/components/pages/home/RecentPost";

export default function Home() {
  return (
    <div>
      <div className="md:grid md:grid-cols-24 lg:flex">
        <div className="col-span-22 w-full border-l">
          <div className="lg:grid lg:grid-cols-48">
            <div className="col-span-37 border-r px-4 pt-4">
              <Featured />
              <RecentPost />
            </div>
            <div className="col-span-11">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
