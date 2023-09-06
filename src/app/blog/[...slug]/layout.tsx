import { Card, CardHeader, TabList, Label } from "@fluentui/react-components";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-1/3"></div>
      <div className="w-1/3 flex items-center justify-center">{children}</div>
      <div className="w-1/3 flex-col justify-start items-start">
        <Card>
          <CardHeader
            header={
              <Label>
                <span> On this Page </span>
              </Label>
            }
          />
        </Card>
      </div>
    </>
  );
}
