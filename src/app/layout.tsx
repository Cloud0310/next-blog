"use client";
import "@/styles/globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono, Noto_Sans, Noto_Serif } from "next/font/google";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

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
  src: "../fonts/SourceHanSansSC-VF.otf.woff2"
});

const sourceHanSerif = localFont({
  variable: "--font-source-han-serif",
  style: "normal",
  weight: "350 700",
  display: "auto",
  src: "../fonts/SourceHanSerifSC-VF.otf.woff2"
});

export const metadata: Metadata = {
  title: "Next Blog",
  description: "A blog build by Cloud0310 and Nickid2018"
};

export default function RootLayout({ children }: { children: any }) {
  const [theme, setTheme] = useState<"light" | "dark">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  function handleToggleTheme() {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  }

  useEffect(() => {
    theme === "dark"
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      e.matches ? setTheme("dark") : setTheme("light");
    };
    handleDarkModeChange({ matches: mediaQuery.matches } as MediaQueryListEvent);
    mediaQuery.addEventListener("change", handleDarkModeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, []);

  return (
    <html
      className={`
      ${sourceHanSerif.variable}
      ${sourceHansSans.variable}
      ${notoSerif.variable} 
      ${notoSans.variable} 
      ${jetbrainsMono.variable}
      scroll-pt-[60px]
      scroll-smooth
    `}
    >
      <body>
        <div className="fixed top-0 z-10 flex h-[60px] w-full items-center justify-between border-b border-b-neutral-600 px-5 backdrop-blur-lg dark:border-b-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2.5 px-1 py-2">
            <div className="text-4xl font-bold">
              <Image src="/images/rocket.svg" alt="rocket" width="36" height="36" />
            </div>
            <div className="font-sans text-2xl font-bold">Next Blog</div>
          </div>
          <div className="flex w-48 justify-between text-4xl">
            <div className="mx-4 w-11 border-r">
              <Image src="/images/search.svg" alt="search" width="36" height="36" />
            </div>
            <div>
              <button type="button" onClick={handleToggleTheme}>
                {theme === "dark" ? (
                  <Image src="/images/light_mode.svg" alt="Light Mode" width="36" height="36" />
                ) : (
                  <Image src="/images/dark_mode.svg" alt="Dark Mode" width="36" height="36" />
                )}
              </button>
            </div>
            <div className="h-10 w-9 px-0.5 py-0.5">
              <Link href="https://github.com/Cloud0310/next-blog">
                {theme === "dark" ? (
                  <Image src="/images/github-mark-white.svg" alt="github" width="36" height="36" />
                ) : (
                  <Image src="/images/github-mark.svg" alt="github" width="36" height="36" />
                )}
              </Link>
            </div>
            <div>
              <Link href="#">
                <Image src="/images/rss.svg" alt="rss" width="36" height="36" />
              </Link>
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
