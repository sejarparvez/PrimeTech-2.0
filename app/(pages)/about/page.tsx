import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'About | PrimeTech',
  description: 'Learn more about PrimeTech and our mission.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className='container mx-auto min-h-screen px-4 py-10 md:py-16 md:px-0'>
        <div className='mx-auto max-w-3xl space-y-1 text-center'>
          <h1 className='text-3xl font-extrabold italic tracking-tight md:text-6xl'>
            About PrimeTech
          </h1>
          <p className='text-muted-foreground'>
            Stories, guides, and insights on programming, computing, and tech.
          </p>
        </div>

        <Card className='mx-auto mt-10 max-w-3xl md:mt-16'>
          <CardContent className='space-y-4 p-6 sm:p-10'>
            <p className='leading-relaxed'>
              PrimeTech is a community-driven tech publication. We cover
              programming guides, laptops and computers, and practical tutorials
              written by developers, for developers.
            </p>
            <p className='leading-relaxed text-muted-foreground'>
              Our mission is simple: make complex technology easy to understand.
              Whether you are picking your first laptop, learning your first
              programming language, or leveling up your stack, you will find
              something useful here.
            </p>
            <p className='leading-relaxed text-muted-foreground'>
              Want to contribute? Head over to the dashboard and share your
              knowledge with thousands of readers.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
