import React from "react";
import './globals.css'
import type {Metadata} from "next";
import localFont from 'next/font/local';

const materialSymbols = localFont({
  variable: '--font-family-symbols',
  style: 'normal',
  src: '../../node_modules/material-symbols/material-symbols-rounded.woff2',
  display: 'block',
  weight: '100 700',
})


export const metadata: Metadata = {
  title: 'Next Blog',
  description: 'A blog build by Cloud0310 and NickId2018',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html className={`${materialSymbols.variable}`}>
    <body>{children}</body>
    </html>
  )
}
