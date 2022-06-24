import React from "reactn";

export const Overlay = (props) => (
  <>
    <div className={`fixed z-40 top-0 right-0 bottom-0 left-0 bg-secondaryDark bg-opacity-70 animate-fade-in`}>
      <div className="w-full h-full flex justify-center items-center">{props.children}</div>
    </div>
  </>
);
