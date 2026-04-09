'use client';

import {
  IconArrowDownCircle,
  IconArrowUpCircle,
  IconCash,
  IconChartBar,
  IconDashboard,
  IconFileText,
  IconGift,
  IconListDetails,
  IconMail,
  IconUserCog,
  IconUsersPlus,
} from '@tabler/icons-react';
import { Dices, HeadphonesIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSession } from '@/lib/auth-client';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

// Define the structure for Nav Item to explicitly include 'role'
// and make 'role' optional for items visible to all/default
interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType; // or a more specific type if possible
  role?: ('ADMIN' | 'USER')[]; // The role array
}

// Update 'data' to use the new NavItem type
export const data: { navMain: NavItem[]; navSecondary: NavItem[] } = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'My Account',
      url: '/dashboard/my-account',
      icon: IconUserCog,
      role: ['ADMIN', 'USER'],
    },
    // --- Deposit/Withdrawal Items (Role-Specific) ---
    {
      title: 'Deposit',
      url: '/dashboard/deposit',
      icon: IconArrowDownCircle,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'Deposit Requests',
      url: '/dashboard/deposit-requests',
      icon: IconArrowDownCircle,
      role: ['ADMIN'], // Only visible to ADMIN
    },
    {
      title: 'Withdrawal',
      url: '/dashboard/withdrawal',
      icon: IconArrowUpCircle,
      role: ['ADMIN', 'USER'],
    },
    {
      title: 'Withdrawal Requests',
      url: '/dashboard/withdrawal-requests',
      icon: IconArrowUpCircle,
      role: ['ADMIN'], // Only visible to ADMIN
    },
    // --- General User Items (No role property = visible to all logged in users,
    // but better practice is to explicitly define roles like below for consistency) ---
    {
      title: 'Betting Records',
      url: '/dashboard/betting-records',
      icon: IconListDetails,
      role: ['ADMIN', 'USER'], // Making explicit
    },
    {
      title: 'Account Records',
      url: '/dashboard/account-records',
      icon: IconFileText,
      role: ['ADMIN', 'USER'], // Making explicit
    },
    {
      title: 'Profits & Losses',
      url: '/dashboard/profits-losses',
      icon: IconChartBar,
      role: ['ADMIN', 'USER'], // Making explicit
    },
    {
      title: 'Rewards Center',
      url: '/dashboard/rewards-center',
      icon: IconGift,
      role: ['ADMIN', 'USER'], // Making explicit
    },
    {
      title: 'Invite Friends',
      url: '/dashboard/invite-friends',
      icon: IconUsersPlus,
      role: ['ADMIN', 'USER'], // Making explicit
    },
    {
      title: 'Internal Messages',
      url: '/dashboard/internal-messages',
      icon: IconMail,
      role: ['ADMIN', 'USER'], // Making explicit
    },
    {
      title: 'Manual Rebate',
      url: '/dashboard/manual-rebate',
      icon: IconCash,
      role: ['ADMIN'], // Assuming this might be an ADMIN task
    },
  ],

  navSecondary: [
    {
      title: 'Customer Support',
      url: '/support',
      icon: HeadphonesIcon,
      role: ['ADMIN', 'USER'],
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = useSession();

  // 1. Get the current user's role. Assume it's a string like 'ADMIN' or 'USER'.
  const userRole = session?.user?.role;

  // 2. Filter the navigation items based on the user's role.
  //    - If the item has NO 'role' property, it is included (optional safety fallback).
  //    - If the item HAS 'role' property, it is only included if the userRole is in the array.
  const filteredNavMain = data.navMain.filter((item) => {
    // If we're pending or no role is found, don't show anything role-specific yet
    if (isPending || !userRole) {
      // You might choose to hide everything or only non-role items here.
      // For now, let's keep it simple: filter only when we have a role.
      // If we are pending, we might show a skeleton or nothing.
      return false; // Hide all until session is loaded
    }

    // Check if the item has a 'role' array AND if the user's role is included in it
    if (item.role) {
      return item.role.includes(userRole as 'ADMIN' | 'USER');
    }

    // If 'role' is not defined for the item, you might choose to include it by default
    // or exclude it (I recommend explicit roles, so let's exclude it if not defined).
    // For safety with your original structure, let's include it if not defined:
    // return true;

    // Better: If the item has no role property, it's safer to require explicit roles.
    return false; // Require explicit roles for all items
  });

  // Since NavSecondary is usually standard help/support, we might just pass it.
  // But if it also needs filtering:
  const filteredNavSecondary = data.navSecondary.filter((item) => {
    if (isPending || !userRole) return false;
    if (item.role) {
      return item.role.includes(userRole as 'ADMIN' | 'USER');
    }
    return false;
  });

  if (isPending) {
    // Optional: Render a loading state (e.g., a skeleton) while session loads
    return (
      <Sidebar collapsible='offcanvas' {...props}>
        <SidebarHeader>...</SidebarHeader>
        <SidebarContent>
          {/* Add a skeleton loader component here if you have one */}
          <div className='p-4 text-sm text-gray-400'>Loading sidebar...</div>
        </SidebarContent>
        <SidebarFooter>...</SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:p-1.5!'
            >
              <a href='/'>
                <Dices className='size-5!' />
                <h1 className='text-2xl font-bold tracking-tight md:text-2xl'>
                  <span className='text-primary'>Best</span>
                  <span className='font-medium'>Slot</span>
                </h1>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Pass the FILTERED array */}
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
