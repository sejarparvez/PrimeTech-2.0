import RightSidebar from "@/components/layout/rightsidebar/RightSidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="md:grid md:grid-cols-24 lg:flex">
        <div className="col-span-22 w-full border-l">
          <div className="lg:grid lg:grid-cols-48">
            <div className="col-span-37 border-r pt-2">{children}</div>
            <div className="col-span-11">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
