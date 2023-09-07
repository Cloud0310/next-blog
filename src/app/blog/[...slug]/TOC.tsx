"use client";
import { tabClasses, TabList, Tabs } from "@mui/joy";
import * as React from "react";
import { useEffect, useState } from "react";

const [titles, setTitles] = useState([] as any);
const [currentCursor, setCursor] = useState(0);

export default function TOC() {
  useEffect(() => {
    setTitles(document.querySelectorAll("h2,h3,h4"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRect.top > 100) return;
        const element = entry.target;
        const index = titles.indexOf(element);
        let scrollTo = entry.isIntersecting ? index - 1 : index;
        scrollTo = scrollTo < 0 ? 0 : scrollTo;
        setCursor(scrollTo);
      });
    });
    (titles as NodeListOf<Element>).forEach((title) => observer.observe(title));
  }, []);
  return (
    <Tabs
      aria-label="tabs"
      orientation="vertical"
      variant="soft"
      defaultValue={0}
      sx={{ bgcolor: "transparent" }}
    >
      <TabList
        disableUnderline
        sx={{
          p: 0.5,
          gap: 0.5,
          borderRadius: "xl",
          bgcolor: "background.level1",
          [`& .${tabClasses.root}[aria-selected="true"]`]: {
            boxShadow: "sm",
            bgcolor: "background.surface",
          },
        }}
      ></TabList>
    </Tabs>
  );
}
