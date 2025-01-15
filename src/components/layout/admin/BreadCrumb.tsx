"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";

export default function BreadCrumb() {
  const pathname = usePathname();
  // Split the pathname into an array of parts, removing empty strings
  const pathArray = pathname.split("/").filter((path) => path);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home breadcrumb item */}
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            {pathArray.map((path, index) => {
              // Create the href for each breadcrumb
              const href = `/${pathArray.slice(0, index + 1).join("/")}`;
              // Check if this is the last breadcrumb in the list
              const isLast = index === pathArray.length - 1;

              return (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {!isLast ? (
                      <BreadcrumbLink href={href}>
                        {decodeURIComponent(path).replace("-", " ")}
                      </BreadcrumbLink>
                    ) : (
                      <span>{decodeURIComponent(path).replace("-", " ")}</span>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
