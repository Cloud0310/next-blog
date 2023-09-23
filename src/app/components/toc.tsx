"use client";
import { log } from "console";
import { slug } from "github-slugger";
import { title } from "process";
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

interface Node {
  children: Node[] | string[];
  this: HTMLHeadElement;
}

function parseTitleTree(titles: HTMLHeadElement[]) {
  const root: Array<Node> = [];

  for (let i = 0; i < titles.length; i++) {
    let tagName = titles[i].tagName;
    if (tagName === "H2") {
      root.push({
        this: titles[i],
        children: [] as Node[]
      });
    } else {
      if (tagName === "H3") {
        (root[root.length - 1].children as Node[]).push({
          this: titles[i],
          children: [] as string[]
        });
      } else {
        (
          (root[root.length - 1].children as Node[])[(root[root.length - 1].children as Node[]).length - 1]
            .children as string[]
        ).push(titles[i].innerText);
      }
    }
  }
  return root;
}

export default function Toc() {
  const [titles, setTitles] = useState([] as Element[]);
  const [currentCursor, setCursor] = useState(0);
  const [titleTree, setTitleTree] = useState([] as Node[]);
  useEffect(() => {
    const titlesGet = Array.from(document.querySelectorAll(".markdown-content :is(h2,h3,h4)"));
    setTitles(titlesGet);
    setTitleTree(parseTitleTree(titlesGet as HTMLHeadElement[]) as Node[]);

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
        const currentTitles = Array.from(document.querySelectorAll("nav li"));
        let computedCursor = 0;
        for (; computedCursor < currentTitles.length; computedCursor++) {
          const currentTitle = currentTitles[computedCursor];
          const attr = currentTitle.attributes.getNamedItem("aria-selected");
          if (attr && attr.value === "true") break;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titles.length]);
  return (
    <div className="sticky left-20 top-[calc(60px+2.5rem)] m-10 w-64 rounded-2xl bg-neutral-200 px-3 py-5 pb-[1em] ">
      <div className="h-8">
        <span className="font-sans font-bold text-neutral-500">On this page</span>
      </div>
      {/* // TODO change toc to compatible with menu tabs */}
      <nav>
        <ul className="text-sm text-neutral-500">
          {titleTree.map((titleL1: Node, index: number) => {
            return (
              <li key={index}>
                <a href={"#" + slug(titleL1.this.innerText)}>
                  <span className="hover:text-neutral-600">{prepareTitle(titleL1.this.innerText)}</span>
                </a>
                <ul className="ml-3">
                  {(titleL1.children as Node[]).map((titleL2: Node, index: number) => {
                    return (
                      <li key={index}>
                        <a href={"#" + slug(titleL2.this.innerText)}>
                          <span className="hover:text-neutral-600">{prepareTitle(titleL2.this.innerText)}</span>
                        </a>
                        <ul className="ml-3">
                          {(titleL2.children as string[]).map((titleL3: string, index: number) => {
                            return (
                              <li key={index}>
                                <a href={"#" + slug(titleL3)}>
                                  <span className="hover:text-neutral-600">{prepareTitle(titleL3)}</span>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
