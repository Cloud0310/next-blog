import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import { JetBrains_Mono, Noto_Sans, Noto_Serif } from "next/font/google";

const materialSymbols = localFont({
  style: "normal",
  src: "fonts/material-symbols-outlined.woff2",
  display: "block",
  weight: "100 700",
  variable: "--font-family-symbols",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "auto",
  weight: ["300", "700"],
  variable: "--font-noto-sans",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  display: "auto",
  style: ["normal", "italic"],
  weight: ["300", "700"],
  variable: "--font-noto-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
});

const sourceHansSans = localFont({
  variable: "--font-source-hans-sans",
  style: "normal",
  weight: "350 700",
  display: "auto",
  src: "fonts/SourceHanSansSC-VF.otf.woff2",
});

const sourceHanSerif = localFont({
  variable: "--font-source-han-serif",
  style: "normal",
  weight: "350 700",
  display: "auto",
  src: "fonts/SourceHanSerifSC-VF.otf.woff2",
});

export const metadata: Metadata = {
  title: "Next Blog",
  description: "A blog build by Cloud0310 and Nickid2018",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${materialSymbols.variable}
      ${sourceHanSerif.variable}
      ${sourceHansSans.variable}
      ${notoSerif.variable} 
      ${notoSans.variable} 
      ${jetbrainsMono.variable}
    `}
    >
      <body>
        <div className="fixed flex justify-between w-full px-5 border-b items-center backdrop-blur-lg z-10 top-0 h-[60px]">
          <div className="py-2 px-1 flex items-center gap-2.5">
            <div className="symbol font-bold text-4xl">
              <span>rocket</span>
            </div>
            <div className="text-2xl font-bold font-sans">Next Blog</div>
          </div>
          <div className="flex justify-between font-symbol text-4xl w-48">
            <div className="w-11 border-r mx-4">
              <span>search</span>
            </div>
            <div>
              <span>light_mode</span>
            </div>
            <div className="h-10 w-9 py-0.5 px-0.5">
              <Image
                src="/images/github-mark.svg"
                alt="github"
                width="36"
                height="42"
              />
            </div>
            <div>
              <span>rss_feed</span>
            </div>
          </div>
        </div>
        <div className="flex-col items-center justify-center w-full flex top-[60px] relative">
          {children}
        </div>
      </body>
    </html>
  );
}
