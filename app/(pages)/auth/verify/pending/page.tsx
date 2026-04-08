import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PendingVerification() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        {/* Background blur effect */}
        <div className='absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-3xl opacity-50' />

        <div className='relative space-y-6'>
          {/* Icon section */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg' />
              <div className='relative h-20 w-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center'>
                <Mail className='h-10 w-10 text-primary-foreground' />
              </div>
            </div>
          </div>

          {/* Main card */}
          <div className='bg-card rounded-2xl border border-border shadow-lg p-8 space-y-6'>
            {/* Heading */}
            <div className='space-y-2 text-center'>
              <h1 className='text-3xl font-bold text-foreground'>
                Check your email
              </h1>
              <p className='text-base text-muted-foreground leading-relaxed'>
                We've sent a verification link to your email address. Please
                click it to complete your account setup.
              </p>
            </div>

            {/* Info section with steps */}
            <div className='bg-accent/5 border border-accent/20 rounded-xl p-5 space-y-4'>
              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                    <span className='text-sm font-semibold text-primary'>
                      1
                    </span>
                  </div>
                </div>
                <div>
                  <p className='font-medium text-foreground'>
                    Check your inbox
                  </p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Look for an email from our team
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                    <span className='text-sm font-semibold text-primary'>
                      2
                    </span>
                  </div>
                </div>
                <div>
                  <p className='font-medium text-foreground'>Click the link</p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Follow the verification link inside
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-shrink-0'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                    <span className='text-sm font-semibold text-primary'>
                      3
                    </span>
                  </div>
                </div>
                <div>
                  <p className='font-medium text-foreground'>You're all set</p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Your account will be activated
                  </p>
                </div>
              </div>
            </div>

            {/* Tips section */}
            <div className='bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 space-y-2'>
              <p className='text-xs font-semibold text-blue-900 dark:text-blue-200 uppercase tracking-wide'>
                Pro tip
              </p>
              <p className='text-sm text-blue-800 dark:text-blue-300'>
                If you don't see the email, check your spam or junk folder.
              </p>
            </div>

            {/* Action buttons */}
            <div className='space-y-3 flex w-full justify-between pt-2'>
              <Link href='/' className='block'>
                <Button className='w-full h-11 text-base font-medium'>
                  Go to Home
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>

              <Link href='/auth/signin' className='block'>
                <Button
                  variant='outline'
                  className='w-full h-11 bg-transparent'
                >
                  Back to Sign In
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer text */}
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>
              Didn't receive it?{' '}
              <Link
                href='/auth/verify'
                className='text-primary hover:text-primary/80 font-medium transition-colors'
              >
                Request a new link
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
