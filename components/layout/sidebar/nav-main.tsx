'use client';

import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
    isActive?: boolean;
    badge?: number;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const Icon = item.icon;

        const hasSubItems = item.items && item.items.length > 0;

        if (hasSubItems) {
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className='group/collapsible'
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.isActive}
                  >
                    {Icon && <Icon className='w-4 h-4' />}
                    <span className='flex-1'>{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant='secondary' className='h-5 px-1.5 text-xs'>
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRightIcon className='ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        }

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={item.isActive}
            >
              <Link href={item.url} className='flex items-center gap-3 w-full'>
                {Icon && <Icon className='w-4 h-4' />}
                <span className='flex-1'>{item.title}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant='secondary' className='h-5 px-1.5 text-xs'>
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
