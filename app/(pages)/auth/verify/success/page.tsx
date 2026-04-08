import { CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8 bg-linear-to-br from-background via-background to-accent/5'>
      <div className='w-full max-w-md space-y-8'>
        {/* Return Navigation */}
        <Link href='/auth/signin'>
          <Button
            variant='ghost'
            size='sm'
            className='gap-2 text-muted-foreground hover:text-foreground transition-colors'
          >
            <ChevronLeft className='w-4 h-4' />
            Back To Login
          </Button>
        </Link>

        {/* Success Card */}
        <div className='space-y-6 text-center'>
          {/* Icon */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute inset-0 bg-accent/20 rounded-full blur-xl' />
              <div className='relative bg-linear-to-br from-accent to-accent/80 rounded-full p-4 ring-1 ring-accent/30'>
                <CheckCircle2 className='w-12 h-12 text-accent-foreground' />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='space-y-3'>
            <h1 className='text-4xl font-bold tracking-tight text-balance'>
              Verification sent!
            </h1>
            <p className='text-lg text-muted-foreground text-balance'>
              Success! You have re-sent a verification link to your email.
            </p>
          </div>

          {/* Additional Info */}
          <div className='bg-card border border-border rounded-lg p-4 space-y-2 text-sm'>
            <p className='text-muted-foreground'>
              <span className='font-semibold text-foreground'>
                Check your inbox
              </span>{' '}
              for the verification email and click the link to complete your
              verification.
            </p>
            <p className='text-muted-foreground'>
              If you don't see it, check your spam folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
