import { ReactNode } from "react";

function getCurrentReadingPart() {}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative top-[60px] flex h-full w-full justify-center font-sans">
      <div className="flex-1 bg-neutral-100 "></div>
      <div className="mt-5 flex-1 justify-center border-x-neutral-300 px-20 lg:min-w-[800px]">
        <div className=""> {children} </div>
      </div>
      <div className="w-full flex-1 bg-neutral-100">
        <div className="sticky left-20 top-20 mx-6 my-10 h-[calc(100vh-20rem)] w-[200px] ">
          <div className="my-2 rounded px-3 font-sans font-bold text-neutral-300 ">
            On this page
          </div>
        </div>
      </div>
    </div>
  );
}
