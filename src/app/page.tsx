import LeftSidebar from "@/components/layout/LeftSidebar";
import Navbar from "@/components/layout/Navbar";
import RightSidebar from "@/components/layout/RightSidebar";
import Featured from "@/components/pages/home/Featured";

export default function Home() {
  return (
    <div className="flex">
      <section>
        <LeftSidebar />
      </section>
      <div className="flex min-h-screen w-full flex-col border-l">
        <div>
          <Navbar />
        </div>
        <div className="flex">
          <main className="min-h-screen w-[72%] border-r">
            <Featured />
          </main>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
