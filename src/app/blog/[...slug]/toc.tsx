"use client";
import { Tab, tabClasses, TabList, Tabs } from "@mui/joy";
import * as React from "react";
import { useEffect, useState } from "react";

function prepareTitle(title: string) {
  const preprocessed = title.startsWith("#") ? title.substring(2) : title;
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
    <div className="sticky left-20 top-[calc(60px+2.5rem)] m-10 w-64 rounded-2xl bg-neutral-200 px-3 py-5 pb-[1em] ">
      <div className="h-8">
        <span className="font-sans font-bold text-neutral-500">On this page</span>
      </div>
      {/*// TODO change toc to compatible with menu tabs*/}
      <Tabs
        aria-label="tabs"
        orientation="vertical"
        variant="soft"
        defaultValue={0}
        sx={{
          bgcolor: "neutral.200"
        }}
      >
        <TabList
          disableUnderline
          id="toc-list"
          sx={{
            borderRadius: "5px",
            display: "flex",
            bgcolor: "background.level1",
            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              color: "neutral.600",
              fontWeight: "500",
              borderRadius: "5px",
              "&::after": {
                transition: "color 0.2s ease-in-out",
                height: "60%",
                width: "3px",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
                bgcolor: "primary.500"
              }
            },
            width: "100%"
          }}
        >
          {Array.from(titles).map((title: any, index: number) => {
            return (
              <Tab
                indicatorPlacement="left"
                key={index}
                aria-selected={currentCursor === index}
                className="truncate text-left"
                sx={{
                  color: "neutral.500",
                  "&:hover": {
                    color: "neutral.700",
                    fontWeight: "500",
                    "&::after": {
                      transition: "color 0.2s ease-in-out",
                      height: "60%",
                      width: "3px",
                      borderTopLeftRadius: "3px",
                      borderTopRightRadius: "3px",
                      bgcolor: "neutral.500"
                    }
                  }
                }}
                slotProps={{
                  root: {
                    onClick: () => {
                      title.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
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
