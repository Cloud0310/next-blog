"use client";
import { slug } from "github-slugger";
import * as React from "react";
import { useEffect, useState } from "react";

function prepareTitle(title: string) {
  const preprocessed = title.startsWith("#") ? title.substring(2) : title;
  return <span>{preprocessed}</span>;
}

interface TreeNode {
  children: TreeNode[] | null;
  this: HTMLHeadElement;
}

function parseTitleTree(titles: HTMLHeadElement[]) {
  const root: Array<TreeNode> = [];

  for (let i = 0; i < titles.length; i++) {
    let tagName = titles[i].tagName;
    if (tagName === "H2") {
      root.push({
        this: titles[i],
        children: []
      });
    } else {
      if (tagName === "H3") {
        root.at(-1)?.children?.push({
          this: titles[i],
          children: []
        });
      } else {
        root.at(-1)?.children?.at(-1)?.children?.push({
          this: titles[i],
          children: null
        });
      }
    }
  }
  return root;
}

function setToActive(title: HTMLHeadElement) {}

export default function Toc() {
  const [titleTree, setTitleTree] = useState([] as TreeNode[]);
  useEffect(() => {
    if (document.body.getElementsByTagName("toc-completed").length > 0) return;

    const titles = Array.from(document.querySelectorAll(".markdown-content :is(h2,h3,h4)"));
    const titleTree = parseTitleTree(titles as HTMLHeadElement[]);
    setTitleTree(titleTree);

    const observer = new IntersectionObserver(entries => {}, {
      rootMargin: "-60px 0px 0px 0px",
      threshold: 0
    });
    titles.forEach(title => observer.observe(title));
    const mainTitle = document.querySelector("h1.title-text");
    if (mainTitle) {
      const mainTitleObserver = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            let setTo: TreeNode = titleTree[0];
            setTo = setTo?.children?.[0] ?? setTo;
            setTo = setTo?.children?.[0] ?? setTo;
            setToActive(setTo.this);
          }
        },
        {
          rootMargin: "-60px 0px 0px 0px",
          threshold: 0.5
        }
      );
      mainTitleObserver.observe(mainTitle);
    }
    document.body.appendChild(document.createElement("toc-completed"));
  }, [titleTree.length]);
  return (
    <div id="toc" className="sticky left-20 top-[calc(60px+2.5rem)] m-10 w-64 pb-[1em]">
      <div className="mx-3 my-4 h-8">
        <span className="font-sans font-bold text-neutral-500">On this page</span>
      </div>
      {/* // TODO change toc to compatible with menu tabs */}
      <nav className="mb-5 border-l border-l-neutral-300 px-3">
        <ul className="text-sm text-neutral-500">
          {titleTree.map((titleL1: TreeNode, index: number) => {
            return (
              <li key={index}>
                <a href={"#" + slug(titleL1.this.innerText)}>
                  <span className="hover:text-neutral-600">{prepareTitle(titleL1.this.innerText)}</span>
                </a>
                <ul className="my-2 ml-3 leading-6">
                  {titleL1.children?.map((titleL2: TreeNode, index: number) => {
                    return (
                      <li key={index}>
                        <a href={"#" + slug(titleL2.this.innerText)}>
                          <span className="hover:text-neutral-600">{prepareTitle(titleL2.this.innerText)}</span>
                        </a>
                        <ul className="my-2 ml-3 leading-6">
                          {titleL2.children?.map((titleL3: TreeNode, index: number) => {
                            return (
                              <li key={index}>
                                <a href={"#" + slug(titleL3.this.innerText)}>
                                  <span className="hover:text-neutral-600">{prepareTitle(titleL3.this.innerText)}</span>
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
