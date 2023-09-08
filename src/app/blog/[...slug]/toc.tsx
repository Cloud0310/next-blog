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
    const titlesGet = Array.from(document.querySelectorAll(".markdown-content :is(h2,h3,h4)"));
    setTitles(titlesGet);
    const observer = new IntersectionObserver(
      entries => {
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
        const currentTitles = Array.from(document.querySelectorAll("#toc-list button"));
        let computedCursor = 0;
        for (; computedCursor < currentTitles.length; computedCursor++) {
          const currentTitle = currentTitles[computedCursor];
          //@ts-ignore
          const attr = currentTitle.attributes["aria-selected"];
          if (attr && attr.nodeValue === "true") break;
        }
        if (leastRect.bottom < 60 && computedCursor < leastIndex) setCursor(leastIndex);
        else if (maxRect.bottom > window.innerHeight && computedCursor >= maxIndex)
          setCursor(Math.max(0, maxIndex - 1));
      },
      {
        rootMargin: "-60px 0px 0px 0px",
        threshold: 0
      }
    );
    titlesGet.forEach(title => observer.observe(title));
    const mainTitle = document.querySelector("h1.title-text");
    if (mainTitle) {
      const mainTitleObserver = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) setCursor(0);
        },
        {
          rootMargin: "-60px 0px 0px 0px",
          threshold: 0.5
        }
      );
      mainTitleObserver.observe(mainTitle);
    }
  }, [titles.length]);
  return (
    <div>
      <div className="my-2 rounded px-3 font-sans font-bold text-neutral-300 ">On this page</div>
      <Tabs aria-label="tabs" orientation="vertical" variant="soft" defaultValue={0} sx={{ bgcolor: "transparent" }}>
        <TabList
          disableUnderline
          id="toc-list"
          sx={{
            p: 0.5,
            gap: 0.5,
            borderRadius: "xl",
            bgcolor: "background.level1",
            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              boxShadow: "sm",
              bgcolor: "background.surface"
            }
          }}
        >
          {Array.from(titles).map((title: any, index: number) => {
            return (
              <Tab disableIndicator key={index} aria-selected={currentCursor === index}>
                {prepareTitle(title.innerText)}
              </Tab>
            );
          })}
        </TabList>
      </Tabs>
    </div>
  );
}
