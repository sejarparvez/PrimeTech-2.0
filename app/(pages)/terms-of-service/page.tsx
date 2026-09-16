import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Terms of Service | PrimeTech',
  description: 'The rules for using PrimeTech.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className='container mx-auto min-h-screen px-4 py-10 md:py-16 md:px-0'>
        <div className='mx-auto max-w-3xl space-y-1 text-center'>
          <h1 className='text-3xl font-extrabold tracking-tight md:text-5xl'>
            Terms of Service
          </h1>
          <p className='text-muted-foreground'>Last updated: 2026</p>
        </div>

        <Card className='mx-auto mt-10 max-w-3xl md:mt-16'>
          <CardContent className='prose dark:prose-invert max-w-none space-y-4 p-6 sm:p-10'>
            <p>
              By using PrimeTech, you agree to these terms. If you do not agree,
              please do not use the site.
            </p>
            <h2>Content</h2>
            <p>
              Articles are written by community authors. We review content but
              cannot guarantee accuracy. Opinions expressed belong to the
              authors.
            </p>
            <h2>Your account</h2>
            <p>
              You are responsible for activity under your account. Do not share
              your credentials. We may suspend accounts that post spam, abuse,
              or unlawful content.
            </p>
            <h2>Publishing</h2>
            <p>
              By publishing an article, you grant PrimeTech the right to display
              it on the site. You keep ownership of your work and may request
              removal at any time.
            </p>
            <h2>Comments</h2>
            <p>
              Be respectful. Comments that are harassing, hateful, or spam may
              be removed, and repeat offenders may lose commenting privileges.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
