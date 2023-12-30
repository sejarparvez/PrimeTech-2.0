import LeftSidebar from "@/components/layout/LeftSidebar";
import Navbar from "@/components/layout/Navbar";
import RightSidebar from "@/components/layout/RightSidebar";

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
          <main className="min-h-screen w-10/12 border-r">Hello World!</main>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
