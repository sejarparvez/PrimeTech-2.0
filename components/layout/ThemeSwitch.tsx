'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function ThemeSwitch() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // IMPORTANT: The placeholder must match the final structure as closely as possible.
  // We remove 'disabled' because the server sees it as null, but the client sees it as true.
  if (!mounted) {
    return (
      <Button
        variant='secondary' // Match the variant used below
        size='icon'
        className='h-9 w-9'
      >
        <div className='h-[1.2rem] w-[1.2rem]' />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant='secondary'
      size='icon'
      className='h-9 w-9'
      onClick={toggleTheme}
    >
      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
