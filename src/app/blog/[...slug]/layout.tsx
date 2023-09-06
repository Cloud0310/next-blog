import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative top-[60px] flex w-full flex-col items-center justify-center">
      <div className="w-1/3"></div>
      <div className="w-1/3">{children}</div>
      <div className="w-1/3 flex-col items-start justify-start"></div>
    </div>
  );
}
