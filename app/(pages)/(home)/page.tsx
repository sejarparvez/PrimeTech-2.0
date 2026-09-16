import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Featured from './Featured';
import RecentPost from './RecentPost';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className='pb-10 md:pb-16'>
        <Featured />
        <RecentPost />
      </main>
      <Footer />
    </>
  );
}
