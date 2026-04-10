'use client';

import { Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import ThemeSwitch from './ThemeSwitch';
import { UserMenu } from './UserMenu';

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Articles', href: '/articles' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  // --- Hydration Fix ---
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center px-4'>
        {/* Mobile Menu - Only rendered after mount to prevent hydration error */}
        <div className='lg:hidden'>
          {mounted ? (
            <Sheet>
              <SheetTrigger className='mr-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle Menu</span>
              </SheetTrigger>
              <SheetContent side='left' className='pr-0'>
                <SheetHeader className='mb-6'>
                  <SheetTitle className='text-left'>PrimeTech</SheetTitle>
                </SheetHeader>
                <nav className='flex flex-col space-y-4'>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-lg font-semibold transition-colors hover:text-primary',
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-muted-foreground',
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            // Static placeholder to prevent layout shift
            <div className='mr-2 h-9 w-9' />
          )}
        </div>

        {/* Logo */}
        <Link href='/'>
          <span className='text-xl font-extrabold text-primary md:mr-16'>
            PrimeTech
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden items-center space-x-6 text-sm font-medium lg:flex'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative py-1 transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary'
                  : 'text-muted-foreground',
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <div
            className={cn(
              'hidden transition-all duration-300 ease-in-out md:block',
              isSearchOpen ? 'w-72 lg:w-96' : 'w-48 lg:w-60',
            )}
          >
            <form onSubmit={(e) => e.preventDefault()} className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search articles...'
                className='w-full bg-muted/50 py-2 pl-9 pr-12 focus-visible:ring-primary'
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
              />
              <Button
                type='submit'
                size='sm'
                className='absolute right-1 top-1 h-7 px-2 text-xs'
              >
                Search
              </Button>
            </form>
          </div>

          <ThemeSwitch />

          {/* User Menu - Check mount here too if it causes issues */}
          {mounted ? (
            <UserMenu />
          ) : (
            <div className='h-8 w-8 rounded-full bg-muted animate-pulse' />
          )}
        </div>
      </div>
    </header>
  );
}
