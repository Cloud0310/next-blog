import React from "react";
import './static/globals.css'
import type {Metadata} from "next";
import localFont from 'next/font/local';
import {Noto_Sans} from "next/font/google";

const materialSymbols = localFont({
  variable: '--font-family-symbols',
  style: 'normal',
  src: './static/fonts/material-symbols-outlined.woff2',
  display: 'block',
  weight: '100 700',
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "auto",
  style: ["normal", "italic"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-noto-sans",
})

const sourceHansSans = localFont({
  variable: '--font-source-hans-sans',
  style: 'normal',
  weight: '400 600 700',
  display: "auto",
  src: './static/fonts/SourceHanSansSC-VF.otf.woff2',
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
    <body>
    <div className="fixed w-16 flex justify-between">
      <div className="py-2 px-1 flex items-center gap-2.5">
        <span className="font-symbol w-7.5 h-7.5"> rocket </span>
      </div>
    </div>
    {children}
    </body>
    </html>
  )
}
