import './globals.css'
import React from "react";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Next Blog',
    description: 'A blog build by Cloud0310 and NickId2018',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
          <div className="flex"></div>
      </>
  ) as React.ReactNode
}
