'use client';

import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
// Import UI components from the first example's design
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

// Import the functionality from the second example
import { sendVerificationEmail } from '@/lib/auth-client';

export function SendVerificationEmailForm() {
  const router = useRouter();

  // State variables for the design and error handling
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Renamed isPending to loading for consistency with design
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    await sendVerificationEmail({
      email,
      callbackURL: '/auth/verify',
      fetchOptions: {
        onRequest: () => {
          // Handled by our local state
        },
        onResponse: () => {
          // Handled by our local state
        },
        onError: (ctx) => {
          // Use the component's state to show the styled error message
          const errorMessage =
            ctx.error.message || 'Failed to send verification email.';
          setError(errorMessage);
          toast.error(errorMessage); // Keep the sonner toast for consistency
        },
        onSuccess: () => {
          // Use the component's state to show the styled success message
          setSuccess(true);
          // Keep the sonner toast
          toast.success('Verification email sent successfully.');

          // Clear email input after success
          setEmail('');

          // Redirect the user as in the original component
          router.push('/auth/verify/success');
        },
      },
    });
    // --- END FUNCTIONALITY ---

    setLoading(false);
    // Note: The success state is handled within onSuccess/onError callbacks for reliability.

    // Auto-hide success message after 5 seconds if we didn't redirect
    // (We removed this since you are redirecting on success)
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {/* 🟢 Success Alert (from first component's design) */}
      {success && (
        <div className='bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300'>
          <CheckCircle2 className='h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5' />
          <div className='flex-1'>
            <p className='text-sm font-semibold text-emerald-900 dark:text-emerald-200'>
              Verification email sent successfully!
            </p>
            <p className='text-xs text-emerald-700 dark:text-emerald-300 mt-1'>
              Check your inbox and follow the link to verify your email address
            </p>
          </div>
        </div>
      )}

      {/* 🔴 Error Alert (from first component's design) */}
      {error && (
        <div className='bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300'>
          <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5' />
          <div className='flex-1'>
            <p className='text-sm font-semibold text-red-800 dark:text-red-200'>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Email Input Field */}
      <div className='space-y-2.5'>
        <Label
          htmlFor='email'
          className='text-sm font-semibold text-foreground tracking-tight'
        >
          Email Address
        </Label>
        <div className='relative group'>
          <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary' />
          <Input
            id='email'
            type='email'
            name='email' // Added name attribute for form data submission (though not strictly needed with state)
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || success}
            className='pl-10 bg-input border-border hover:border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all'
          />
        </div>
      </div>

      {/* Submit Button with States */}
      <Button
        type='submit'
        disabled={loading || success}
        className='w-full bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground font-semibold shadow-sm hover:shadow-md transition-all duration-200'
        size='lg'
      >
        {loading ? (
          <span className='flex items-center gap-2'>
            <Spinner className='h-4 w-4' />
            Sending...
          </span>
        ) : success ? (
          <span className='flex items-center gap-2'>
            <CheckCircle2 className='h-4 w-4' />
            Sent Successfully
          </span>
        ) : (
          <span className='flex items-center gap-2'>
            <Mail className='h-4 w-4' />
            Resend Verification Email
          </span>
        )}
      </Button>

      {/* Hint Text */}
      <p className='text-xs text-muted-foreground text-center pt-2 leading-relaxed'>
        Check your spam or promotions folder if you don{"'"}t see the email
        within a few minutes
      </p>
    </form>
  );
}
