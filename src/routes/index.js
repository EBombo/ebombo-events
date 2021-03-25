import React from "reactn";
import {lazy, Suspense} from "react";
import {Route, Switch} from "react-router-dom";
import {Redirect} from "react-router";
import {Registration,} from "../pages";
import {spinLoader} from "../utils";
import {LoginModal} from "../components";

const EventsLanding = lazy(() => import("../pages/events"));

export const Routes = (props) => {
    return (
        <Switch>
            <Route
                exact
                path="/"
                render={(props_) => (
                    <Suspense fallback={spinLoader()}>
                        <EventsLanding {...props_} />
                    </Suspense>
                )}
            />
            <Route
                exact
                path="/login"
                render={(props_) =>
                    <LoginModal {...props}/>}
            />
            <Route
                exact
                path="/register"
                render={(props_) =>
                    <Registration/>}
            />
            <Redirect to="/"/>
        </Switch>
    );
};
