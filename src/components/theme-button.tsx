"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThemeButton() {
  const [theme, setTheme] = useState<"light" | "dark">(
    window.matchMedia("(prefer-color-scheme: dark)") ? "dark" : "light"
  );
  function handleToggleTheme() {
    if (theme === "dark") {
      setTheme("light");
      window.localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      window.localStorage.setItem("theme", "dark");
    }
  }
  useEffect(() => {
    if (window.localStorage.getItem("theme") === "dark" || (!("theme" in window.localStorage) && theme === "dark")) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
      if (e.matches) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    });
  }, [theme]);

  return (
    <button type="button" onClick={handleToggleTheme}>
      {theme === "dark" ? (
        <Image src="/images/light_mode.svg" alt="Light Mode" width="36" height="36" />
      ) : (
        <Image src="/images/dark_mode.svg" alt="Dark Mode" width="36" height="36" />
      )}
    </button>
  );
}
