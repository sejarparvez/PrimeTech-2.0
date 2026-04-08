import { ChevronLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ForgotPasswordForm } from './forgot-password-form';

export default function Page() {
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
                  Forgot Password?
                </h1>
                <p className='text-sm text-muted-foreground mt-1'>
                  No worries, we'll help you reset it
                </p>
              </div>
            </div>

            {/* Main card */}
            <div className='bg-card rounded-xl border border-border shadow-sm p-6 space-y-4'>
              {/* Info section */}
              <div className='bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 flex gap-3'>
                <Lock className='h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5' />
                <div>
                  <p className='text-sm font-medium text-blue-900 dark:text-blue-200'>
                    Secure password reset
                  </p>
                  <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
                    Enter your email and we'll send you a link to reset your
                    password
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <ForgotPasswordForm />

            {/* Footer link */}
            <div className='text-center pt-2'>
              <p className='text-sm text-muted-foreground'>
                Remember your password?{' '}
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
