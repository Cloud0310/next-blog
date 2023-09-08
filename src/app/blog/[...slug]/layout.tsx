"use client";
import { ReactNode, useEffect } from "react";
import Toc from "./toc";

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
  }, []);
  return (
    <div className="relative top-[60px] flex h-full w-full justify-center font-sans">
      <div className="flex-1 bg-neutral-100 "></div>
      <div className="mt-5 flex-1 justify-center border-x-neutral-300 px-20 lg:min-w-[800px]">
        <div className=""> {children} </div>
      </div>
      <div className="w-full flex-1 bg-neutral-100">
        <div className="sticky left-20 top-20 mx-6 my-10 h-[calc(100vh-20rem)] w-[300px] ">
          <Toc />
        </div>
      </div>
    </div>
  );
}
