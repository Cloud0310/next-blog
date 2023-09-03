import './globals.css'
import React from "react";

export const metadata = {
    title: 'Next Blog',
    description: 'A blog build by Cloud0310 and Nickid2018',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
          <div className="flex">{children}</div>
      </>
  ) as React.ReactNode
}
