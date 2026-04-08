import { ChevronLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SendVerificationEmailForm } from './send-verification-email-form';

interface PageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const error = (await searchParams).error;

  if (!error) {
    redirect('/dashboard/my-account');
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-background via-background to-accent/5 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        <div className='relative mb-8'>
          <div className='absolute inset-0 bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl' />

          <div className='relative space-y-6'>
            {/* Header with back button */}
            <div className='flex items-center gap-3'>
              <Link href='/auth/signin'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-muted-foreground hover:text-foreground hover:bg-muted'
                >
                  <ChevronLeft className='h-5 w-5' />
                </Button>
              </Link>
              <div>
                <h1 className='text-2xl font-bold text-foreground'>
                  Verify Email
                </h1>
                <p className='text-sm text-muted-foreground mt-1'>
                  Complete your account setup
                </p>
              </div>
            </div>

            {/* Main card */}
            <div className='bg-card rounded-xl border border-border shadow-sm p-6 space-y-4'>
              {error && (
                <div className='bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 flex gap-3'>
                  <div className='shrink-0'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30'>
                      {/** biome-ignore lint/a11y/noSvgWithoutTitle: svg */}
                      <svg
                        className='h-5 w-5 text-red-600 dark:text-red-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                      {error.replace(/_/g, ' ').replace(/-/g, ' ')}
                    </p>
                    <p className='text-xs text-red-700 dark:text-red-300 mt-1'>
                      Please request a new verification email below
                    </p>
                  </div>
                </div>
              )}

              {/* Info section */}
              <div className='bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 flex gap-3'>
                <Mail className='h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5' />
                <div>
                  <p className='text-sm font-medium text-blue-900 dark:text-blue-200'>
                    Check your email
                  </p>
                  <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
                    We'll send you a link to verify your email address
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <SendVerificationEmailForm />

            {/* Footer link */}
            <div className='text-center pt-2'>
              <p className='text-sm text-muted-foreground'>
                Already verified?{' '}
                <Link
                  href='/auth/signin'
                  className='text-primary hover:text-primary/80 font-medium transition-colors'
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
