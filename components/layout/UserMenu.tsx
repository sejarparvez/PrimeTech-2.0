'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';
import { SignOut } from './logout';

export function UserMenu() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (isPending) {
    return <Skeleton className='h-10 w-10 rounded-full' />;
  }

  if (!session) {
    return (
      <Link href='/auth/signin'>
        <Button>Log in</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={session.user?.image as string}
              alt={session.user?.name as string}
            />
            <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuItem className='flex flex-col items-start'>
          <div className='font-medium'>{session.user?.name}</div>
          <div className='text-xs text-muted-foreground'>
            {session.user?.email}
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link href='/dashboard'>
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <Link href={`/dashboard/profile?id=${session.user?.id}`}>
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
