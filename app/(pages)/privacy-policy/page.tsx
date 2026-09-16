import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Privacy Policy | PrimeTech',
  description: 'How PrimeTech collects and uses your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className='container mx-auto min-h-screen px-4 py-10 md:py-16 md:px-0'>
        <div className='mx-auto max-w-3xl space-y-1 text-center'>
          <h1 className='text-3xl font-extrabold tracking-tight md:text-5xl'>
            Privacy Policy
          </h1>
          <p className='text-muted-foreground'>Last updated: 2026</p>
        </div>

        <Card className='mx-auto mt-10 max-w-3xl md:mt-16'>
          <CardContent className='prose dark:prose-invert max-w-none space-y-4 p-6 sm:p-10'>
            <p>
              PrimeTech respects your privacy. This page explains what data we
              collect and how we use it.
            </p>
            <h2>Information we collect</h2>
            <p>
              When you create an account, we store your name, email address, and
              profile image. When you subscribe to our newsletter, we store your
              email address. When you read articles, we record anonymous view
              counts.
            </p>
            <h2>How we use it</h2>
            <p>
              Your data is used to operate the site: signing you in, showing
              your profile on articles and comments you write, and sending
              newsletters you subscribed to. We do not sell your personal
              information.
            </p>
            <h2>Cookies</h2>
            <p>
              We use cookies to keep you signed in and remember your theme
              preference. You can disable cookies in your browser, but parts of
              the site may stop working.
            </p>
            <h2>Your rights</h2>
            <p>
              You can update your profile at any time from your dashboard, and
              you can contact us to request deletion of your account and
              personal data.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
