'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function BreadCrumbComponent() {
  const pathname = usePathname();
  // Split the pathname into an array of parts, removing empty strings
  const pathArray = pathname.split('/').filter((path) => path);

  return (
    <div className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
      </div>
      <Separator
        orientation='vertical'
        className='mr-2 data-vertical:h-4 data-vertical:self-auto'
      />
      <Breadcrumb>
        <BreadcrumbList>
          {/* Home breadcrumb item */}
          <BreadcrumbItem>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
          </BreadcrumbItem>

          {pathArray.map((path, index) => {
            // Create the href for each breadcrumb
            const href = `/${pathArray.slice(0, index + 1).join('/')}`;
            // Check if this is the last breadcrumb in the list
            const isLast = index === pathArray.length - 1;

            return (
              // biome-ignore lint: error
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {!isLast ? (
                    <BreadcrumbLink href={href}>
                      {decodeURIComponent(path).replace('-', ' ')}
                    </BreadcrumbLink>
                  ) : (
                    <span>{decodeURIComponent(path).replace('-', ' ')}</span>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
