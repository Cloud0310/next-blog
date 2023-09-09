"use client";
import { ReactNode, useEffect } from "react";
import Toc from "./toc";
import { Button } from "@mui/joy";

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const buttons = document.getElementsByClassName("copy-content");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", () => {
        const button = buttons[i] as HTMLButtonElement;
        navigator.clipboard.writeText(button.value).then(r => {
          button.innerText = "inventory";
          setTimeout(() => (button.innerText = "content_paste"), 1000);
        });
      });
    }
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
  }, []);
  return (
    <div className="relative top-[60px] flex h-full w-full font-sans">
      <div className="flex-1 bg-neutral-100 "></div>
      <div className="min-h-[calc(100vh-60px)] flex-1 justify-center border-x-neutral-300 px-20 pb-20 lg:min-w-[800px] ">
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
