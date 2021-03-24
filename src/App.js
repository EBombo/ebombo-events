import React, {useEffect, useGlobal} from "reactn";
import {BrowserRouter} from "react-router-dom";
import {Routes} from "./routes";
import {ScrollTop} from "./ScrollTop";
import {withAuthentication} from "./session/withAuthentication";
import {useUser} from "./hoc";
import {notification} from "antd";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorFallback} from "./components/error-fallback/ErrorFallback";

const App = () => {

    const [authUser] = useGlobal("user");
    const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
    const [, setAuthUserLocalStorage] = useUser();

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        authUser ? setIsVisibleLoginModal(false) : setAuthUserLocalStorage.reset();
    }, [authUser, setIsVisibleLoginModal]);

    const initialize = async () => {
        console.log("init with WebPack");
    }

    const showNotificationAnt = (message, description, type = "error") =>
        notification[type]({message, description});

    return <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ScrollTop>
                <Routes showNotification={showNotificationAnt}/>
            </ScrollTop>
        </ErrorBoundary>
    </BrowserRouter>;
};

export default withAuthentication(App);
