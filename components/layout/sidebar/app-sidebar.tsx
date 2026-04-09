'use client';

import {
  BarChart3,
  BookOpen,
  Compass,
  FileText,
  Headphones,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

// Define the structure for Nav Item
interface NavItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  isActive?: boolean;
  role?: ('ADMIN' | 'USER')[]; // Role array
  badge?: number; // Optional badge count
  items?: { title: string; url: string }[]; // Sub-items for collapsible
}

// Navigation data for blog website
export const data: { navMain: NavItem[]; navSecondary: NavItem[] } = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'Content',
      url: '#',
      icon: FileText,
      role: ['ADMIN', 'USER'],
      isActive: true,

      items: [
        {
          title: 'My Articles',
          url: '/dashboard/content/my-articles',
        },
        {
          title: 'Write Article',
          url: '/dashboard/content/write-article',
        },
        {
          title: 'Saved Articles',
          url: '/dashboard/content/saved-articles',
        },
        {
          title: 'Reading History',
          url: '/dashboard/content/reading-history',
        },
      ],
    },
    {
      title: 'Community',
      url: '#',
      icon: Users,
      role: ['ADMIN', 'USER'],
      items: [
        {
          title: 'Comments',
          url: '/dashboard/community/comments',
        },
        {
          title: 'Notifications',
          url: '/dashboard/community/notifications',
        },
      ],
    },

    // Admin sections
    {
      title: 'Manage Content',
      url: '#',
      icon: BookOpen,
      role: ['ADMIN'],
      items: [
        {
          title: 'All Articles',
          url: '/dashboard/admin/content/articles',
        },
        {
          title: 'Drafts',
          url: '/dashboard/admin/content/drafts',
        },
        {
          title: 'Categories',
          url: '/dashboard/admin/content/categories',
        },
        {
          title: 'Tags',
          url: '/dashboard/admin/content/tags',
        },
      ],
    },
    {
      title: 'Manage Community',
      url: '#',
      icon: MessageSquare,
      role: ['ADMIN'],
      items: [
        {
          title: 'All Comments',
          url: '/dashboard/admin/community/comments',
        },
        {
          title: 'All Users',
          url: '/dashboard/admin/community/users',
        },
        {
          title: 'Authors',
          url: '/dashboard/admin/community/authors',
        },
      ],
    },
    {
      title: 'Analytics & Media',
      url: '#',
      icon: BarChart3,
      role: ['ADMIN'],
      items: [
        {
          title: 'Analytics',
          url: '/dashboard/admin/analytics',
        },
        {
          title: 'Trending',
          url: '/dashboard/admin/trending',
        },
        {
          title: 'Media Library',
          url: '/dashboard/admin/media',
        },
      ],
    },

    // Settings (non-collapsible, always visible)
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: Settings,
      role: ['ADMIN', 'USER'],
    },
  ],

  navSecondary: [
    {
      title: 'Customer Support',
      url: '/support',
      icon: Headphones,
      role: ['ADMIN', 'USER'],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = useSession();

  // Get the current user's role
  const userRole = session?.user?.role;

  // Filter navigation items based on user's role
  const filteredNavMain = data.navMain.filter((item) => {
    if (isPending || !userRole) {
      return false;
    }

    if (item.role) {
      return item.role.includes(userRole as 'ADMIN' | 'USER');
    }

    return false;
  });

  // Loading state
  if (isPending) {
    return (
      <Sidebar collapsible='offcanvas' {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Skeleton className='h-12 w-full' />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className='space-y-2 p-4'>
            {[...Array(8)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
        </SidebarContent>
        <SidebarFooter>
          <Skeleton className='h-16 w-full' />
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <Compass />
              </div>
              <div className='flex flex-col'>
                <h1 className='text-xl font-bold tracking-tight'>
                  <span>Prime</span>
                  <span className='font-semibold text-primary'>Tech</span>
                </h1>
                <span className='text-xs text-muted-foreground'>
                  Blog Platform
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
