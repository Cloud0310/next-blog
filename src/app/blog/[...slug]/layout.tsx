import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-1/3"></div>
      <div className="w-1/3 flex items-center justify-center font">
        {children}
      </div>
      <div className="w-1/3 flex-col justify-start items-start"></div>
    </>
  );
}
