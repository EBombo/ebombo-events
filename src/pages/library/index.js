import React from "reactn";
import { Desktop, Tablet } from "../../constants";
import { TabletLibrary } from "./TabletLibrary";
import { DesktopLibrary } from "./DesktopLibrary";

export const LibraryContainer = (props) => (
  <div className="w-full">
    <Desktop>
      <DesktopLibrary {...props} />
    </Desktop>
    <Tablet>
      <TabletLibrary {...props} />
    </Tablet>
  </div>
);

