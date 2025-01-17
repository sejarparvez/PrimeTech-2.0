import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ComputingPost from "@/components/pages/home/ComputingPost";
import Featured from "@/components/pages/home/Featured";
import ProgrammingPost from "@/components/pages/home/ProgrammingPost";
import RecentPost from "@/components/pages/home/RecentPost";
import WriteForUsCTA from "@/components/pages/home/WriteFoUsCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Featured />
        <RecentPost />
        <ProgrammingPost />
        <ComputingPost />
        <WriteForUsCTA />
      </main>
      <Footer />
    </>
  );
}
