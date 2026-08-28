import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Featured from './Featured';
import RecentPost from './RecentPost';
import WriteForUsCTA from './WriteFoUsCTA';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Featured />
        <RecentPost />
        <WriteForUsCTA />
      </main>
      <Footer />
    </>
  );
}