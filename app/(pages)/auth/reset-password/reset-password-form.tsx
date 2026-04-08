'use client';

import { Check, Eye, EyeOff, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword } from '@/lib/auth-client';

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const passwordStrength = {
    length: password.length >= 6,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const isStrongPassword = strengthScore >= 3;
  const passwordsMatch = password === confirmPassword && password.length > 0;

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    if (!password) {
      return toast.error('Please enter your new password.');
    }

    if (!isStrongPassword) {
      return toast.error(
        'Password must be at least 6 characters with a mix of uppercase, lowercase, numbers, and symbols.',
      );
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    await resetPassword({
      newPassword: password,
      token,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'Failed to reset password');
        },
        onSuccess: () => {
          toast.success('Password reset successfully!');
          router.push('/auth/signin');
        },
      },
    });
  }

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      {/* New Password Field */}
      <div className='space-y-3'>
        <Label htmlFor='password' className='font-medium'>
          New Password
        </Label>
        <div className='relative'>
          <Input
            type={showPassword ? 'text' : 'password'}
            id='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter a strong password'
            className='pr-10'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        </div>

        {password && (
          <div className='space-y-2'>
            <div className='grid grid-cols-2 gap-2 text-xs'>
              <div className='flex items-center gap-2'>
                {passwordStrength.length ? (
                  <Check className='h-4 w-4 text-green-600 dark:text-green-400' />
                ) : (
                  <X className='h-4 w-4 text-destructive' />
                )}
                <span
                  className={
                    passwordStrength.length
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-destructive'
                  }
                >
                  At least 6 characters
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {passwordStrength.hasUpper ? (
                  <Check className='h-4 w-4 text-green-600 dark:text-green-400' />
                ) : (
                  <X className='h-4 w-4 text-destructive' />
                )}
                <span
                  className={
                    passwordStrength.hasUpper
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-destructive'
                  }
                >
                  Uppercase letter
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {passwordStrength.hasLower ? (
                  <Check className='h-4 w-4 text-green-600 dark:text-green-400' />
                ) : (
                  <X className='h-4 w-4 text-destructive' />
                )}
                <span
                  className={
                    passwordStrength.hasLower
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-destructive'
                  }
                >
                  Lowercase letter
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {passwordStrength.hasNumber ? (
                  <Check className='h-4 w-4 text-green-600 dark:text-green-400' />
                ) : (
                  <X className='h-4 w-4 text-destructive' />
                )}
                <span
                  className={
                    passwordStrength.hasNumber
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-destructive'
                  }
                >
                  Number
                </span>
              </div>
            </div>

            {/* Strength bar */}
            <div className='w-full bg-muted rounded-full h-2 overflow-hidden'>
              <div
                className={`h-full transition-all duration-300 ${
                  strengthScore <= 2
                    ? 'w-1/3 bg-destructive'
                    : strengthScore === 3
                      ? 'w-2/3 bg-yellow-500 dark:bg-yellow-600'
                      : 'w-full bg-green-600 dark:bg-green-500'
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className='space-y-3'>
        <Label htmlFor='confirmPassword' className='font-medium'>
          Confirm Password
        </Label>
        <div className='relative'>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            id='confirmPassword'
            name='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Re-enter your password'
            className='pr-10'
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
          >
            {showConfirmPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        </div>

        {confirmPassword && (
          <div className='flex items-center gap-2 text-xs'>
            {passwordsMatch ? (
              <>
                <Check className='h-4 w-4 text-green-600 dark:text-green-400' />
                <span className='text-green-600 dark:text-green-400'>
                  Passwords match
                </span>
              </>
            ) : (
              <>
                <X className='h-4 w-4 text-destructive' />
                <span className='text-destructive'>Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        disabled={isPending || !isStrongPassword || !passwordsMatch}
        className='w-full'
        size='lg'
      >
        {isPending ? 'Resetting password...' : 'Reset Password'}
      </Button>

      {/* Info text */}
      <p className='text-xs text-muted-foreground text-center'>
        This is a secure connection. Your password will never be shared or
        stored in plain text.
      </p>
    </form>
  );
};
