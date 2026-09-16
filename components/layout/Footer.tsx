import Link from 'next/link';

const links = [
  { label: 'Articles', href: '/articles' },
  { label: 'Authors', href: '/authors' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms-of-service' },
];

export default function Footer() {
  return (
    <footer className='mt-20 border-t bg-muted/60'>
      <div className='container mx-auto flex flex-col items-center gap-4 px-4 py-10 text-center'>
        <Link
          href='/'
          className='text-2xl font-black tracking-tight text-primary'
        >
          PrimeTech
        </Link>
        <p className='max-w-sm text-sm text-muted-foreground'>
          Insights on technology, development, and design.
        </p>
        <nav className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm'>
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className='text-muted-foreground transition-colors hover:text-primary'
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className='text-xs text-muted-foreground'>
          © {new Date().getFullYear()} PrimeTech. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
