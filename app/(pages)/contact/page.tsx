'use client';

import { Mail, Send } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { toast } from 'sonner';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    const subject = encodeURIComponent(`Contact from ${name} (${email})`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:hello@primetech.dev?subject=${subject}&body=${body}`;
    toast.success('Opening your email app...');
  };

  return (
    <>
      <Navbar />
      <main className='container mx-auto min-h-screen px-4 py-10 md:py-16 md:px-0'>
        <div className='mx-auto max-w-3xl space-y-1 text-center'>
          <h1 className='text-3xl font-extrabold italic tracking-tight md:text-6xl'>
            Contact Us
          </h1>
          <p className='text-muted-foreground'>
            Questions, feedback, or partnership ideas? We would love to hear
            from you.
          </p>
        </div>

        <div className='mx-auto mt-10 grid max-w-3xl gap-6 md:mt-16'>
          <Card>
            <CardContent className='flex items-center gap-4 p-6'>
              <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
                <Mail className='text-primary h-6 w-6' />
              </div>
              <div>
                <p className='text-sm font-bold'>Email us directly</p>
                <a
                  href='mailto:hello@primetech.dev'
                  className='text-primary text-sm hover:underline'
                >
                  hello@primetech.dev
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6 sm:p-8'>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <Input
                    placeholder='Your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    type='email'
                    placeholder='Your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder='Your message...'
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type='submit' size='lg' className='w-full sm:w-auto'>
                  <Send className='mr-2 h-4 w-4' />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
