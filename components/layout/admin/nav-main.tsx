'use client';

import type { Icon } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Define the structure for Nav Item, matching what is passed from AppSidebar
// Note: We don't need 'role' here, as the filtering is already done in the parent.
// But we should ensure the 'icon' type matches the definition used in 'AppSidebar'.
interface NavItem {
  title: string;
  url: string;
  // Use React.ElementType which is often a safer type for components passed as props
  icon?: Icon | React.ElementType;
}

export function NavMain({
  items,
}: {
  // Use the defined NavItem interface
  items: NavItem[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <SidebarMenu>
          {/* Ensure 'items' is used */}
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  data-state={pathname === item.url ? 'active' : 'inactive'}
                  className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                >
                  {/* Render the icon component if it exists */}
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
