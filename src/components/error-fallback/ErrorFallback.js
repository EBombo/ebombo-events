import React, {useEffect} from "reactn";
import {Button} from "antd";
import {useSendError} from "../../hooks";

export const ErrorFallback = (props) => {
    const {sendError} = useSendError();

    useEffect(() => {
        sendError(props.error);
        if (props.error.data) console.debug(props.error.data);
    }, [props.error]);

    return <div className="container-error-server">
        <h3 style={{color: "#fff", textAlign: "center", marginBottom: "10px"}}>
            Ha ocurrido un error en el servidor. Por favor inténtelo nuevamente
            <pre>Error: {props.error.message}</pre>
        </h3>
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {
                props.resetErrorBoundary
                && <Button type="primary"
                           onClick={props.resetErrorBoundary}>
                    Intentar nuevamente
                </Button>
            }
            <Button type="default"
                    onClick={() => window.location.href = "/"}>
                Volver al inicio
            </Button>
        </div>
    </div>;
};
