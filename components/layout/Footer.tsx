'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Briefcase, Send } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';

const FormSchema = z.object({
  email: z.string().email(),
});

export default function Footer() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.loading('Please wait...');
    try {
      const response = await axios.post('/api/dashboard/subscribe', {
        email: data.email,
      });
      toast.dismiss();

      if (response.status === 200) {
        toast.dismiss();
        toast.success('Successfully subscribed!');
        form.reset();
      } else if (response.status === 409) {
        toast.dismiss();
        toast.info('Email already in use');
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(`${error.response.data.message}`);
    }
  }
  return (
    <footer className="mt-20 bg-linear-to-tl from-primary/10 via-primary/5 to-background px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="flex flex-col items-center text-center lg:col-span-2 lg:items-start lg:text-left">
            <h2 className="mb-4 text-3xl font-bold text-primary">
              MHN Graphics
            </h2>
            <p className="mb-6 max-w-xs text-muted-foreground">
              Transforming ideas into visual masterpieces. Your vision, our
              expertise.
            </p>
            <div className="mb-6 flex space-x-4">
              {[
                {
                  icon: FaFacebook,
                  label: 'Facebook',
                  href: 'https://www.facebook.com/www.md.mohon',
                },
                {
                  icon: FaTwitter,
                  label: 'Twitter',
                  href: 'https://www.twitter.com/mohongraphics',
                },
                {
                  icon: FaInstagram,
                  label: 'Instagram',
                  href: 'https://www.instagram.com/mohongraphics',
                },
                {
                  icon: FaLinkedin,
                  label: 'LinkedIn',
                  href: 'https://linkedin.com/in/mohongraphics',
                },
                {
                  icon: FaGithub,
                  label: 'GitHub',
                  href: 'https://www.github.com/mohon01',
                },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
            <Button size="lg">
              <Link href="/contact" className="flex items-center gap-2">
                <Briefcase className="mr-2 h-4 w-4" /> Hire Me
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-3">
            <nav className="space-y-4">
              <h3 className="text-lg font-semibold">Services</h3>
              <ul className="space-y-2">
                {[
                  'Branding',
                  'Web Design',
                  'Print Design',
                  'Motion Graphics',
                ].map((service) => (
                  <li key={service}>
                    <Link
                      href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {service}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    className="text-muted-foreground transition-colors hover:text-primary"
                    href={'/services/ui-ux'}
                  >
                    UI/UX
                  </Link>
                </li>
              </ul>
            </nav>
            <nav className="space-y-4">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                {['About', 'Portfolio', 'Careers', 'Blog', 'Contact'].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href={`/${item.toLowerCase()}`}
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
            <nav className="space-y-4">
              <h3 className="text-lg font-semibold">Jobs</h3>
              <ul className="space-y-2">
                {[
                  'Graphic Designer',
                  'UI/UX Designer',
                  'Web Developer',
                  'Motion Designer',
                  'Internships',
                ].map((job) => (
                  <li key={job}>
                    <Link
                      href={`/jobs/${job.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {job}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <h3 className="mb-4 text-center text-lg font-semibold">
            Stay Inspired
          </h3>
          <p className="mb-4 text-center text-muted-foreground">
            Join our newsletter for the latest design trends and exclusive
            offers.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto max-w-md"
            >
              <div className="mx-auto flex w-full justify-center gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email Address"
                          aria-label="Email for newsletter"
                          className="border-primary/20 bg-background/50 pr-10 backdrop-blur-xs focus:border-primary md:min-w-80"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <Separator className="my-8 bg-primary/20" />

        <div className="flex flex-col items-center justify-between text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} PrimeTech. All rights reserved.</p>
          <nav className="mt-4 flex flex-wrap justify-center space-x-4 sm:mt-0 sm:space-x-6">
            {[
              'Privacy Policy',
              'Terms of Service',
              'Cookie Policy',
              'Sitemap',
            ].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="transition-colors hover:text-primary"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
