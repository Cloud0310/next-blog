"use client";
import * as React from "react";
import { Tab, tabClasses, TabList, Tabs } from "@mui/joy";

function getCurrentReadingPart() {}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative top-[60px] flex h-full w-full justify-center font-sans">
      <div className="flex-1 bg-neutral-100 "></div>
      <div className="bor mt-5 flex flex-1 justify-center border-x-neutral-300 px-20 lg:min-w-[800px]">
        <div> {children} </div>
      </div>
      <div className="w-full flex-1 bg-neutral-100">
        <div className="sticky left-20 top-20 mx-6 my-10 h-[calc(100vh-20rem)] w-[200px] ">
          <div className="my-2 rounded px-3 font-sans font-bold text-neutral-300 ">
            On this page
          </div>
          <Tabs
            aria-label="tabs"
            orientation="vertical"
            variant="soft"
            defaultValue={0}
            sx={{ bgcolor: "transparent" }}
          >
            <TabList
              disableUnderline
              sx={{
                p: 0.5,
                gap: 0.5,
                borderRadius: "xl",
                bgcolor: "background.level1",
                [`& .${tabClasses.root}[aria-selected="true"]`]: {
                  boxShadow: "sm",
                  bgcolor: "background.surface",
                },
              }}
            >
              <Tab disableIndicator>Feature</Tab>
              <Tab disableIndicator>Specifications</Tab>
              <Tab disableIndicator>Review</Tab>
              <Tab disableIndicator>Support</Tab>
            </TabList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
