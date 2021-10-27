import React from "reactn";
import dynamic from "next/dynamic";
import { spinLoader } from "../../src/components/common/loader";
import { SEOMeta } from "../../src/components/common/seo";
import Login from "../../src/pages/login";

const UserLayout = dynamic(() => import("../../src/components/UserLayout"), {
    ssr: false,
    loading: () => spinLoader(),
});

const Registration = (props) => (
    <>
        <SEOMeta {...props} />
        <UserLayout {...props}>
            <Login {...props} />
        </UserLayout>
    </>
);

export default Registration;
