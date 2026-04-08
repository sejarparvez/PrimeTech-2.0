'use client';

import { AlertCircle, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { requestPasswordReset } from '@/lib/auth-client';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!email.trim()) {
        throw new Error('Please enter a valid email address');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      await requestPasswordReset({
        email,
        redirectTo: '/auth/reset-password',
        fetchOptions: {
          onRequest: () => {
            setLoading(true);
          },
          onResponse: () => {
            setLoading(false);
          },
          onError: (ctx) => {
            setError(ctx.error.message || 'Failed to send reset email');
            toast.error(ctx.error.message || 'Failed to send reset email');
          },
          onSuccess: () => {
            setSuccess(true);
            setEmail('');
            toast.success('Reset link sent to your email successfully.');

            // Auto-hide success message after 7 seconds
            setTimeout(() => setSuccess(false), 7000);
          },
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to send password reset email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto space-y-6'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Forgot Password?</h1>
        <p className='text-muted-foreground'>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      {success && (
        <div className='flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg'>
          <CheckCircle2 className='h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0' />
          <div className='space-y-1 flex-1'>
            <p className='font-medium text-green-900 dark:text-green-100'>
              Reset link sent successfully!
            </p>
            <p className='text-sm text-green-700 dark:text-green-300'>
              Check your inbox for a link to reset your password. It will expire
              in 1 hour.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className='flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg'>
          <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0' />
          <p className='text-sm text-red-700 dark:text-red-300 flex-1'>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email Address</Label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            <Input
              id='email'
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || success}
              className='pl-10 bg-input border-border hover:border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all'
            />
          </div>
        </div>

        <Button
          type='submit'
          className='w-full'
          disabled={loading || success || !email.trim()}
          size='lg'
        >
          {loading ? (
            <>
              <Spinner className='mr-2 h-4 w-4' />
              Sending...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className='mr-2 h-4 w-4' />
              Link Sent
            </>
          ) : (
            <>
              Send Reset Link
              <ArrowRight className='ml-2 h-4 w-4' />
            </>
          )}
        </Button>
      </form>

      <div className='text-center'>
        <p className='text-sm text-muted-foreground'>
          The password reset link will expire in 1 hour. Check your spam folder
          if you don't see the email.
        </p>
      </div>

      <div className='text-center'>
        <Button
          variant='link'
          onClick={() => router.push('/auth/login')}
          className='text-sm'
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}
