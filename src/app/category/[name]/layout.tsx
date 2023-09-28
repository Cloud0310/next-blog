import {ReactNode} from "react";
import Toc from "@/components/toc";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative top-[60px] flex h-full w-full font-sans">
      <div className="flex-1 bg-neutral-100 "></div>
      <div className="min-h-[calc(100vh-60px)] flex-1 border-x-neutral-300 px-20 pb-80 lg:min-w-[800px]">
        <div> {children} </div>
      </div>
      <div className="w-full flex-1 bg-neutral-100"></div>
    </div>
  );
}