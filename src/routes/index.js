import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {spinLoader} from "../utils/loader";
import loadable from "@loadable/component";

const Events = loadable(() =>
    import(
        /* webpackChunkName: "users-list" */
        "../pages/components"), {
    fallback: spinLoader(),
});

export const Routes = (props) =>
    <Switch>
        <Route exact
               path="/"
               render={(props_) =>
                   <Events {...props} {...props_}/>
               }
        />
        <Redirect to="/"/>
    </Switch>;
