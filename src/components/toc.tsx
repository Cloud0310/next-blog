"use client";
import { slug } from "github-slugger";
import * as React from "react";
import { useEffect, useState } from "react";

function prepareTitle(title: string) {
  return title.startsWith("#") ? title.substring(2) : title;
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

function setToActive(titleTree: TreeNode[], title: HTMLHeadElement) {
  const navs = document.querySelectorAll("#toc a");
  navs.forEach(nav => nav.removeAttribute("aria-current"));
  const titleHref = slug(prepareTitle(title.innerText));
  const toTitle = document.querySelector(`#toc a[href="#${titleHref}"]`);
  if (toTitle) toTitle.setAttribute("aria-current", "true");
}

export default function Toc() {
  const [titleTree, setTitleTree] = useState([] as TreeNode[]);
  useEffect(() => {
    if (document.body.getElementsByTagName("toc-resolved").length > 0) return;

    const titles = Array.from(document.querySelectorAll(".markdown-content :is(h2,h3,h4)")) as HTMLHeadElement[];
    const titleTree = parseTitleTree(titles);
    setTitleTree(titleTree);

    const observer = new IntersectionObserver(
      entries => {
        let i = 0;
        for (; i < titles.length; i++) if (titles[i].getBoundingClientRect().bottom > window.innerHeight / 2) break;
        setToActive(titleTree, titles[Math.max(0, i - 1)]);
      },
      {
        rootMargin: "-60px 0px 0px 0px",
        threshold: 0
      }
    );
    const observer2 = new IntersectionObserver(
      entries => {
        let i = 0;
        for (; i < titles.length; i++) if (titles[i].getBoundingClientRect().bottom > window.innerHeight / 2) break;
        setToActive(titleTree, titles[Math.max(0, i - 1)]);
      },
      {
        rootMargin: "-90px 0px 0px 0px",
        threshold: 1
      }
    );
    titles.forEach(title => observer.observe(title));
    titles.forEach(title => observer2.observe(title));
    const mainTitle = document.querySelector("h1.title-text");
    if (mainTitle) {
      const mainTitleObserver = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) setToActive(titleTree, titleTree[0].this);
        },
        {
          rootMargin: "-60px 0px 0px 0px",
          threshold: 0.5
        }
      );
      mainTitleObserver.observe(mainTitle);
    }
    document.body.appendChild(document.createElement("toc-resolved"));
  }, [titleTree.length]);
  return (
    <div id="toc" className="sticky left-20 top-[calc(60px+2.5rem)] m-10 w-64 pb-[1em]">
      <div className="mx-3 my-4 h-8">
        <span className="font-sans font-bold text-neutral-500">On this page</span>
      </div>
      <nav className="mb-5 border-l border-l-neutral-300 px-3">
        <ul className="text-sm text-neutral-500">
          {titleTree.map((titleL1: TreeNode, index: number) => {
            return (
              <li key={index}>
                <a href={"#" + slug(titleL1.this.innerText)} className="group">
                  <span className="hover:text-neutral-600 group-aria-[current=true]:text-primary-400">
                    {prepareTitle(titleL1.this.innerText)}
                  </span>
                </a>
                <ul className="my-2 ml-3 leading-6">
                  {titleL1.children?.map((titleL2: TreeNode, index: number) => {
                    return (
                      <li key={index}>
                        <a href={"#" + slug(titleL2.this.innerText)} className="group">
                          <span className="hover:text-neutral-600 group-aria-[current=true]:text-primary-400">
                            {prepareTitle(titleL2.this.innerText)}
                          </span>
                        </a>
                        <ul className="my-2 ml-3 leading-6">
                          {titleL2.children?.map((titleL3: TreeNode, index: number) => {
                            return (
                              <li key={index}>
                                <a href={"#" + slug(titleL3.this.innerText)} className="group">
                                  <span
                                    className="
                                      hover:text-neutral-600 
                                      group-aria-[current=true]:text-primary-400
                                    "
                                  >
                                    {prepareTitle(titleL3.this.innerText)}
                                  </span>
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
