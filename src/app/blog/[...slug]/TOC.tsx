"use client";
import { Tab, tabClasses, TabList, Tabs } from "@mui/joy";
import * as React from "react";
import { useEffect, useState } from "react";

export default function TOC() {
  const [titles, setTitles] = useState(
    Array.from(document.querySelectorAll("h2,h3,h4")),
  );
  const [currentCursor, setCursor] = useState(-1);

  useEffect(() => {
    if (titles.length !== 0) return;
    const titlesGet = Array.from(document.querySelectorAll("h2,h3,h4"));
    setTitles(titlesGet);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          if (entry.intersectionRect.top > 100) {
            setCursor(index - 1);
          }
        }
      });
    });
    // console.log(titles);
    titlesGet.forEach((title) => {
      observer.observe(title);
    });
  }, []);
  // @ts-ignore
  // @ts-ignore
  return (
    <div>
      <div className="my-2 rounded px-3 font-sans font-bold text-neutral-300 ">
        On this page
      </div>
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
        >
          {Array.from(titles).map((title: any, index: number) => {
            return (
              <Tab
                disableIndicator
                key={index}
                aria-selected={currentCursor === index}
              >
                {title.innerText.substring(2, title.innerText.length)}
              </Tab>
            );
          })}
        </TabList>
      </Tabs>
    </div>
  );
}
