import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import ComputingPost from './ComputingPost';
import Featured from './Featured';
import ProgrammingPost from './ProgrammingPost';
import RecentPost from './RecentPost';
import WriteForUsCTA from './WriteFoUsCTA';

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
