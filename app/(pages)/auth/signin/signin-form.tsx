'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

// Login schema
const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationLink, setShowVerificationLink] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form;

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.status === 401) {
          toast.error('Invalid credentials', {
            description: 'Please check your email and password.',
          });
          setError('email', {
            type: 'manual',
            message: ' ',
          });
          setError('password', {
            type: 'manual',
            message: 'Invalid email or password',
          });
        } else if (error.status === 404) {
          toast.error('Account not found', {
            description: 'No account found with this email address.',
          });
          setError('email', {
            type: 'manual',
            message: 'No account found with this email',
          });
        } else if (error.status === 403) {
          toast.error('Email Not Verified', {
            description: 'Please verify your email address before logging in.',
          });
          setShowVerificationLink(true);
        } else {
          toast.error('Login failed', {
            description:
              error.message || 'Something went wrong. Please try again.',
          });
        }
        return;
      }

      toast.success('Welcome back!', {
        description: 'Redirecting you to your Profile...',
      });

      router.push('/dashboard/my-account');
    } catch (_err) {
      toast.error('Unexpected error', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(provider: 'google' | 'facebook') {
    setIsLoading(true);

    try {
      await signIn.social({
        provider: provider,
        callbackURL: '/dashboard/my-account',
        errorCallbackURL: '/auth/error',
      });

      // 2. Add a success toast for initiating the redirect/sign-in process
      toast.success(
        `Redirecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
        {
          description:
            'Please complete the sign-in process in the pop-up or new tab.',
          duration: 2000,
        },
      );
    } catch (_err) {
      // 3. Improved Error Toast
      const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

      toast.error(`Sign-in Failed via ${providerName}`, {
        description:
          'There was an issue initiating the connection. Please check your network and try again.',
      });
    } finally {
      // It's crucial to set isLoading to false ONLY if the sign-in redirection fails
      // immediately in the try/catch block. If the sign-in succeeds and redirects,
      // the new page load handles resetting the state. We keep it here just in case
      // the catch block is hit.
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8' onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Welcome back</h1>
                <p className='text-muted-foreground text-balance'>
                  Login to your BestSlot account
                </p>
              </div>

              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  autoComplete='email'
                  disabled={isLoading}
                  {...register('email')}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              {/* Password Field */}
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <Link
                    href='/auth/forgot-password'
                    className='ml-auto text-sm underline-offset-2 hover:underline'
                    tabIndex={-1}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    disabled={isLoading}
                    className='pr-10'
                    {...register('password')}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                    <span className='sr-only'>
                      {showPassword ? 'Hide' : 'Show'} password
                    </span>
                  </Button>
                </div>
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>

              {showVerificationLink && (
                <div className='bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 flex gap-3 items-baseline'>
                  <Info className='h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5' />
                  <span className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
                    Don't have the verification link?
                  </span>
                  <Link
                    href='/auth/verify?error=lost-verification-email'
                    className='text-primary font-bold text-sm whitespace-nowrap shrink-0'
                  >
                    Send Again
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <Field>
                <Button type='submit' disabled={isLoading} className='w-full'>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Field>

              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                Or continue with
              </FieldSeparator>

              {/* Social Login Buttons */}
              <Field className='grid grid-cols-1 gap-4'>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                >
                  <svg
                    className='mr-2 h-4 w-4'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                  >
                    <title>Google</title>
                    <path
                      d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                      fill='currentColor'
                    />
                  </svg>
                  Google
                </Button>
              </Field>

              <FieldDescription className='text-center'>
                Don&apos;t have an account?{' '}
                <Link
                  href='/auth/signup'
                  className='font-medium underline underline-offset-4 hover:text-primary'
                >
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Side Image */}
          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/placeholder.svg'
              alt='Login illustration'
              height={600}
              width={600}
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Privacy */}
      <FieldDescription className='px-6 text-center text-xs'>
        By clicking continue, you agree to our{' '}
        <Link
          href='/terms'
          className='underline underline-offset-4 hover:text-primary'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='/privacy'
          className='underline underline-offset-4 hover:text-primary'
        >
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
