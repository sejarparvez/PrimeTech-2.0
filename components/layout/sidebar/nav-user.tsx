'use client';

import {
  BellIcon,
  ChevronsUpDownIcon,
  HeadphonesIcon,
  MapPinIcon,
  PackagePlusIcon,
  SettingsIcon,
} from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSession } from '@/lib/auth-client';
import { getInitials } from '@/lib/utils';
import { SignOut } from '../logout';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return null;
  }

  if (!session) {
    return null;
  }

  // biome-ignore lint/style/noNonNullAssertion: this is fine
  // biome-ignore lint/suspicious/noNonNullAssertedOptionalChain: this is fine
  const user = session?.user!;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg border-2 border-primary/20'>
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className='rounded-lg bg-primary/10 text-primary font-semibold'>
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user.name}</span>
                <span className='text-muted-foreground truncate text-xs'>
                  {user.email}
                </span>
              </div>
              <ChevronsUpDownIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-3 px-2 py-2 text-left text-sm'>
                <Avatar className='h-10 w-10 rounded-lg border-2 border-primary/20'>
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className='rounded-lg bg-primary/10 text-primary font-semibold'>
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user.name}</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Tour Provider Section (conditional) */}
            {(user.role === 'PROVIDER' || user.role === 'ADMIN') && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      href='/list-tour'
                      className='flex items-center gap-3 cursor-pointer'
                    >
                      <div className='w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center'>
                        <PackagePlusIcon className='size-4 text-green-600' />
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium'>List a Tour</div>
                        <div className='text-xs text-muted-foreground'>
                          Add new tour package
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href='/my-tours'
                      className='flex items-center gap-3 cursor-pointer'
                    >
                      <div className='w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center'>
                        <MapPinIcon className='size-4 text-purple-600' />
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium'>My Tours</div>
                        <div className='text-xs text-muted-foreground'>
                          Manage your listings
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
              </>
            )}

            {/* Settings */}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href='/account/settings'
                  className='flex items-center gap-3 cursor-pointer'
                >
                  <SettingsIcon className='size-4 text-muted-foreground' />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href='/notifications'
                  className='flex items-center gap-3 cursor-pointer justify-between'
                >
                  <div className='flex items-center gap-3'>
                    <BellIcon className='size-4 text-muted-foreground' />
                    <span>Notifications</span>
                  </div>
                  <Badge variant='secondary' className='h-5 px-1.5 text-xs'>
                    3
                  </Badge>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Support */}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={user.role === 'ADMIN' ? '/support/agent' : '/support'}
                  className='flex items-center gap-3 cursor-pointer'
                >
                  <HeadphonesIcon className='size-4 text-muted-foreground' />
                  <span>Customer Support</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <SignOut />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
