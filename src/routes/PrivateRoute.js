import React, {useGlobal} from "reactn";
import {Redirect, Route} from "react-router-dom";

export const PrivateRoute = props => {
    const [authUser] = useGlobal("user");

    return <Route exact
                  path={props.path}
                  render={() => authUser
                      ? props.children
                      : <Redirect to="/"/>}
    />;
};
