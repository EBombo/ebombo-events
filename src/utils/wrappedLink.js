import { Link } from "react-router-dom";
import React from "react";

export const wrappedLink = (path, component, properties) => {
  return (
    <Link to={path} {...properties}>
      {component}
    </Link>
  );
};
