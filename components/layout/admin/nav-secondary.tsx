'use client';

import type { Icon } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';
import { Badge } from '@/components/ui/badge'; // Import Badge component
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Define the structure for Nav Item, consistent with NavMain
interface NavItem {
  title: string;
  url: string;
  // Use a more flexible type for the icon component
  icon: Icon | React.ElementType;
}

export function NavSecondary({
  items,
  unreadCount, // Add unreadCount prop
  ...props
}: {
  // Use the defined NavItem interface for the items array
  items: NavItem[];
  unreadCount: number; // Define type for unreadCount
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                data-state={pathname === item.url ? 'active' : 'inactive'}
                className='data-[state=active]:bg-primary/10'
              >
                <Link
                  href={item.url}
                  className='flex items-center justify-between w-full'
                >
                  {' '}
                  {/* Added flex and justify-between */}
                  <div className='flex items-center gap-2'>
                    {' '}
                    {/* Group icon and title */}
                    {/* Render the icon component */}
                    <item.icon />
                    <span>{item.title}</span>
                  </div>
                  {item.title === 'Customer Support' && unreadCount > 0 && (
                    <Badge
                      variant='destructive'
                      className='ml-2 px-2 py-0.5 text-xs'
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
