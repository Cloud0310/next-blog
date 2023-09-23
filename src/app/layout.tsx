import React from "react";
import "./styles/globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono, Noto_Sans, Noto_Serif } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import Image from "next/image";

const materialSymbols = localFont({
  style: "normal",
  src: "fonts/material-symbols-outlined.woff2",
  display: "block",
  weight: "100 700",
  variable: "--font-family-symbols"
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "auto",
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans"
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  display: "auto",
  style: ["normal", "italic"],
  weight: ["300", "700"],
  variable: "--font-noto-serif"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono"
});

const sourceHansSans = localFont({
  variable: "--font-source-hans-sans",
  style: "normal",
  weight: "350 700",
  display: "auto",
  src: "fonts/SourceHanSansSC-VF.otf.woff2"
});

const sourceHanSerif = localFont({
  variable: "--font-source-han-serif",
  style: "normal",
  weight: "350 700",
  display: "auto",
  src: "fonts/SourceHanSerifSC-VF.otf.woff2"
});

export const metadata: Metadata = {
  title: "Next Blog",
  description: "A blog build by Cloud0310 and Nickid2018"
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html
      className={`${materialSymbols.variable}
      ${sourceHanSerif.variable}
      ${sourceHansSans.variable}
      ${notoSerif.variable} 
      ${notoSans.variable} 
      ${jetbrainsMono.variable}
      scroll-smooth
      scroll-pt-[60px]
    `}
    >
      <body>
        <ThemeRegistry options={{ key: "joy" }}>
          <div className="fixed top-0 z-10 flex h-[60px] w-full items-center justify-between border-b border-b-neutral-300 px-5 backdrop-blur-lg">
            <div className="flex items-center gap-2.5 px-1 py-2">
              <div className="symbol text-4xl font-bold">
                <span>rocket</span>
              </div>
              <div className="font-sans text-2xl font-bold">Next Blog</div>
            </div>
            <div className="flex w-48 justify-between font-symbol text-4xl">
              <div className="mx-4 w-11 border-r">
                <span>search</span>
              </div>
              <div>
                <span>light_mode</span>
              </div>
              <div className="h-10 w-9 px-0.5 py-0.5">
                <Image src="/images/github-mark.svg" alt="github" width="36" height="42" />
              </div>
              <div>
                <span>rss_feed</span>
              </div>
            </div>
          </div>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
