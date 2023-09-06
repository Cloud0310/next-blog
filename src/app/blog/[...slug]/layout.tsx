import * as React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative top-[60px] flex h-full w-full justify-center font-sans">
      <div className="flex-1"></div>
      <div className="flex-1 lg:min-w-[700px]">{children}</div>
      <div className="w-full flex-1">
        <div className="sticky left-20 top-20 mx-6 my-10 h-[calc(100vh-20rem)] w-[200px] ">
          <div className="my-1.5 rounded border font-sans font-bold text-neutral-300">
            On this page
          </div>
        </div>
      </div>
    </div>
  );
}
