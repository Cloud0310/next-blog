"use client";
import { Tab, tabClasses, TabList, Tabs } from "@mui/joy";
import * as React from "react";
import { useEffect, useState } from "react";

function prepareTitle(title: string) {
  const preprocessed = title.substring(2);
  if (/[^(（)）]+[（(].+?[）)]/.test(preprocessed)) {
    const matchedSubs = preprocessed.match(/[（(].+[）)]/);
    if (matchedSubs) {
      const matchFirst = matchedSubs[0];
      const processed = preprocessed.replace(matchFirst, "");
      return (
        <div>
          <span>{processed}</span>
          <br />
          <span className="text-sm">{matchFirst}</span>
        </div>
      );
    } else return <span>{preprocessed}</span>;
  }
  return <span>{preprocessed}</span>;
}

export default function Toc() {
  const [titles, setTitles] = useState([] as Element[]);
  const [currentCursor, setCursor] = useState(0);

  useEffect(() => {
    const titlesGet = Array.from(document.querySelectorAll("h2,h3,h4"));
    setTitles(titlesGet);
    const observer = new IntersectionObserver(
      (entries) => {
        let leastIndex = 2147483647;
        let maxIndex = -1;
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const indexNow = titles.indexOf(entry.target);
          leastIndex = Math.min(leastIndex, indexNow);
          maxIndex = Math.max(maxIndex, indexNow);
        }
        const leastTitle = titles[leastIndex];
        const maxTitle = titles[maxIndex];
        if (!leastTitle || !maxTitle) return;
        const leastRect = leastTitle.getBoundingClientRect();
        const maxRect = maxTitle.getBoundingClientRect();
        if (leastRect.bottom < 60) setCursor(leastIndex);
        else if (maxRect.bottom > window.innerHeight) setCursor(Math.max(0, leastIndex - 1));
      },
      {
        rootMargin: "-60px 0px 0px 0px",
        threshold: 0,
      }
    );
    titlesGet.forEach((title) => observer.observe(title));
  }, [titles.length]);
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
                {prepareTitle(title.innerText)}
              </Tab>
            );
          })}
        </TabList>
      </Tabs>
    </div>
  );
}
