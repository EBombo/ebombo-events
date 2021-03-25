import React, { useGlobal } from "reactn";
import { Redirect, Route } from "react-router-dom";

export const PrivateRoute = (props) => {
  const [globalUser] = useGlobal("user");

  return (
    <Route
      exact
      path={props.path}
      render={() => (globalUser ? props.children : <Redirect to="/" />)}
    />
  );
};
