"use client";
import { ReactNode, useEffect } from "react";
import Toc from "@/components/toc";
import { Button } from "@mui/joy";
import Prism from "prismjs";

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const mainContent = document.querySelector(".markdown-content");
    if (!mainContent) return;

    require("prismjs/components/prism-diff.js");
    require("prismjs/plugins/diff-highlight/prism-diff-highlight.js");
    require("prismjs/plugins/line-numbers/prism-line-numbers.js");
    require("prismjs/plugins/line-highlight/prism-line-highlight.js");
    const useLanguages = mainContent.querySelectorAll('pre[class*="language-"]');
    const collectedLanguages = [] as string[];
    for (let i = 0; i < useLanguages.length; i++) {
      const splitData = useLanguages[i].className.split(" ");
      for (let j = 0; j < splitData.length; j++) {
        const data = splitData[j];
        if (data.startsWith("language-")) {
          const language = data.startsWith("language-diff-") ? data.substring(14) : data.substring(9);
          if (!collectedLanguages.includes(language)) collectedLanguages.push(language);
        }
      }
    }
    collectedLanguages.sort();
    for (let i = 0; i < collectedLanguages.length; i++) {
      const language = collectedLanguages[i];
      if (language) require(`prismjs/components/prism-${language}.js`);
    }
    Prism.highlightAll();

    const buttons = document.getElementsByClassName("copy-content");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", () => {
        const button = buttons[i] as HTMLButtonElement;
        navigator.clipboard.writeText((button.nextElementSibling as HTMLPreElement).innerText).then(() => {
          button.innerText = "inventory";
          setTimeout(() => (button.innerText = "content_paste"), 1000);
        });
      });
    }

    const codeGroupTabs = document.getElementsByClassName("code-group-tab");
    for (let i = 0; i < codeGroupTabs.length; i++)
      codeGroupTabs[i].addEventListener("click", () => {
        const tab = codeGroupTabs[i] as HTMLSpanElement;
        const tabId = tab.id;
        const tabIdSplit = tabId.split("-");
        const renderUniqueString = tabIdSplit[2];
        const index = parseInt(tabIdSplit[3]);
        const codeGroup = document.getElementById(`code-group-blocks-${renderUniqueString}`);
        if (codeGroup) {
          const codeBlocks = codeGroup.getElementsByClassName("code-group-block");
          for (let j = 0; j < codeBlocks.length; j++) {
            if (j == index) {
              const tab = document.getElementById(`code-block-${renderUniqueString}-${j}`);
              if (tab) tab.classList.add("code-block-active");
            } else {
              const tab = document.getElementById(`code-block-${renderUniqueString}-${j}`);
              if (tab) tab.classList.remove("code-block-active");
            }
          }
        }
        const tabGroup = document.getElementById(`code-group-tabs-${renderUniqueString}`);
        if (tabGroup) {
          const tabs = tabGroup.getElementsByClassName("code-group-tab");
          for (let j = 0; j < tabs.length; j++) {
            if (j == index) {
              const tab = document.getElementById(`code-tab-${renderUniqueString}-${j}`);
              if (tab) tab.classList.add("code-tab-active");
            } else {
              const tab = document.getElementById(`code-tab-${renderUniqueString}-${j}`);
              if (tab) tab.classList.remove("code-tab-active");
            }
          }
        }
      });

    const mainTitle = document.querySelector("h1.title-text");
    const mainTitleObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        let button = document.getElementById("scroll-to-top");
        if (!mainTitle || !button) return;
        else {
          if (!e.isIntersecting) {
            button.classList.remove("opacity-0");
            button.children[0].removeAttribute("disabled");
          } else {
            button.classList.add("opacity-0");
            button.children[0].setAttribute("disabled", "true");
          }
        }
      });
    });
    if (mainTitle) mainTitleObserver.observe(mainTitle);

    const refLinks = document.getElementsByClassName("reference");
    for (let i = 0; i < refLinks.length; i++) {
      const refLink = refLinks[i] as HTMLElement;
      refLink.addEventListener("mouseenter", e => {
        const hoverElement = document.createElement("div");
        hoverElement.id = `reflink-hover-${i}`;
        hoverElement.classList.add("reflink-hover");
        const linkTo = document.getElementById(
          "cite-note-data_" + refLink.id.substring(refLink.id.lastIndexOf("_") + 1).split("-")[0]
        );
        if (linkTo) {
          hoverElement.innerHTML = `<p>${linkTo.innerHTML}</p>`;
          hoverElement.style.bottom = `${
            document.documentElement.clientHeight -
            (refLink.getClientRects()[0].top + document.documentElement.scrollTop) +
            5
          }px`;
          hoverElement.style.left = `${refLink.getClientRects()[0].right + document.documentElement.scrollLeft + 5}px`;
          document.body.appendChild(hoverElement);
        }
      });
      refLink.addEventListener("mouseleave", () => {
        const hoverElement = document.getElementById(`reflink-hover-${i}`);
        if (hoverElement) hoverElement.remove();
      });
    }
  }, []);
  return (
    <div className="relative top-[60px] flex h-full w-full font-sans">
      <div className="flex-1 bg-neutral-100 "></div>
      <div className="min-h-[calc(100vh-60px)] flex-1 border-x-neutral-300 px-20 pb-80 lg:min-w-[800px]">
        <div> {children} </div>
      </div>
      <div className="w-full flex-1 bg-neutral-100">
        <Toc />
      </div>
      <div className="fixed bottom-4 right-4 z-50 transition-opacity" id="scroll-to-top">
        <Button
          color="primary"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }}
          variant="soft"
          size="lg"
          className="h-12 w-12"
        >
          <span className="font-symbol text-2xl">arrow_upward</span>
        </Button>
      </div>
    </div>
  );
}
